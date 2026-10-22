import { PRODUCTION_SITE_ORIGIN } from "@/lib/site";

export const revalidate = 3600;

/** Keeps the live Rank Math sitemap index URL working after cutover. */
export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${PRODUCTION_SITE_ORIGIN}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
