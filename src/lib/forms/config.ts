/**
 * Server-only (imported by API routes): contact and newsletter delivery settings. With none of these set, the forms
 * behave as before: each submission is relayed to the WordPress form, which
 * stores it and sends the emails.
 *
 * Phase 3a: set SUPABASE_URL + SUPABASE_SECRET_KEY to also store submissions.
 * Phase 3b: set FORMS_EMAIL=test (then live) with RESEND_API_KEY to send the
 * emails directly; set FORMS_WORDPRESS_RELAY=off once that path is proven.
 */
export type EmailMode = "off" | "test" | "live";

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function emailMode(): EmailMode {
  const mode = env("FORMS_EMAIL").toLowerCase();
  return mode === "live" || mode === "test" ? mode : "off";
}

export function wordpressRelayEnabled(): boolean {
  return env("FORMS_WORDPRESS_RELAY").toLowerCase() !== "off";
}

export function supabaseConfig(): { url: string; key: string } | null {
  // Accepts the bare host (`<ref>.supabase.co`) as well as the full https URL
  const raw = env("SUPABASE_URL").replace(/\/+$/, "");
  const url = raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw;
  const key = env("SUPABASE_SECRET_KEY");
  return url && key ? { url, key } : null;
}

export function resendConfig(): { apiUrl: string; key: string } | null {
  const key = env("RESEND_API_KEY");
  if (!key) return null;
  // The override exists for the local mock test (scripts/launch-qa/forms-mock.mjs)
  return { apiUrl: env("FORMS_RESEND_API_URL") || "https://api.resend.com", key };
}

export function turnstileConfig(): { verifyUrl: string; secret: string } | null {
  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) return null;
  return {
    verifyUrl:
      env("FORMS_TURNSTILE_VERIFY_URL") || "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    secret,
  };
}

export function mailSettings() {
  return {
    from: env("FORMS_FROM") || "Kosick Communications Ltd. <info@kosick.com>",
    notifyTo: env("FORMS_NOTIFY_TO") || "info@kosick.com",
    notifyBcc: env("FORMS_NOTIFY_BCC"),
    testTo: env("FORMS_TEST_TO"),
    alertTo: env("FORMS_ALERT_TO") || env("FORMS_NOTIFY_TO") || "info@kosick.com",
  };
}

export function ipHashSecret(): string {
  return env("IP_HASH_SECRET");
}

export function cronSecret(): string {
  return env("CRON_SECRET");
}
