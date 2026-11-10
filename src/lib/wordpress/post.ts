import { cache } from "react";
import { getLocalArticle } from "@/lib/content/local-articles";
import { CONTENT_ORIGIN, decodeRenderedText } from "@/lib/wordpress";
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
  // The full original: WordPress's "large" size here is only 750px wide, which the
  // article shows at 900px. next/image serves each screen a right-sized copy anyway.
  const large = media.media_details?.sizes?.large;
  const src = media.source_url || large?.source_url;
  if (!src) return null;
  const full = src === media.source_url;
  return {
    src,
    alt: media.alt_text || title,
    width: full ? media.media_details?.width : large?.width,
    height: full ? media.media_details?.height : large?.height,
  };
}

function contentOrigin(post: PostWithEmbed): string {
  try {
    return new URL(post.link).origin;
  } catch {
    return CONTENT_ORIGIN;
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

export const getArticleBySlug = cache(
  async (slug: string): Promise<ArticleContent | null> => {
    const article = getLocalArticle(slug);
    return article?.content?.rendered ? normalizePostContent(article) : null;
  },
);

export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return decodeRenderedText(iso);
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
