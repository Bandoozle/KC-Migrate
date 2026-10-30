import { createHmac } from "node:crypto";
import { ipHashSecret, turnstileConfig } from "@/lib/forms/config";

/** Scripts submit almost instantly. Kept low so a fast visitor using browser autofill is not rejected. */
export const MIN_FILL_MS = 1_500;

/** Vercel overwrites x-forwarded-for with the real client address. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "";
}

/** A keyed hash, so stored rows can be grouped by client without keeping the address. */
export function hashIp(ip: string): string | null {
  const secret = ipHashSecret();
  if (!ip || !secret) return null;
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/** The form reports how long it was open; a missing or tiny value is a script. */
export function filledTooFast(value: FormDataEntryValue | null): boolean {
  const elapsed = Number(typeof value === "string" ? value : "");
  return !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS;
}

/**
 * Cloudflare Turnstile check. Skipped while TURNSTILE_SECRET_KEY is unset;
 * once it is set, every submission needs a valid token.
 */
export async function turnstilePassed(token: FormDataEntryValue | null, ip: string): Promise<boolean> {
  const config = turnstileConfig();
  if (!config) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const body = new URLSearchParams({ secret: config.secret, response: token });
    if (ip) body.set("remoteip", ip);
    const response = await fetch(config.verifyUrl, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    return result?.success === true;
  } catch {
    return false;
  }
}
