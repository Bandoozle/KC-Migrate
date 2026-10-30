import { getWordPressUrl } from "@/lib/wordpress";
import type { KadenceFormDefinition } from "@/lib/wordpress/kadence-forms";

/**
 * Submits to the WordPress Kadence form, which stores the entry and sends the
 * notification and auto-response itself. Kept until the direct path (Supabase +
 * Resend) is proven; FORMS_WORDPRESS_RELAY=off turns it off.
 */
type KadenceAjaxResponse = {
  success?: boolean;
  html?: string;
  submissionResults?: { success?: boolean; entry_id?: number };
};

function isKadenceSuccess(payload: KadenceAjaxResponse | null): boolean {
  if (!payload || typeof payload !== "object") return false;
  if (payload.success === true) return true;
  if (payload.submissionResults?.success === true) return true;
  return typeof payload.html === "string" && /kb-adv-form-success/i.test(payload.html);
}

function buildPayload(form: KadenceFormDefinition, values: Record<string, string>): FormData {
  const payload = new FormData();
  payload.set("action", "kb_process_advanced_form_submit");
  payload.set("_kb_adv_form_post_id", form.postId);
  payload.set("_kb_adv_form_id", form.formId);
  for (const [key, field] of Object.entries(form.fields)) {
    payload.set(field.name, values[key] ?? "");
  }
  return payload;
}

export type RelayResult =
  | { status: "sent"; entryId: number | null }
  | { status: "rejected" | "unreachable" };

/** "sent" only when Kadence reports success: HTTP 200 alone is not enough. */
export async function relayToWordPress(
  form: KadenceFormDefinition,
  values: Record<string, string>,
): Promise<RelayResult> {
  try {
    const response = await fetch(`${getWordPressUrl()}/wp-admin/admin-ajax.php`, {
      method: "POST",
      body: buildPayload(form, values),
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok && response.status !== 302) return { status: "unreachable" };
    const parsed = (await response.json().catch(() => null)) as KadenceAjaxResponse | null;
    return isKadenceSuccess(parsed)
      ? { status: "sent", entryId: parsed?.submissionResults?.entry_id ?? null }
      : { status: "rejected" };
  } catch {
    return { status: "unreachable" };
  }
}
