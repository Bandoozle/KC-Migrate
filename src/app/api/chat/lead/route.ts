import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";

export const runtime = "nodejs";

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

  const endpoint = `${getWordPressUrl()}/wp-json/aca/v1/lead`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!response.ok) {
      return NextResponse.json(
        { error: (data?.error as string) || "Lead submission failed." },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    return NextResponse.json({ ok: true, ...(data || {}) });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit lead." },
      { status: 502 },
    );
  }
}
