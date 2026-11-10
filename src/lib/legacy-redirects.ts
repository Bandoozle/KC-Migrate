/**
 * Permanent redirects for retired WordPress URLs. next.config.ts serves them,
 * and the sitemap and Site Map page leave their sources out so no listed URL
 * answers with a redirect.
 */
export const LEGACY_REDIRECTS = [
  {
    source: "/home",
    destination: "/",
  },
  {
    source: "/ga4-new-generation-google-analytics",
    destination: "/services/search-engine-optimization/",
  },
  {
    source: "/corporate-events-group-travel",
    destination: "/corporate-events/",
  },
  // Rank Math redirect on WordPress
  {
    source: "/services/media-buying",
    destination: "/blog-media-buying-canada-tv-streaming-radio/",
  },
  // Retired client-event microsites (NEE Mexico 2026 conference, Uncorked 2025)
  {
    source: "/comfortmaker",
    destination: "/corporate-events/",
  },
  {
    source: "/mexico-2026-welcome-itinerary",
    destination: "/corporate-events/",
  },
  {
    source: "/uncorked",
    destination: "/corporate-events/",
  },
  {
    source: "/blog",
    destination: "/feature-articles/",
  },
  // Fashion Marketing is now Retail Marketing; subpage slugs carry over
  {
    source: "/services/fashion-marketing",
    destination: "/services/retail-marketing/",
  },
  {
    source: "/services/fashion-marketing/:path*",
    destination: "/services/retail-marketing/:path*/",
  },
  {
    source: "/fashion-marketing",
    destination: "/services/retail-marketing/",
  },
  // Legacy combined medical/dental URL stays on dental; medical now has its own page
  {
    source: "/services/medical-dental-marketing",
    destination: "/services/dental-marketing/",
  },
  {
    source: "/services/medical-marketing",
    destination: "/services/medical-aesthetics-marketing/",
  },
  {
    source: "/services/medical-aesthetics",
    destination: "/services/medical-aesthetics-marketing/",
  },
  {
    source: "/feature-articles/page/:page*",
    destination: "/feature-articles/",
  },
  // Retired resource pages (Nov 2026): 301, as requested, rather than Next's default 308
  {
    source: "/services/hvac-marketing/hvac-lead-generation",
    destination: "/services/hvac-marketing/",
    statusCode: 301,
  },
  {
    source: "/services/outdoor-advertising/billboard-dimensions",
    destination: "/services/outdoor-advertising/",
    statusCode: 301,
  },
  // HVAC services reorganized (Nov 2026): the old subpages' content now lives on these
  {
    source: "/services/hvac-marketing/digital-marketing",
    destination: "/services/hvac-marketing/digital-advertising/",
    statusCode: 301,
  },
  {
    source: "/services/hvac-marketing/branding-advertising",
    destination: "/services/hvac-marketing/outdoor-advertising/",
    statusCode: 301,
  },
  // Rank Math sitemap files; the index at /sitemap_index.xml still points to /sitemap.xml
  {
    source: "/page-sitemap.xml",
    destination: "/sitemap.xml",
  },
  {
    source: "/post-sitemap.xml",
    destination: "/sitemap.xml",
  },
  // Rank Math's local SEO sitemap (it listed only /locations.kml, which still answers 200)
  {
    source: "/local-sitemap.xml",
    destination: "/sitemap.xml",
  },
] as const;

const redirectedPaths = new Set<string>(
  LEGACY_REDIRECTS.map((entry) => entry.source).filter((source) => !source.includes(":")),
);

/** True when a path or absolute URL is the source of a legacy redirect. */
export function isRedirectedPath(pathOrUrl: string): boolean {
  let pathname = pathOrUrl;
  try {
    pathname = new URL(pathOrUrl, "https://www.kosick.com").pathname;
  } catch {
    return false;
  }
  return redirectedPaths.has(pathname.replace(/\/+$/, "") || "/");
}

/** Where a redirected path now lives, so content links can skip the hop. */
export function redirectDestination(path: string): string | null {
  const normalized = path.split(/[?#]/)[0]?.replace(/\/+$/, "") || "/";
  return LEGACY_REDIRECTS.find((entry) => entry.source === normalized)?.destination ?? null;
}
