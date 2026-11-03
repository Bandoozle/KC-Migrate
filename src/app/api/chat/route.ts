import { NextResponse } from "next/server";
import { relayToWordPress } from "@/lib/wordpress-relay";
import { RATE_LIMITS, rateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";
// The plugin waits up to 30s on its AI call; leave room for the relay timeout below
export const maxDuration = 40;

const CHAT_TIMEOUT_MS = 32_000;

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatBody = {
  messages?: ChatMessage[];
  sessionId?: string;
  pageUrl?: string;
};

function isMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as ChatMessage;
  return (
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    m.content.trim().length > 0 &&
    m.content.length < 8000
  );
}

/**
 * Proxy to WordPress AI Chat Assistant (`aca/v1/chat`).
 * Keeps the WP plugin backend; no secrets exposed to the browser.
 * Public chat works without WP nonce (verified on staging).
 */
export async function POST(request: Request) {
  const limited = rateLimited(request, RATE_LIMITS.chat);
  if (limited) return limited;

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter(isMessage).slice(-40)
    : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "messages required." }, { status: 400 });
  }

  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.length < 120
      ? body.sessionId
      : undefined;
  const pageUrl =
    typeof body.pageUrl === "string" && body.pageUrl.length < 500
      ? body.pageUrl
      : undefined;

  const result = await relayToWordPress({
    route: "aca/v1/chat",
    body: { messages, sessionId, pageUrl },
    timeoutMs: CHAT_TIMEOUT_MS,
    fallbackError:
      "Sorry, the assistant is not available right now. Please try again in a moment, or call us at 604-925-5800.",
    exposeServerErrors: true,
    label: "chat",
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const reply = typeof result.data.reply === "string" ? result.data.reply : "";
  if (!reply.trim()) {
    console.error("[wordpress-relay] chat returned an empty reply");
    return NextResponse.json(
      { error: "Sorry, something went wrong. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ reply, cta: result.data.cta ?? null });
}
