import { cache } from "react";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { getPageBySlug, getWordPressUrl, WordPressApiError } from "@/lib/wordpress";
import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";

export type ServicesContent = {
  title: string;
  hero: {
    title: string;
    backgroundImage: string | null;
  };
  intro: {
    title: string;
    body: string;
  };
  categories: FeatureSplitData[];
};

function extractBg($: cheerio.CheerioAPI, scopeHtml: string, origin: string): string | null {
  const match = scopeHtml.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/i);
  return absUrl(match?.[2] || null, origin);
}

function parseCategoryRow(
  $: cheerio.CheerioAPI,
  row: Element,
  origin: string,
  index: number,
): FeatureSplitData | null {
  const $row = $(row);
  const columns = $row.find("> .kt-row-column-wrap > .wp-block-kadence-column").toArray();
  if (columns.length < 2) return null;

  let textCol = columns[0];
  let mediaCol = columns[1];
  const firstHasCopy =
    $(columns[0]).find(".wp-block-kadence-advancedheading, ul, li, a.kb-button, a.kt-button").length >
    0;
  if (!firstHasCopy) {
    textCol = columns[1];
    mediaCol = columns[0];
  }

  const title = cleanText(
    $(textCol).find(".wp-block-kadence-advancedheading, h2, h3").first().text(),
  );
  if (!title) return null;

  const bullets = $(textCol)
    .find("ul li")
    .toArray()
    .map((li) => cleanText($(li).text()))
    .filter(Boolean);

  const ctaLink = $(textCol).find("a.kb-button, a.kt-button, a.button, a").first();
  const ctaHref = toLocalPath(absUrl(ctaLink.attr("href"), origin), origin);
  const ctaLabel = cleanText(ctaLink.find(".kt-btn-inner-text").text() || ctaLink.text());

  const img = $(mediaCol).find("img").first();
  const imgSrc =
    absUrl(img.attr("src"), origin) ||
    extractBg($, $(mediaCol).html() || "", origin) ||
    extractBg($, $row.html() || "", origin);

  return {
    title,
    bullets,
    cta: ctaHref && ctaLabel ? { href: ctaHref, label: ctaLabel } : null,
    image: imgSrc
      ? { src: imgSrc, alt: img.attr("alt") || title }
      : null,
    mediaPosition: firstHasCopy ? "right" : "left",
    tone: index % 2 === 1 ? "muted" : "default",
  };
}

export const getServicesContent = cache(async (): Promise<ServicesContent> => {
  const page = await getPageBySlug("services");
  if (!page?.content?.rendered) {
    throw new WordPressApiError("Services page content was not returned by WordPress REST.");
  }

  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="root">${page.content.rendered}</div>`);
  const rows = $("#root").children(".kb-row-layout-wrap").toArray() as Element[];

  const heroRow = rows[0];
  const introRow = rows[1];
  const categoryRows = rows.slice(2);

  const heroTitle = cleanText(
    $(heroRow).find(".wp-block-kadence-advancedheading, h1, h2").first().text(),
  );
  const heroBg = extractBg($, page.content.rendered.match(/4554_dcbbd1-c3\{[^}]+\}/)?.[0] || "", origin)
    || extractBg($, $(heroRow).html() || "", origin);

  const introTitle = cleanText(
    $(introRow).find(".wp-block-kadence-advancedheading, h2, h3").first().text(),
  );
  const introBody = cleanText($(introRow).find("p").first().text());

  const categories = categoryRows
    .map((row, index) => parseCategoryRow($, row, origin, index))
    .filter((item): item is FeatureSplitData => Boolean(item));

  return {
    title: cleanText(page.title.rendered) || "Our Services & Expertise",
    hero: {
      title: heroTitle || "Our Areas of Services Expertise",
      backgroundImage: heroBg,
    },
    intro: {
      title: introTitle || "Marketing Strategist & Creators",
      body: introBody,
    },
    categories,
  };
});
