import { NextResponse } from "next/server";

/**
 * Per-IP fixed-window limits for the API routes that relay to WordPress.
 * Counts live in one server instance's memory, so they stop bursts from a
 * single client; a Vercel Firewall rate-limit rule is the durable control.
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
const MAX_TRACKED_CLIENTS = 5_000;

export type RateLimit = { name: string; limit: number; windowMs: number };

export const RATE_LIMITS = {
  chat: { name: "chat", limit: 20, windowMs: 60_000 },
  chatOutcome: { name: "chat-outcome", limit: 30, windowMs: 60_000 },
  lead: { name: "lead", limit: 5, windowMs: 10 * 60_000 },
} as const satisfies Record<string, RateLimit>;

/** Vercel overwrites x-forwarded-for with the real client address. */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Returns a 429 response when the client is over the limit, otherwise null. */
export function rateLimited(request: Request, rule: RateLimit): NextResponse | null {
  const now = Date.now();
  const key = `${rule.name}:${clientIp(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_CLIENTS) {
      for (const [entry, window] of buckets) {
        if (window.resetAt <= now) buckets.delete(entry);
      }
      if (buckets.size >= MAX_TRACKED_CLIENTS) buckets.clear();
    }
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= rule.limit) return null;

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return NextResponse.json(
    { ok: false, error: "Too many requests. Please wait a moment and try again." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
