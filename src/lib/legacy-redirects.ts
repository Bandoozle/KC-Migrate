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
    destination: "/media-buying-canada/",
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
  // Legacy "blog-" article slugs (Bretton’s audit, Nov 2026): each goes straight to its clean URL
  {
    source: "/blog-black-friday-advertising",
    destination: "/black-friday-advertising/",
    statusCode: 301,
  },
  {
    source: "/blog-dental-marketing",
    destination: "/dental-marketing-custom-websites/",
    statusCode: 301,
  },
  {
    source: "/blog-digital-tv-advertising-ad-creative",
    destination: "/ad-creative-digital-tv-advertising/",
    statusCode: 301,
  },
  {
    source: "/blog-golf-marketing-strategies",
    destination: "/golf-course-branding/",
    statusCode: 301,
  },
  {
    source: "/blog-hvac-website-development",
    destination: "/hvac-website-development/",
    statusCode: 301,
  },
  {
    source: "/blog-importance-of-social-media-marketing",
    destination: "/importance-of-social-media-marketing/",
    statusCode: 301,
  },
  {
    source: "/blog-kosick-com-corporate-branding-guide",
    destination: "/corporate-branding-guide/",
    statusCode: 301,
  },
  {
    source: "/blog-media-buying-canada-tv-streaming-radio",
    destination: "/media-buying-canada/",
    statusCode: 301,
  },
  {
    source: "/blog-social-media-marketing",
    destination: "/social-media-golf-resorts-real-estate/",
    statusCode: 301,
  },
  {
    source: "/blog-tiktok-instagram-facebook-ad-safe-zones",
    destination: "/ad-safe-zones-tiktok-instagram-facebook/",
    statusCode: 301,
  },
  // A distinct dealer-marketing article whose old slug read like a duplicate of /hvac-marketing-strategies/
  {
    source: "/hvac-marketing-strategies-guide",
    destination: "/hvac-dealer-marketing/",
    statusCode: 301,
  },
  // Nov 22, 2026 redirect audit: WordPress URLs Google still knows that answered 404 after the migration.
  // Real 301s (statusCode), like the Nov 2026 entries above; sources are written without the trailing slash
  // and match both forms. Each lands on the closest equivalent page in a single hop.
  // HVAC
  {
    source: "/hvac-lead-generation",
    destination: "/services/hvac-marketing/",
    statusCode: 301,
  },
  {
    source: "/hvac-lead-generation-2",
    destination: "/services/hvac-marketing/",
    statusCode: 301,
  },
  {
    source: "/blog-hvac-marketing-guide",
    destination: "/services/hvac-marketing/",
    statusCode: 301,
  },
  // Social media
  {
    source: "/blog-what-is-social-marketing",
    destination: "/what-is-social-marketing/",
    statusCode: 301,
  },
  {
    source: "/social-media-marketing",
    destination: "/services/social-media-marketing/",
    statusCode: 301,
  },
  // Local Vancouver destination, kept on purpose
  {
    source: "/social-media-content-creation-vancouver",
    destination: "/social-media-advertising-vancouver/",
    statusCode: 301,
  },
  {
    source: "/social-organic-and-paid-marketing-agency",
    destination: "/organic-social-media-vs-paid-advertising/",
    statusCode: 301,
  },
  // Branding
  {
    source: "/strategic-vancouver-branding-company",
    destination: "/services/corporate-branding/",
    statusCode: 301,
  },
  {
    source: "/the-art-of-branding",
    destination: "/corporate-branding-guide/",
    statusCode: 301,
  },
  // Television and media buying
  {
    source: "/services/digital-video-advertising",
    destination: "/services/digital-connected-tv/",
    statusCode: 301,
  },
  {
    source: "/the-power-of-tv-advertising",
    destination: "/is-television-advertising-worth-it/",
    statusCode: 301,
  },
  {
    source: "/strategic-media-advertising",
    destination: "/media-buying-canada/",
    statusCode: 301,
  },
  // The source is a typo of the live slug and is kept exactly as Google knows it ("vancouve")
  {
    source: "/how-to-choose-a-marketing-company-in-vancouve",
    destination: "/how-to-choose-a-marketing-company-in-vancouver/",
    statusCode: 301,
  },
  {
    source: "/advertising-in-2026",
    destination: "/feature-articles/",
    statusCode: 301,
  },
  // Website development
  {
    source: "/website-development",
    destination: "/services/website-development/",
    statusCode: 301,
  },
  {
    source: "/blog-importance-of-website-development",
    destination: "/services/website-development/",
    statusCode: 301,
  },
  {
    source: "/websites-that-work-for-your-business",
    destination: "/services/website-development/",
    statusCode: 301,
  },
  // Search, events, golf, creative and the remaining service guides
  {
    source: "/ai-search-optimization-guide",
    destination: "/services/search-engine-optimization/",
    statusCode: 301,
  },
  {
    source: "/corporate-events-travel-incentives-conferences",
    destination: "/corporate-events/",
    statusCode: 301,
  },
  {
    source: "/blog-golf-course-marketing",
    destination: "/services/golf-marketing/",
    statusCode: 301,
  },
  {
    source: "/services/creative-production",
    destination: "/services/creative/",
    statusCode: 301,
  },
  {
    source: "/integrated-marketing-drives-better-results",
    destination: "/marketing-programs/",
    statusCode: 301,
  },
  {
    source: "/the-power-of-geo-targeted-campaigns",
    destination: "/services/digital-marketing/",
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
