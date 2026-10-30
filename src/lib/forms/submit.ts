import { randomUUID } from "node:crypto";
import { emailMode, mailSettings, resendConfig, wordpressRelayEnabled } from "@/lib/forms/config";
import { autoresponseEmail, notificationEmail, sendEmail, type FormKind } from "@/lib/forms/email";
import {
  countRows,
  findByIdempotencyKey,
  insertRow,
  selectRows,
  sinceIso,
  storeEnabled,
  updateRow,
  type FormTable,
  type StoredRow,
} from "@/lib/forms/store";
import { relayToWordPress, type RelayResult } from "@/lib/forms/wordpress-relay";
import { getKadenceForm } from "@/lib/wordpress/kadence-forms";

/**
 * One contact or newsletter submission, after validation and spam checks:
 *   1. store the row (Supabase, when configured; the idempotency key makes a resubmit a no-op)
 *   2. relay to the WordPress form (until FORMS_WORDPRESS_RELAY=off)
 *   3. send the notification to info@ directly (FORMS_EMAIL=test/live)
 * It succeeds when any of those succeeded, so a lead is never reported as sent
 * unless it is stored, accepted by WordPress or emailed. Anything still owed is
 * picked up by /api/forms/retry/. The visitor's auto-response is sent afterwards.
 */
export const TABLES: Record<FormKind, FormTable> = {
  contact: "contact_submissions",
  newsletter: "newsletter_signups",
};

export const LIMITS = {
  submissionsPerIp: 5,
  ipWindowMs: 10 * 60_000,
  autoresponsesPerRecipient: 2,
  recipientWindowMs: 24 * 60 * 60_000,
  newsletterRepeatWindowMs: 24 * 60 * 60_000,
  maxAttempts: 5,
} as const;

export type SubmissionInput = {
  kind: FormKind;
  values: Record<string, string>;
  submissionId: string | null;
  sourcePath: string | null;
  ipHash: string | null;
};

export type SubmissionOutcome =
  | { status: "ok"; entryId: number | null; followUp: (() => Promise<void>) | null }
  | { status: "rate_limited" }
  | { status: "failed"; relay: RelayResult["status"] | "off" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function directEmailEnabled(): boolean {
  return emailMode() !== "off" && resendConfig() !== null;
}

function rowColumns(kind: FormKind, values: Record<string, string>): Record<string, string | null> {
  if (kind === "newsletter") return { email: values.email };
  return {
    name: values.name,
    email: values.email,
    phone: values.phone,
    company: values.company || null,
    message: values.message || null,
  };
}

/** The form values a stored row holds, for re-sending its notification. */
function rowValues(kind: FormKind, row: StoredRow): Record<string, string> {
  const fields = Object.keys(getKadenceForm(kind).fields);
  return Object.fromEntries(fields.map((key) => [key, typeof row[key] === "string" ? (row[key] as string) : ""]));
}

function errorText(...errors: (string | null | undefined)[]): string | null {
  const text = errors.filter(Boolean).join("; ");
  return text ? text.slice(0, 500) : null;
}

// Per-instance fallback for the auto-response limit when nothing is stored
const recentAutoresponses = new Map<string, number[]>();

function underLocalRecipientLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const sent = (recentAutoresponses.get(key) || []).filter((at) => now - at < LIMITS.recipientWindowMs);
  if (sent.length >= LIMITS.autoresponsesPerRecipient) return false;
  if (recentAutoresponses.size > 5_000) recentAutoresponses.clear();
  recentAutoresponses.set(key, [...sent, now]);
  return true;
}

async function underRecipientLimit(email: string): Promise<boolean> {
  if (!storeEnabled()) return underLocalRecipientLimit(email);
  const filter = `email_normalized=eq.${encodeURIComponent(email.toLowerCase())}&autoresponse_status=eq.sent&created_at=gt.${sinceIso(LIMITS.recipientWindowMs)}`;
  const counts = await Promise.all(Object.values(TABLES).map((table) => countRows(table, filter)));
  const known = counts.filter((count): count is number => count !== null);
  // If the count is unavailable, fall back to this instance's memory rather than skipping the limit
  if (known.length < counts.length) return underLocalRecipientLimit(email);
  return known.reduce((sum, count) => sum + count, 0) < LIMITS.autoresponsesPerRecipient;
}

export async function processSubmission(input: SubmissionInput): Promise<SubmissionOutcome> {
  const { kind, values, sourcePath, ipHash } = input;
  const form = getKadenceForm(kind);
  const table = TABLES[kind];
  const store = storeEnabled();
  const relay = wordpressRelayEnabled();
  const direct = directEmailEnabled();
  const submissionId = input.submissionId && UUID.test(input.submissionId) ? input.submissionId : randomUUID();

  if (store && ipHash) {
    const recent = await countRows(
      table,
      `ip_hash=eq.${ipHash}&created_at=gt.${sinceIso(LIMITS.ipWindowMs)}`,
    );
    if (recent !== null && recent >= LIMITS.submissionsPerIp) return { status: "rate_limited" };
  }

  // 1. Store
  let row: StoredRow | null = null;
  if (store) {
    const inserted = await insertRow(table, {
      ...rowColumns(kind, values),
      idempotency_key: submissionId,
      source_path: sourcePath,
      ip_hash: ipHash,
      wordpress_relay_status: relay ? "pending" : "off",
      notification_status: direct ? "pending" : "skipped",
      autoresponse_status: direct ? "pending" : "skipped",
    });
    if (inserted === "duplicate") {
      // The same form instance was submitted again; the first request already succeeded
      if (await findByIdempotencyKey(table, submissionId)) return { status: "ok", entryId: null, followUp: null };
    } else {
      row = inserted;
    }
  }

  // A repeat newsletter signup within 24 hours is stored but not announced again
  let repeat = false;
  if (kind === "newsletter" && row) {
    const earlier = await countRows(
      table,
      `email_normalized=eq.${encodeURIComponent(values.email.toLowerCase())}&created_at=gt.${sinceIso(LIMITS.newsletterRepeatWindowMs)}&id=neq.${row.id}`,
    );
    repeat = (earlier ?? 0) > 0;
  }

  // 2. Relay to WordPress
  const relayResult: RelayResult | null = relay && !repeat ? await relayToWordPress(form, values) : null;
  const relayed = relayResult?.status === "sent";

  // 3. Notify info@ directly
  let notified = false;
  let notificationId: string | null = null;
  let notificationError: string | null = null;
  if (direct && !repeat) {
    const sent = await sendEmail(
      notificationEmail(kind, form, values),
      `${table}:${row?.id ?? submissionId}:notification`,
    );
    notified = sent.ok;
    notificationId = sent.ok ? sent.id : null;
    notificationError = sent.ok ? null : sent.error;
  }

  if (row) {
    await updateRow(table, row.id, {
      wordpress_relay_status: !relay ? "off" : repeat ? "skipped" : relayed ? "sent" : "failed",
      wordpress_relay_attempts: relay && !repeat ? 1 : 0,
      notification_status: !direct || repeat ? "skipped" : notified ? "sent" : "failed",
      notification_attempts: direct && !repeat ? 1 : 0,
      notification_id: notificationId,
      ...(repeat ? { autoresponse_status: "skipped" } : {}),
      last_error: errorText(relay && !repeat && !relayed ? "WordPress relay failed" : null, notificationError),
    });
  }

  if (!row && !relayed && !notified) {
    console.error(`[forms] ${kind} submission lost every delivery path (store, WordPress, email)`);
    return { status: "failed", relay: relayResult?.status ?? "off" };
  }
  // Storage-only (relay and email both off) is a configuration, not a failure
  if (row && (relay || direct) && !relayed && !notified && !repeat) {
    console.error(`[forms] ${kind} ${row.id} stored but not delivered yet; /api/forms/retry/ will retry`);
  }

  const followUp =
    direct && !repeat
      ? async () => {
          const allowed = await underRecipientLimit(values.email);
          const result = allowed
            ? await sendEmail(autoresponseEmail(kind, values.email), `${table}:${row?.id ?? submissionId}:autoresponse`)
            : null;
          if (row) {
            await updateRow(table, row.id, {
              autoresponse_status: !result ? "skipped" : result.ok ? "sent" : "failed",
              ...(result?.ok ? { autoresponse_id: result.id } : {}),
              ...(result && !result.ok ? { last_error: errorText(notificationError, result.error) } : {}),
            });
          }
        }
      : null;

  return { status: "ok", entryId: relayResult?.status === "sent" ? relayResult.entryId : null, followUp };
}

export type RetrySummary = {
  notificationsSent: number;
  notificationsFailed: number;
  relaysSent: number;
  relaysFailed: number;
  alerts: number;
};

async function alertGiveUp(kind: FormKind, row: StoredRow, what: string): Promise<boolean> {
  const values = rowValues(kind, row);
  const lines = [
    `A website ${kind} submission could not be delivered (${what}) after ${LIMITS.maxAttempts} attempts.`,
    `Stored in Supabase table ${TABLES[kind]}, id ${row.id}, received ${row.created_at}.`,
    "",
    ...Object.entries(getKadenceForm(kind).fields).map(([key, field]) => `${field.label}: ${values[key] || ""}`),
  ];
  const sent = await sendEmail(
    {
      to: [mailSettings().alertTo],
      replyTo: values.email || undefined,
      subject: `Website form delivery failed: ${kind}`,
      text: lines.join("\n"),
      html: lines.map((line) => `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>`).join("\n"),
    },
    `${TABLES[kind]}:${row.id}:alert:${what}`,
  );
  console.error(`[forms] gave up on ${what} for ${TABLES[kind]} ${row.id}; alert ${sent.ok ? "sent" : "not sent"}`);
  return sent.ok;
}

/**
 * Re-sends notifications and re-relays submissions that failed, oldest first,
 * for rows between 2 minutes and 7 days old, up to LIMITS.maxAttempts each.
 */
export async function retryPendingDeliveries(): Promise<RetrySummary> {
  const summary: RetrySummary = { notificationsSent: 0, notificationsFailed: 0, relaysSent: 0, relaysFailed: 0, alerts: 0 };
  if (!storeEnabled()) return summary;
  const window = `created_at=lt.${sinceIso(2 * 60_000)}&created_at=gt.${sinceIso(7 * 24 * 60 * 60_000)}`;

  for (const kind of Object.keys(TABLES) as FormKind[]) {
    const table = TABLES[kind];
    const form = getKadenceForm(kind);

    if (directEmailEnabled()) {
      const rows = await selectRows(
        table,
        `notification_status=in.(pending,failed)&notification_attempts=lt.${LIMITS.maxAttempts}&${window}&order=created_at.asc&limit=25`,
      );
      for (const row of rows) {
        const sent = await sendEmail(notificationEmail(kind, form, rowValues(kind, row)), `${table}:${row.id}:notification`);
        const attempts = row.notification_attempts + 1;
        await updateRow(table, row.id, {
          notification_status: sent.ok ? "sent" : "failed",
          notification_attempts: attempts,
          notification_id: sent.ok ? sent.id : null,
          last_error: sent.ok ? null : errorText(sent.error),
        });
        if (sent.ok) summary.notificationsSent += 1;
        else {
          summary.notificationsFailed += 1;
          if (attempts >= LIMITS.maxAttempts && (await alertGiveUp(kind, row, "notification email"))) summary.alerts += 1;
        }
      }
    }

    if (wordpressRelayEnabled()) {
      const rows = await selectRows(
        table,
        `wordpress_relay_status=eq.failed&wordpress_relay_attempts=lt.${LIMITS.maxAttempts}&${window}&order=created_at.asc&limit=25`,
      );
      for (const row of rows) {
        const relayed = (await relayToWordPress(form, rowValues(kind, row))).status === "sent";
        const attempts = Number(row.wordpress_relay_attempts ?? 0) + 1;
        await updateRow(table, row.id, {
          wordpress_relay_status: relayed ? "sent" : "failed",
          wordpress_relay_attempts: attempts,
        });
        if (relayed) summary.relaysSent += 1;
        else {
          summary.relaysFailed += 1;
          // Only alert when nothing else reached a person: a sent notification already did
          if (attempts >= LIMITS.maxAttempts && row.notification_status !== "sent") {
            if (await alertGiveUp(kind, row, "WordPress relay")) summary.alerts += 1;
            else console.error(`[forms] ${table} ${row.id} was never delivered; check Supabase`);
          }
        }
      }
    }
  }
  return summary;
}
