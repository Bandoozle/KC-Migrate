import { LOCAL_ARTICLES } from "@/content/articles";
import type { EmbeddedFeaturedMedia } from "@/lib/wordpress/resource-image";
import type { WordPressPost } from "@/types/wordpress";

/**
 * A feature article saved in src/content/articles/: the WordPress REST post
 * with `_embed`, exported by scripts/export-wordpress-content.mjs.
 * `travel-marketing-canada` was written for this site and has no WordPress post.
 */
export type LocalArticle = WordPressPost & {
  modified: string;
  _embedded?: {
    "wp:featuredmedia"?: EmbeddedFeaturedMedia[];
  };
};

export function getLocalArticle(slug: string): LocalArticle | null {
  return Object.hasOwn(LOCAL_ARTICLES, slug) ? LOCAL_ARTICLES[slug] : null;
}

export function localArticleSlugs(): string[] {
  return Object.keys(LOCAL_ARTICLES);
}

/** Newest first, the order the WordPress posts endpoint used (`orderby=date&order=desc`). */
export function listLocalArticles(): LocalArticle[] {
  return Object.values(LOCAL_ARTICLES).sort((a, b) => b.date.localeCompare(a.date));
}
