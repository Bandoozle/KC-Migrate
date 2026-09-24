import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { cleanText } from "@/lib/wordpress/shared";

export type ArticleTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
  /** H3 that sits under an H2 in this article. */
  nested: boolean;
};

const MIN_TOC_HEADINGS = 3;

const SKIP_HEADING =
  /^(connect with us|get in touch|contact us|let['’]s talk|ready to get started)$/i;

export function articleTocMinimum(): number {
  return MIN_TOC_HEADINGS;
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "section";
}

function uniqueId(base: string, used: Set<string>): string {
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

/**
 * Add stable ids to H2/H3 headings and return the table-of-contents list.
 * Articles that only use H3s (common in WordPress) treat those H3s as top-level items.
 */
export function assignArticleHeadingIds(html: string): {
  html: string;
  toc: ArticleTocItem[];
} {
  if (!html.trim()) return { html, toc: [] };

  const $ = cheerio.load(`<div id="article-root">${html}</div>`, { xml: false });
  const root = $("#article-root");
  const used = new Set<string>();
  const toc: ArticleTocItem[] = [];
  let seenH2 = false;

  root.find("h2, h3").each((_, node) => {
    const el = node as Element;
    const level = el.tagName.toLowerCase() === "h2" ? 2 : 3;
    const text = cleanText($(el).text());
    if (!text || SKIP_HEADING.test(text)) return;

    if (level === 2) seenH2 = true;
    const id = uniqueId(slugify(text), used);
    $(el).attr("id", id);
    toc.push({
      id,
      text,
      level,
      nested: level === 3 && seenH2,
    });
  });

  return {
    html: root.html()?.trim() || html,
    toc,
  };
}
