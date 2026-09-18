import { cache } from "react";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { getPageBySlug, getWordPressUrl, WordPressApiError } from "@/lib/wordpress";
import {
  absUrl,
  cleanText,
  extractSmartSliderSlides,
  textFrom,
  toLocalPath,
} from "@/lib/wordpress/shared";
import type {
  ResourceGuideContent,
  ResourceGuideCta,
  ResourceGuideSection,
} from "@/lib/wordpress/resource-guide-types";

function nodeText($: CheerioAPI, el: Element | null | undefined): string {
  return el ? textFrom($, el) : "";
}

function extractCta($: CheerioAPI, scope: Element, origin: string): ResourceGuideCta | null {
  const link = $(scope).find("a.kb-button, a.kt-button, a.button").first();
  if (!link.length) return null;
  const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
  const label =
    cleanText(link.find(".kt-btn-inner-text").text()) || nodeText($, link.get(0) as Element);
  if (!href || !label) return null;
  return { label, href };
}

function collectTopRows($: CheerioAPI): Element[] {
  return $("#guide-root")
    .find(".kb-row-layout-wrap")
    .toArray()
    .filter((row) => $(row).parents(".kb-row-layout-wrap").length === 0) as Element[];
}

function parseGuideSection(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ResourceGuideSection | null {
  const columns = $(row)
    .find("> .kt-row-column-wrap > .wp-block-kadence-column")
    .toArray();
  if (columns.length === 0) return null;

  let textCol = columns[0];
  let mediaCol = columns[1];
  if (columns.length >= 2) {
    const firstHasCopy =
      $(columns[0]).find(".wp-block-kadence-advancedheading, h2, h3, p").length > 0;
    if (!firstHasCopy) {
      textCol = columns[1];
      mediaCol = columns[0];
    }
  }

  const texts = $(textCol)
    .find(".wp-block-kadence-advancedheading, h2, h3, p")
    .toArray()
    .map((el) => nodeText($, el))
    .filter(Boolean);
  if (texts.length === 0) return null;

  const title = texts.find((t) => t.length < 80 && !/^typical size/i.test(t));
  if (!title) return null;

  const spec = texts.find((t) => /^typical size/i.test(t));
  const body =
    texts.find((t) => t !== title && t !== spec && t.length >= 40) ||
    texts.filter((t) => t !== title && t !== spec).join(" ");
  if (!body || body.length < 40) return null;

  const img = mediaCol ? $(mediaCol).find("img").first() : $(row).find("img").first();
  const src = absUrl(img.attr("src") || img.attr("data-src"), origin);

  return {
    title,
    spec,
    body,
    image: src ? { src, alt: img.attr("alt") || title } : null,
    cta: extractCta($, textCol, origin),
  };
}

export function normalizeResourceGuideHtml(
  html: string,
  pageTitle: string,
  excerpt = "",
): ResourceGuideContent {
  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="guide-root">${html}</div>`);
  const rows = collectTopRows($);
  const slides = extractSmartSliderSlides(html, origin);

  let heroTitle = cleanText(pageTitle);
  let heroSubtitle: string | undefined;
  let intro: ResourceGuideContent["intro"] = null;
  const sections: ResourceGuideSection[] = [];

  for (const row of rows) {
    const $row = $(row);
    const section = parseGuideSection($, row, origin);
    if (section && (/typical size/i.test(section.spec || "") || sections.length > 0 || intro)) {
      // Format/spec sections after intro, or any row that already has a size line.
      if (section.spec || sections.length > 0) {
        sections.push(section);
        continue;
      }
    }

    const headings = $row
      .find(".wp-block-kadence-advancedheading, h1, h2, h3")
      .toArray()
      .map((h) => nodeText($, h))
      .filter(Boolean);

    const longCopy = $row
      .find(".wp-block-kadence-advancedheading, p")
      .toArray()
      .map((el) => nodeText($, el))
      .filter((t) => t.length > 80);

    // Title row (short headings only).
    if (
      !intro &&
      sections.length === 0 &&
      headings.length >= 1 &&
      headings.length <= 2 &&
      longCopy.length === 0 &&
      $row.find("img").length === 0
    ) {
      heroTitle = headings[0] || heroTitle;
      heroSubtitle = headings[1];
      continue;
    }

    // Intro body row.
    if (!intro && longCopy.length > 0 && sections.length === 0) {
      intro = {
        body: longCopy.join("\n\n"),
        cta: extractCta($, row, origin),
      };
      continue;
    }

    if (section) {
      sections.push(section);
    }
  }

  return {
    title: cleanText(pageTitle),
    excerpt: cleanText(excerpt),
    hero: {
      title: heroTitle,
      subtitle: heroSubtitle,
      slides,
    },
    intro,
    sections,
  };
}

export const getBillboardDimensionsContent = cache(async (): Promise<ResourceGuideContent> => {
  const page = await getPageBySlug("billboard-dimensions");
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      "Billboard dimensions page content was not returned by WordPress REST.",
    );
  }

  return normalizeResourceGuideHtml(
    page.content.rendered,
    page.title.rendered,
    page.excerpt?.rendered || "",
  );
});
