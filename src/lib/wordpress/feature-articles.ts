import { cache } from "react";
import * as cheerio from "cheerio";
import { CONTENT_ORIGIN, getPageBySlug, WordPressApiError } from "@/lib/wordpress";
import type { ArticleListItem } from "@/components/sections/ArticleListing";
import { resourceTopicIds, resourceTopicLabel } from "@/lib/content/resource-topics";
import travelArticle from "@/content/articles/travel-marketing-canada.json";
import { listLocalArticles } from "@/lib/content/local-articles";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";
import { isPublicPath } from "@/lib/public-routes";
import { resolveResourceImage } from "@/lib/wordpress/resource-image";

export type FeatureArticlesContent = {
  title: string;
  heroTitle: string;
  heroBackground: string | null;
  articles: ArticleListItem[];
};

export const getFeatureArticlesContent = cache(
  async (): Promise<FeatureArticlesContent> => {
    const page = await getPageBySlug("feature-articles");
    if (!page) {
      throw new WordPressApiError(
        "Feature articles page was not returned by WordPress REST.",
      );
    }

    const origin = CONTENT_ORIGIN;
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

    // The travel article has its own card below, with a local image
    const posts = listLocalArticles().filter((post) => post.slug !== travelArticle.slug);

    // Only articles the site serves: retired (redirected) and unlisted posts would 404 or redirect
    const articles: ArticleListItem[] = posts.filter((post) => isPublicPath(post.link)).map((post) => {
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

    if (!articles.some((article) => article.href.includes("/travel-marketing-canada"))) {
      const title = cleanText(travelArticle.title.rendered);
      const excerpt = cleanText(travelArticle.excerpt.rendered);
      const topics = resourceTopicIds(`${title} ${excerpt}`);
      articles.unshift({
        title,
        excerpt,
        href: "/travel-marketing-canada/",
        image: {
          src: "/images/articles/travel-marketing-canada-cruise.jpg",
          alt: travelArticle._embedded["wp:featuredmedia"][0]?.alt_text || title,
        },
        searchText: `${title} ${excerpt}`.toLowerCase(),
        topics,
        label: resourceTopicLabel(topics),
      });
    }

    return {
      title: cleanText(page.title.rendered) || "Feature Articles",
      heroTitle,
      heroBackground,
      articles,
    };
  },
);
