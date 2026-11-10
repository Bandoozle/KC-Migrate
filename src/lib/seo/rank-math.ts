import type { Metadata } from "next";
import { OPENING_HOURS_SPECIFICATION } from "@/lib/business-hours";
import { getLocalArticle } from "@/lib/content/local-articles";
import snapshot from "@/lib/seo/rank-math-snapshot.json";
import { canonicalPath, canonicalUrl } from "@/lib/site";

export type RankMathSeo = {
  title: string;
  description: string;
  canonical: string;
  index: boolean;
  follow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  jsonLd: unknown[];
};

type Snapshot = {
  capturedAt: string;
  source: string;
  urls: string[];
  pages: Record<string, RankMathSeo>;
};

const seoSnapshot = snapshot as Snapshot;

/**
 * Corrections to captured Rank Math values that were defective on WordPress
 * (SEO audit, 10 Nov 2026). Everything not listed here is served exactly as
 * captured, so verified titles and descriptions are never overwritten.
 */
const SEO_OVERRIDES: Record<string, Partial<Pick<RankMathSeo, "description" | "ogDescription" | "follow">>> = {
  // `nofollow` on a service page stopped link equity to every page it links to
  "/services/creative/": { follow: true },
  // Rank Math generated "Pages Feature Articles" from the first headings
  "/site-map/": {
    description:
      "Every page on the Kosick Communications website in one place: marketing services, industry programs, results, events and feature articles.",
    ogDescription:
      "Every page on the Kosick Communications website in one place: marketing services, industry programs, results, events and feature articles.",
  },
  // Same wording as WordPress, without the stray ".604.925.5800" and the run-on heading
  "/services/digital-connected-tv/": {
    description:
      "Digital video advertising on connected TV and streaming. Elevate your brand with targeted reach, dynamic content and measurable results.",
    ogDescription:
      "Digital video advertising on connected TV and streaming. Elevate your brand with targeted reach, dynamic content and measurable results.",
  },
};

/**
 * Rank Math head tags captured from www.kosick.com. Request time does not
 * fetch the live HTML. Refresh this file with a read-only snapshot when
 * WordPress SEO changes.
 */
export function getRankMathSeo(path: string): RankMathSeo | null {
  const key = canonicalPath(path);
  const seo = seoSnapshot.pages[key];
  return seo ? { ...seo, ...SEO_OVERRIDES[key] } : null;
}

/*
 * Rank Math VideoObjects whose thumbnail file was never migrated (Google
 * rejects a VideoObject without a working thumbnailUrl). Videos with no
 * thumbnail at all are dropped by the same rule.
 */
const MISSING_VIDEO_THUMBNAILS = [
  /\/2023\/06\/KC-Mov-Thumb-1600\.jpg$/,
  // macOS screenshot name: the space before "PM" is not a plain space
  /\/2025\/07\/Screenshot-2025-07-16-at-10\.43\.00.PM\.webp$/,
];

/* The homepage VideoObjects describe the retired Vimeo hero; the new hero loop is decorative. */
const PAGES_WITHOUT_VIDEO_MARKUP = new Set(["/"]);

type JsonNode = Record<string, unknown>;

function isNode(value: unknown): value is JsonNode {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasType(node: JsonNode, type: string): boolean {
  const value = node["@type"];
  return Array.isArray(value) ? value.includes(type) : value === type;
}

function keepVideo(node: JsonNode, path: string): boolean {
  if (PAGES_WITHOUT_VIDEO_MARKUP.has(path)) return false;
  const thumbnail = node.thumbnailUrl;
  return typeof thumbnail === "string" && thumbnail !== "" && !MISSING_VIDEO_THUMBNAILS.some((re) => re.test(thumbnail));
}

/**
 * Removes markup the new site cannot back up: invalid or stale VideoObjects,
 * and the WordPress site-search action (the new site has no `?s=` search).
 * Replaces the business hours with the ones in src/lib/business-hours.ts.
 */
function sanitizeJsonLd(value: unknown, path: string): unknown {
  if (Array.isArray(value)) {
    return value
      .filter((item) => !(isNode(item) && hasType(item, "VideoObject") && !keepVideo(item, path)))
      .map((item) => sanitizeJsonLd(item, path));
  }
  if (!isNode(value)) return value;
  const out: JsonNode = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "potentialAction" && hasType(value, "WebSite")) continue;
    // Rank Math published 09:00-17:00; the office hours are 08:00-17:00 Pacific
    if (key === "openingHours" && hasType(value, "LocalBusiness")) {
      out.openingHoursSpecification = OPENING_HOURS_SPECIFICATION;
      continue;
    }
    if (isNode(child) && hasType(child, "VideoObject") && !keepVideo(child, path)) continue;
    out[key] = sanitizeJsonLd(child, path);
  }
  return out;
}

export function jsonLdForPath(path: string): unknown[] {
  const key = canonicalPath(path);
  const blocks = getRankMathSeo(key)?.jsonLd ?? [];
  const seen = new Set<string>();
  return blocks
    .map((block) => sanitizeJsonLd(block, key))
    .filter((block) => {
      if (isNode(block) && hasType(block, "VideoObject")) return keepVideo(block, key);
      const serialized = JSON.stringify(block);
      if (seen.has(serialized)) return false;
      seen.add(serialized);
      return true;
    });
}

export async function rankMathMetadata(path: string): Promise<Metadata> {
  const seo = getRankMathSeo(path);
  if (!seo) {
    return {
      title: { absolute: "Kosick Communications" },
      alternates: { canonical: canonicalUrl(path) },
    };
  }

  const article = getLocalArticle(canonicalPath(path).replace(/^\/|\/$/g, ""));
  const images = seo.ogImage ? [{ url: seo.ogImage }] : undefined;

  return {
    title: { absolute: seo.title },
    description: seo.description || undefined,
    alternates: { canonical: seo.canonical },
    robots: { index: seo.index, follow: seo.follow },
    openGraph: article
      ? {
          type: "article",
          siteName: SITE_NAME,
          locale: OG_LOCALE,
          title: seo.ogTitle,
          description: seo.ogDescription || undefined,
          url: seo.canonical,
          images,
          publishedTime: toIsoDate(article.date_gmt ?? article.date),
          modifiedTime: toIsoDate(article.modified_gmt ?? article.modified),
        }
      : {
          type: "website",
          siteName: SITE_NAME,
          locale: OG_LOCALE,
          title: seo.ogTitle,
          description: seo.ogDescription || undefined,
          url: seo.canonical,
          images,
        },
  };
}

const SITE_NAME = "Kosick Communications";
/* Matches the WordPress og:locale and <html lang="en-US"> */
const OG_LOCALE = "en_US";

/** WordPress `*_gmt` dates have no zone suffix. */
function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value}Z`;
  const time = Date.parse(iso);
  return Number.isNaN(time) ? undefined : new Date(time).toISOString();
}

/** Indexable canonical URLs from the captured Rank Math sitemap. */
export async function listIndexableUrls(): Promise<string[]> {
  return [...seoSnapshot.urls].sort();
}
