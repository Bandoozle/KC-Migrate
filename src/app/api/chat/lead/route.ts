import { NextResponse } from "next/server";
import { relayToWordPress } from "@/lib/wordpress-relay";
import { RATE_LIMITS, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

// Covers the plugin saving the lead and sending its notification email
const LEAD_TIMEOUT_MS = 20_000;

type LeadBody = {
  name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  message?: string;
  transcript?: unknown;
  pageUrl?: string;
  sessionId?: string;
};

function clean(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  const limited = rateLimited(request, RATE_LIMITS.lead);
  if (limited) return limited;

  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = clean(body.name, 200);
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const payload = {
    name,
    business_name: clean(body.business_name, 200),
    email: clean(body.email, 200),
    phone: clean(body.phone, 50),
    message: clean(body.message, 4000),
    transcript: Array.isArray(body.transcript) ? body.transcript.slice(-40) : [],
    pageUrl: clean(body.pageUrl, 500),
    sessionId: clean(body.sessionId, 120),
  };

  const result = await relayToWordPress({
    route: "aca/v1/lead",
    body: payload,
    timeoutMs: LEAD_TIMEOUT_MS,
    fallbackError:
      "We could not send your details just now. Please try again, or call us at 604-925-5800.",
    label: "lead",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, ...result.data });
}
