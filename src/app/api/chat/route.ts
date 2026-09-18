import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";

export const runtime = "nodejs";

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

  const endpoint = `${getWordPressUrl()}/wp-json/aca/v1/chat`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ messages, sessionId, pageUrl }),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!response.ok) {
      return NextResponse.json(
        { error: (data?.error as string) || "Chat request failed." },
        { status: response.status === 403 ? 502 : response.status },
      );
    }

    return NextResponse.json({
      reply: typeof data?.reply === "string" ? data.reply : "",
      cta: data?.cta ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach chat service." },
      { status: 502 },
    );
  }
}
