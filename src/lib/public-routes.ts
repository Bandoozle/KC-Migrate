import { localArticleSlugs } from "@/lib/content/local-articles";
import { INDUSTRY_PAGE_PATHS } from "@/lib/industries";

/**
 * The public page inventory. Native routes are listed so the sitemap and the
 * Site Map page can only show URLs that answer 200. The catch-all route serves
 * an article only when it has a saved content file: WordPress answering 200
 * for a path is not permission to render it.
 *
 * Publishing a new post: export it with scripts/export-wordpress-content.mjs
 * and refresh the Rank Math snapshot, or the post 404s on the new site.
 */

/** Indexable native pages (`/thanks/` is native but noindex, so it is not listed). */
export const PUBLIC_PAGE_PATHS = [
  "/",
  "/contact/",
  "/corporate-events/",
  "/feature-articles/",
  "/marketing-programs/",
  "/marketing-results/",
  "/online-payments/",
  "/site-map/",
  "/services/",
  "/services/business-development/",
  "/services/corporate-branding/",
  "/services/creative/",
  "/services/dental-marketing/",
  "/services/digital-connected-tv/",
  "/services/digital-marketing/",
  "/services/email-marketing/",
  "/services/golf-marketing/",
  "/services/hvac-marketing/",
  "/services/hvac-marketing/hvac-lead-generation/",
  "/services/outdoor-advertising/",
  "/services/outdoor-advertising/billboard-dimensions/",
  "/services/radio-advertising/",
  "/services/search-engine-optimization/",
  "/services/social-media-marketing/",
  "/services/television-advertising/",
  "/services/website-development/",
] as const;

/** Feature articles served at `/{slug}/`: one JSON file each in src/content/articles/. */
export const PUBLIC_ARTICLE_SLUGS: readonly string[] = localArticleSlugs();

const articleSlugs = new Set<string>(PUBLIC_ARTICLE_SLUGS);
const publicPaths = new Set<string>([
  ...PUBLIC_PAGE_PATHS,
  // New industry pages and every industry service subpage (src/lib/industries)
  ...INDUSTRY_PAGE_PATHS,
  ...PUBLIC_ARTICLE_SLUGS.map((slug) => `/${slug}/`),
]);

export function isPublicArticleSlug(slug: string): boolean {
  return articleSlugs.has(slug);
}

/** True when a path or absolute URL is an indexable page or article on the new site. */
export function isPublicPath(pathOrUrl: string): boolean {
  let pathname: string;
  try {
    pathname = new URL(pathOrUrl, "https://www.kosick.com").pathname;
  } catch {
    return false;
  }
  if (pathname !== "/" && !pathname.endsWith("/")) pathname = `${pathname}/`;
  return publicPaths.has(pathname);
}
