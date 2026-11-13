import type { MetadataRoute } from "next";
import { getLocalArticle } from "@/lib/content/local-articles";
import { INDUSTRY_PAGE_PATHS } from "@/lib/industries";
import { isRedirectedPath } from "@/lib/legacy-redirects";
import { isPublicPath } from "@/lib/public-routes";
import { PRIVACY_POLICY_PATH, PRIVACY_POLICY_PUBLISHED } from "@/lib/privacy-policy";
import { listIndexableUrls } from "@/lib/seo/rank-math";
import { canonicalUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * Canonical indexable URLs only. KML, sitemap files, redirected and unrouted URLs stay out of this list.
 * Industry pages built on the new site have no Rank Math record, so they are added from the registry.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const captured = await listIndexableUrls();
  // Service pages built on the new site (no Rank Math record yet)
  const native = [
    ...INDUSTRY_PAGE_PATHS,
    "/services/google-ads-management/",
    "/services/chatgpt-ads-management/",
    ...(PRIVACY_POLICY_PUBLISHED ? [PRIVACY_POLICY_PATH] : []),
  ];
  const urls = [...new Set([...captured, ...native.map((path) => canonicalUrl(path))])];
  return urls
    .filter((url) => isPublicPath(url) && !isRedirectedPath(url))
    .map((url) => {
      // Articles carry a real modified date; pages get none rather than a guessed one
      const article = getLocalArticle(new URL(url).pathname.replace(/^\/|\/$/g, ""));
      const modified = article ? Date.parse(`${article.modified_gmt ?? article.modified}Z`) : NaN;
      return Number.isNaN(modified) ? { url } : { url, lastModified: new Date(modified) };
    });
}
