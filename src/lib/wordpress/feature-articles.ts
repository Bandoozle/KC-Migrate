import { cache } from "react";
import * as cheerio from "cheerio";
import {
  getPageBySlug,
  getWordPressUrl,
  WordPressApiError,
} from "@/lib/wordpress";
import type { ArticleListItem } from "@/components/sections/ArticleListing";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";

export type FeatureArticlesContent = {
  title: string;
  heroTitle: string;
  heroBackground: string | null;
  articles: ArticleListItem[];
};

type EmbeddedPost = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        sizes?: Record<string, { source_url?: string }>;
      };
    }>;
  };
};

async function fetchPostsWithMedia(perPage = 50): Promise<EmbeddedPost[]> {
  const origin = getWordPressUrl();
  const endpoint = `${origin}/wp-json/wp/v2/posts?per_page=${Math.min(perPage, 100)}&status=publish&_embed=1&orderby=date&order=desc`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress posts endpoint. ${reason}`,
      undefined,
      endpoint,
    );
  }

  if (!response.ok) {
    throw new WordPressApiError(
      `WordPress API returned ${response.status} for posts listing.`,
      response.status,
      endpoint,
    );
  }

  return (await response.json()) as EmbeddedPost[];
}

export const getFeatureArticlesContent = cache(
  async (): Promise<FeatureArticlesContent> => {
    const page = await getPageBySlug("feature-articles");
    if (!page) {
      throw new WordPressApiError(
        "Feature articles page was not returned by WordPress REST.",
      );
    }

    const origin = getWordPressUrl();
    let heroTitle = "The Latest In Marketing";
    let heroBackground: string | null = null;

    if (page.content?.rendered) {
      const $ = cheerio.load(page.content.rendered);
      const heading = cleanText(
        $(".wp-block-kadence-advancedheading, h1, h2").first().text(),
      );
      if (heading) heroTitle = heading;

      const bgMatch = page.content.rendered.match(
        /background-image:\s*url\((['"]?)([^)'"]+)\1\)/i,
      );
      heroBackground = absUrl(bgMatch?.[2] || null, origin);
    }

    const posts = await fetchPostsWithMedia(50);

    const articles: ArticleListItem[] = posts.map((post) => {
      const media = post._embedded?.["wp:featuredmedia"]?.[0];
      const imageSrc =
        media?.media_details?.sizes?.large?.source_url ||
        media?.media_details?.sizes?.medium_large?.source_url ||
        media?.source_url ||
        null;

      return {
        title: cleanText(post.title.rendered),
        excerpt: cleanText(post.excerpt.rendered),
        href: toLocalPath(post.link, origin) || `/${post.slug}/`,
        image: imageSrc
          ? {
              src: imageSrc,
              alt: media?.alt_text || cleanText(post.title.rendered),
            }
          : null,
      };
    });

    return {
      title: cleanText(page.title.rendered) || "Feature Articles",
      heroTitle,
      heroBackground,
      articles,
    };
  },
);
