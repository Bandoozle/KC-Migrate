import type { Metadata } from "next";
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
 * Rank Math head tags captured from www.kosick.com. Request time does not
 * fetch the live HTML. Refresh this file with a read-only snapshot when
 * WordPress SEO changes.
 */
export function getRankMathSeo(path: string): RankMathSeo | null {
  return seoSnapshot.pages[canonicalPath(path)] ?? null;
}

export function jsonLdForPath(path: string): unknown[] {
  const blocks = getRankMathSeo(path)?.jsonLd ?? [];
  const seen = new Set<string>();
  return blocks.filter((block) => {
    const key = JSON.stringify(block);
    if (seen.has(key)) return false;
    seen.add(key);
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

  return {
    title: { absolute: seo.title },
    description: seo.description || undefined,
    alternates: { canonical: seo.canonical },
    robots: { index: seo.index, follow: seo.follow },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription || undefined,
      url: seo.canonical,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

/** Indexable canonical URLs from the captured Rank Math sitemap. */
export async function listIndexableUrls(): Promise<string[]> {
  return [...seoSnapshot.urls].sort();
}
