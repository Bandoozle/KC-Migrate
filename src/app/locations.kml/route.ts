import { getWordPressUrl, WORDPRESS_REVALIDATE_SECONDS } from "@/lib/wordpress";

export const revalidate = 3600;

/** Proxies the staging Rank Math local sitemap so cutover does not call www. */
export async function GET() {
  const endpoint = `${getWordPressUrl()}/locations.kml`;
  const response = await fetch(endpoint, {
    next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
    headers: { Accept: "application/vnd.google-earth.kml+xml, application/xml, text/xml, */*" },
    signal: AbortSignal.timeout(20_000),
  });

  const body = await response.text();
  if (!response.ok || !body.includes("<kml")) {
    return new Response("Locations file is unavailable.", {
      status: 502,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.google-earth.kml+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
