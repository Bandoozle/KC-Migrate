import type { MetadataRoute } from "next";
import { INDUSTRY_PAGE_PATHS } from "@/lib/industries";
import { isRedirectedPath } from "@/lib/legacy-redirects";
import { isPublicPath } from "@/lib/public-routes";
import { listIndexableUrls } from "@/lib/seo/rank-math";
import { canonicalUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * Canonical indexable URLs only. KML, sitemap files, redirected and unrouted URLs stay out of this list.
 * Industry pages built on the new site have no Rank Math record, so they are added from the registry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const captured = await listIndexableUrls();
  const urls = [...new Set([...captured, ...INDUSTRY_PAGE_PATHS.map((path) => canonicalUrl(path))])];
  return urls.filter((url) => isPublicPath(url) && !isRedirectedPath(url)).map((url) => ({ url }));
}
