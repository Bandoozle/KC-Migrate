import { cache } from "react";
import { getLocalPostWithEmbed } from "@/lib/content/local-articles";
import {
  recallWordPressBody,
  rememberWordPressBody,
  withWordPressSlot,
} from "@/lib/wordpress-fetch-guard";
import { REQUEST_TIMEOUT_MS, decodeRenderedText, getPostBySlug, getWordPressUrl, WORDPRESS_REVALIDATE_SECONDS, WordPressApiError } from "@/lib/wordpress";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";
import { assignArticleHeadingIds, type ArticleTocItem } from "@/lib/content/article-toc";
import { normalizeArticleHtml } from "@/lib/wordpress/normalize-article-html";

export type ArticleMedia = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type ArticleContent = {
  id: number;
  slug: string;
  path: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage: ArticleMedia | null;
  bodyHtml: string;
  toc: ArticleTocItem[];
};

type EmbeddedMedia = {
  source_url?: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { source_url?: string; width?: number; height?: number }>;
  };
};

type PostWithEmbed = {
  id: number;
  slug: string;
  link: string;
  date: string;
  modified?: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: EmbeddedMedia[];
  };
};

function pickFeaturedImage(media: EmbeddedMedia | undefined, title: string): ArticleMedia | null {
  if (!media?.source_url) return null;
  const large = media.media_details?.sizes?.large;
  const mediumLarge = media.media_details?.sizes?.medium_large;
  const src = large?.source_url || mediumLarge?.source_url || media.source_url;
  if (!src) return null;
  return {
    src,
    alt: media.alt_text || title,
    width: large?.width || media.media_details?.width,
    height: large?.height || media.media_details?.height,
  };
}

function contentOrigin(post: PostWithEmbed): string {
  try {
    return new URL(post.link).origin;
  } catch {
    return getWordPressUrl();
  }
}

export function normalizePostContent(post: PostWithEmbed): ArticleContent {
  const origin = contentOrigin(post);
  const title = cleanText(post.title.rendered);
  const excerpt = cleanText(post.excerpt.rendered);
  const path = toLocalPath(post.link, origin) || `/${post.slug}/`;
  const featured = pickFeaturedImage(post._embedded?.["wp:featuredmedia"]?.[0], title);
  const rawBody = post.content?.rendered || "";

  const body = normalizeArticleHtml(rawBody, origin, {
    hasLeadingMedia: Boolean(featured?.src),
  });
  const { html: bodyHtml, toc } = assignArticleHeadingIds(body);

  return {
    id: post.id,
    slug: post.slug,
    path,
    title,
    excerpt,
    date: post.date,
    modified: post.modified || post.date,
    featuredImage: featured
      ? {
          ...featured,
          src: absUrl(featured.src, origin) || featured.src,
        }
      : null,
    bodyHtml,
    toc,
  };
}

async function fetchPostWithEmbedFrom(
  origin: string,
  slug: string,
): Promise<PostWithEmbed | null> {
  const endpoint = `${origin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=1`;

  try {
    return await withWordPressSlot(async () => {
      const response = await fetch(endpoint, {
        next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          const cached = recallWordPressBody(endpoint);
          if (cached) {
            const data = JSON.parse(cached) as PostWithEmbed[];
            return data[0] ?? null;
          }
        }
        throw new WordPressApiError(
          `WordPress API returned ${response.status} for post "${slug}".`,
          response.status,
          endpoint,
        );
      }

      const body = await response.text();
      const data = JSON.parse(body) as PostWithEmbed[];
      rememberWordPressBody(endpoint, body);
      return data[0] ?? null;
    });
  } catch (error) {
    const unavailable =
      !(error instanceof WordPressApiError) || (error.status ?? 500) >= 500;
    if (unavailable) {
      const cached = recallWordPressBody(endpoint);
      if (cached) {
        const data = JSON.parse(cached) as PostWithEmbed[];
        return data[0] ?? null;
      }
    }
    if (error instanceof WordPressApiError) throw error;
    const reason = error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress posts endpoint. ${reason}`,
      undefined,
      endpoint,
    );
  }
}

async function fetchPostWithEmbed(slug: string): Promise<PostWithEmbed | null> {
  try {
    return await fetchPostWithEmbedFrom(getWordPressUrl(), slug);
  } catch {
    return null;
  }
}

export const getArticleBySlug = cache(
  async (slug: string): Promise<ArticleContent | null> => {
    const local = getLocalPostWithEmbed(slug);
    if (local) return normalizePostContent(local);

    const post = await fetchPostWithEmbed(slug);
    if (!post?.content?.rendered && !post?.title?.rendered) {
      // Fallback to existing helper without embed if needed
      const basic = await getPostBySlug(slug);
      if (!basic?.content?.rendered) return null;
      return normalizePostContent({
        ...basic,
        modified: (basic as { modified?: string }).modified,
      });
    }
    return normalizePostContent(post);
  },
);

export async function listPublishedPostSlugs(): Promise<string[]> {
  const origin = getWordPressUrl();
  const slugs: string[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const endpoint = `${origin}/wp-json/wp/v2/posts?per_page=100&page=${page}&status=publish&_fields=slug`;
    const response = await withWordPressSlot(() =>
      fetch(endpoint, {
        next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }),
    );
    if (!response.ok) {
      throw new WordPressApiError(
        `WordPress API returned ${response.status} listing posts.`,
        response.status,
        endpoint,
      );
    }
    totalPages = Number(response.headers.get("x-wp-totalpages") || "1");
    const batch = (await response.json()) as Array<{ slug: string }>;
    for (const item of batch) {
      if (item.slug) slugs.push(item.slug);
    }
    page += 1;
  }

  return slugs;
}

export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return decodeRenderedText(iso);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
