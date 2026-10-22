import travelArticle from "@/content/articles/travel-marketing-canada.json";
import type { WordPressPost } from "@/types/wordpress";

const localArticles = [travelArticle];

export function getLocalPost(slug: string): WordPressPost | null {
  const article = localArticles.find((item) => item.slug === slug);
  if (!article) return null;

  return {
    id: article.id,
    slug: article.slug,
    date: article.date,
    modified: article.modified,
    link: article.link,
    featured_media: article.featured_media,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    type: "post",
  };
}

export function getLocalPostWithEmbed(slug: string) {
  return localArticles.find((item) => item.slug === slug) ?? null;
}
