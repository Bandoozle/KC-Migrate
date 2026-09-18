import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  try {
    await fetch(`${getWordPressUrl()}/wp-json/aca/v1/conversation/outcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sessionId, outcome }),
      cache: "no-store",
      keepalive: true,
    });
  } catch {
    // Fire-and-forget analytics; don't fail the client UX.
  }

  return NextResponse.json({ ok: true });
}
