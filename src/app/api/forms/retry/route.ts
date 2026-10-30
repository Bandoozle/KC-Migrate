import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { cronSecret } from "@/lib/forms/config";
import { retryPendingDeliveries } from "@/lib/forms/submit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request, secret: string): boolean {
  const given = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Re-sends failed form notifications and re-relays submissions WordPress did not
 * accept. Called every 10 minutes by Supabase pg_cron (supabase/schedule-form-email-retry.sql)
 * or a Vercel cron job, with `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: Request) {
  const secret = cronSecret();
  if (!secret) return NextResponse.json({ ok: false, error: "Not configured." }, { status: 503 });
  if (!authorized(request, secret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, ...(await retryPendingDeliveries()) });
}
