import { cache } from "react";
import * as cheerio from "cheerio";
import {
  getPageBySlug,
  getWordPressUrl,
  WordPressApiError,
} from "@/lib/wordpress";
import type { ArticleListItem } from "@/components/sections/ArticleListing";
import { resourceTopicIds, resourceTopicLabel } from "@/lib/content/resource-topics";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";
import { resolveResourceImage, type EmbeddedFeaturedMedia } from "@/lib/wordpress/resource-image";

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
  content?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: EmbeddedFeaturedMedia[];
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
      const title = cleanText(post.title.rendered);
      const excerpt = cleanText(post.excerpt.rendered);
      const body = cleanText(post.content?.rendered || "").slice(0, 4000);
      const topics = resourceTopicIds(`${title} ${excerpt}`);
      const image = resolveResourceImage(
        post._embedded?.["wp:featuredmedia"]?.[0],
        post.content?.rendered || "",
        origin,
        title,
      );

      return {
        title,
        excerpt,
        href: toLocalPath(post.link, origin) || `/${post.slug}/`,
        image,
        searchText: `${title} ${excerpt} ${body}`.toLowerCase(),
        topics,
        label: resourceTopicLabel(topics),
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
