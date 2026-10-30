import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() || "";
  if (host === "kosick.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.kosick.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|wp-content|wp-fonts|api/).*)",
  ],
};
