import { NextResponse } from "next/server";
import { relayToWordPress } from "@/lib/wordpress-relay";
import { RATE_LIMITS, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const OUTCOME_TIMEOUT_MS = 5_000;

export async function POST(request: Request) {
  const limited = rateLimited(request, RATE_LIMITS.chatOutcome);
  if (limited) return limited;

  let body: { sessionId?: string; outcome?: string };
  try {
    body = (await request.json()) as { sessionId?: string; outcome?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.slice(0, 120) : "";
  const outcome =
    typeof body.outcome === "string" ? body.outcome.slice(0, 80) : "";
  if (!sessionId || !outcome) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  // Analytics only: a slow or failed write is logged by the relay but never fails the visitor
  await relayToWordPress({
    route: "aca/v1/conversation/outcome",
    body: { sessionId, outcome },
    timeoutMs: OUTCOME_TIMEOUT_MS,
    fallbackError: "",
    label: "outcome",
  });

  return NextResponse.json({ ok: true });
}
