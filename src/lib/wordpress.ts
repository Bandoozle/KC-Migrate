import { LOCAL_PAGES } from "@/content/pages";
import { getLocalArticle } from "@/lib/content/local-articles";
import type { WordPressPage, WordPressPost } from "@/types/wordpress";

const DEFAULT_WORDPRESS_URL = "https://staging.kosick.com";

/**
 * The host the saved content in src/content/ was exported from. Links and media
 * URLs inside that HTML point here, so the parsers resolve against it rather
 * than against WORDPRESS_URL.
 */
export const CONTENT_ORIGIN = "https://staging.kosick.com";

export class WordPressApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly endpoint?: string,
  ) {
    super(message);
    this.name = "WordPressApiError";
  }
}

/** WordPress backend for the form and chat relays, which still post to it. */
export function getWordPressUrl(): string {
  const configured = process.env.WORDPRESS_URL?.trim() || DEFAULT_WORDPRESS_URL;
  return configured.replace(/\/+$/, "");
}

/** A page saved in src/content/pages/ (the WordPress REST response for that slug). */
export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
  return Object.hasOwn(LOCAL_PAGES, slug) ? LOCAL_PAGES[slug] : null;
}

/** A feature article saved in src/content/articles/. */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  return getLocalArticle(slug);
}

export function decodeRenderedText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}
