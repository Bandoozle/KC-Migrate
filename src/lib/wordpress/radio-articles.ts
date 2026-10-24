import { cache } from "react";
import { decodeRenderedText, getPostBySlug } from "@/lib/wordpress";

export type RadioArticleItem = { label: string; text: string };

export type RadioArticleSection = {
  title: string;
  lead?: string;
  items: RadioArticleItem[];
};

export type RadioMixRole = { channel: string; role: string };

export type RadioArticles = {
  guide: {
    title: string;
    href: string;
    formats: RadioArticleSection | null;
    streaming: RadioArticleSection | null;
    process: RadioArticleSection | null;
  } | null;
  mediaBuying: {
    title: string;
    href: string;
    roles: RadioMixRole[];
    streamingPlatforms: string[];
  } | null;
};

const GUIDE_SLUG = "the-power-of-radio-advertising";
const MEDIA_BUYING_SLUG = "blog-media-buying-canada-tv-streaming-radio";

function text(html: string) {
  return decodeRenderedText(html).replace(/\s+/g, " ").trim();
}

/** Reads an article section: its h2, the paragraph under it, and "<strong>Label</strong>: text" list items. */
function readSection(html: string, heading: RegExp): RadioArticleSection | null {
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
  const index = headings.findIndex((match) => heading.test(text(match[1])));
  if (index < 0) return null;

  const start = (headings[index].index ?? 0) + headings[index][0].length;
  const end = headings[index + 1]?.index ?? html.length;
  const body = html.slice(start, end);
  const lead = body.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1];
  const items = [...body.matchAll(/<li[^>]*>\s*<strong>([\s\S]*?)<\/strong>\s*:?\s*([\s\S]*?)<\/li>/gi)]
    .map((match) => ({ label: text(match[1]).replace(/:$/, ""), text: text(match[2]).replace(/^:\s*/, "") }))
    .filter((item) => item.label && item.text);

  return { title: text(headings[index][1]), lead: lead ? text(lead) : undefined, items };
}

function postPath(link: string | undefined, slug: string) {
  try {
    return link ? new URL(link).pathname : `/${slug}/`;
  } catch {
    return `/${slug}/`;
  }
}

export const getRadioArticles = cache(async (): Promise<RadioArticles> => {
  const [guidePost, buyingPost] = await Promise.all([
    getPostBySlug(GUIDE_SLUG),
    getPostBySlug(MEDIA_BUYING_SLUG),
  ]);

  const guideHtml = guidePost?.content?.rendered ?? "";
  const guide = guidePost
    ? {
        title: text(guidePost.title.rendered),
        href: postPath(guidePost.link, GUIDE_SLUG),
        formats: readSection(guideHtml, /radio genres/i),
        streaming: readSection(guideHtml, /streaming radio/i),
        process: readSection(guideHtml, /books media/i),
      }
    : null;

  const buyingText = text(buyingPost?.content?.rendered ?? "");
  const ecosystem = buyingText.match(/as a full ecosystem\.\s*(.+?\.)\s*When it is built correctly/i)?.[1] ?? "";
  const roles = ecosystem
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.match(/^(.+?)\s+((?:creates|adds|build|builds|layers)\b.+)$/i))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({ channel: match[1], role: match[2].charAt(0).toUpperCase() + match[2].slice(1) }));
  const platforms = buyingText.match(/streaming audio across major platforms including (.+?), along with/i)?.[1];

  const mediaBuying = buyingPost
    ? {
        title: text(buyingPost.title.rendered),
        href: postPath(buyingPost.link, MEDIA_BUYING_SLUG),
        roles,
        streamingPlatforms: platforms ? platforms.split(/\s+and\s+|,\s*/).map((name) => name.trim()).filter(Boolean) : [],
      }
    : null;

  return { guide, mediaBuying };
});
