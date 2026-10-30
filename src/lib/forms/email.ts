import { emailMode, mailSettings, resendConfig } from "@/lib/forms/config";
import type { KadenceFormDefinition } from "@/lib/wordpress/kadence-forms";

/**
 * Notification and auto-response emails for the contact and newsletter forms,
 * reproducing Kadence forms 11283 and 11281 (sender, subjects, Reply-To and
 * auto-response text as configured in WordPress, October 2026). The newsletter
 * auto-response subject was changed from "Thanks for contacting us!".
 */
export type FormKind = "contact" | "newsletter";

const NOTIFICATION_SUBJECT: Record<FormKind, string> = {
  contact: "Kosick Communications Ltd. contact",
  newsletter: "Kosick Communications Ltd. subscribe form",
};

const AUTORESPONSE_SUBJECT: Record<FormKind, string> = {
  contact: "Kosick Communications Ltd. Contact",
  newsletter: "Thanks for subscribing!",
};

const AUTORESPONSE_LINES = [
  "Thank you for visiting Kosick Communications. Your message has been received.",
  "If we can be of any assistance, please email or call anytime using the information below.",
  "",
  "Regards,",
  "Kosick Communications Ltd.",
  "",
  "Phone: 604.925.5800",
];

type Email = {
  to: string[];
  bcc?: string[];
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlLines(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, "<br>");
}

/** The fields and values, in form order, as Kadence's default notification lists them. */
export function notificationEmail(
  kind: FormKind,
  form: KadenceFormDefinition,
  values: Record<string, string>,
): Email {
  const { notifyTo, notifyBcc } = mailSettings();
  const rows = Object.entries(form.fields).map(([key, field]) => ({
    label: field.label,
    value: values[key] || "",
  }));
  return {
    to: [notifyTo],
    bcc: notifyBcc ? [notifyBcc] : undefined,
    replyTo: values.email || undefined,
    subject: NOTIFICATION_SUBJECT[kind],
    html: rows
      .map((row) => `<p><strong>${escapeHtml(row.label)}:</strong> ${htmlLines(row.value)}</p>`)
      .join("\n"),
    text: rows.map((row) => `${row.label}: ${row.value}`).join("\n"),
  };
}

/** Sent to the visitor. Contains nothing they typed, so the form cannot relay a message. */
export function autoresponseEmail(kind: FormKind, visitorEmail: string): Email {
  return {
    to: [visitorEmail],
    subject: AUTORESPONSE_SUBJECT[kind],
    html: AUTORESPONSE_LINES.map((line) => (line ? `<p>${escapeHtml(line)}</p>` : "")).join("\n"),
    text: AUTORESPONSE_LINES.join("\n"),
  };
}

/**
 * Sends through Resend. In test mode every recipient becomes FORMS_TEST_TO and the
 * subject is marked, so Preview deployments never email info@ or a visitor.
 * The idempotency key makes a retried send a no-op if the first one went through.
 */
export async function sendEmail(email: Email, idempotencyKey: string): Promise<SendResult> {
  const mode = emailMode();
  const resend = resendConfig();
  const { from, testTo } = mailSettings();
  if (mode === "off") return { ok: false, error: "Email sending is off (FORMS_EMAIL)." };
  if (!resend) return { ok: false, error: "RESEND_API_KEY is not set." };
  if (mode === "test" && !testTo) return { ok: false, error: "FORMS_TEST_TO is not set." };

  const test = mode === "test";
  const body = {
    from,
    to: test ? [testTo] : email.to,
    bcc: test ? undefined : email.bcc,
    reply_to: email.replyTo,
    subject: test ? `[TEST to ${email.to.join(", ")}] ${email.subject}` : email.subject,
    html: email.html,
    text: email.text,
  };

  try {
    const response = await fetch(`${resend.apiUrl}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend.key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!response.ok || !result?.id) {
      return { ok: false, error: `Resend ${response.status}: ${result?.message || "no message id"}` };
    }
    return { ok: true, id: result.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Resend request failed" };
  }
}
