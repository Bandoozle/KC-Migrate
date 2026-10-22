import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost, PRODUCTION_SITE_ORIGIN, requestHostname } from "@/lib/site";

/**
 * Preview and Vercel hostnames are not indexable. The production domain
 * keeps the live WordPress robots rules.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerStore = await headers();
  const host = requestHostname(headerStore.get("x-forwarded-host") || headerStore.get("host"));

  if (!isProductionHost(host)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/wp-admin/admin-ajax.php"],
      disallow: ["/wp-admin/"],
    },
    sitemap: `${PRODUCTION_SITE_ORIGIN}/sitemap_index.xml`,
  };
}
