import { cache } from "react";
import {
  decodeRenderedText,
  getPostBySlug,
  getWordPressUrl,
  WORDPRESS_REVALIDATE_SECONDS,
  WordPressApiError,
} from "@/lib/wordpress";
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

export function normalizePostContent(post: PostWithEmbed): ArticleContent {
  const origin = getWordPressUrl();
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

async function fetchPostWithEmbed(slug: string): Promise<PostWithEmbed | null> {
  const origin = getWordPressUrl();
  const endpoint = `${origin}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=publish&_embed=1`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
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
      `WordPress API returned ${response.status} for post "${slug}".`,
      response.status,
      endpoint,
    );
  }

  const data = (await response.json()) as PostWithEmbed[];
  return data[0] ?? null;
}

export const getArticleBySlug = cache(
  async (slug: string): Promise<ArticleContent | null> => {
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
    const response = await fetch(endpoint, {
      next: { revalidate: WORDPRESS_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
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
