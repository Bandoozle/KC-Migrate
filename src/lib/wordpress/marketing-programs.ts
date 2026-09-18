import { cache } from "react";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import { getPageBySlug, getWordPressUrl, WordPressApiError } from "@/lib/wordpress";
import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import type { HeroBannerSlide } from "@/components/sections/HeroBanner";
import type { PageCtaData } from "@/components/sections/PageCta";
import {
  absUrl,
  cleanText,
  extractSmartSliderSlides,
  extractSmartSliderTexts,
  toLocalPath,
} from "@/lib/wordpress/shared";

export type MarketingProgramsContent = {
  title: string;
  hero: {
    title: string;
    eyebrow: string;
    subtitle: string;
    cta: { label: string; href: string } | null;
    slides: HeroBannerSlide[];
  };
  programs: FeatureSplitData[];
  cta: PageCtaData;
};

function extractBg(html: string, origin: string): string | null {
  const match = html.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/i);
  return absUrl(match?.[2] || null, origin);
}

function parseProgramRow(
  $: CheerioAPI,
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
    $(columns[0]).find(".wp-block-kadence-advancedheading, p, a.kb-button, a.kt-button").length > 0;
  if (!firstHasCopy) {
    textCol = columns[1];
    mediaCol = columns[0];
  }

  const headings = $(textCol)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .map((h) => cleanText($(h).text()))
    .filter(Boolean);

  const title = headings.find((h) => !/^starting from/i.test(h)) || headings[0] || "";
  const price = headings.find((h) => /^starting from/i.test(h)) || "";
  if (!title) return null;

  const body =
    cleanText($(textCol).find("p").first().text()) ||
    headings.find((h) => h !== title && h !== price && h.length > 40) ||
    "";

  const ctaLink = $(textCol).find("a.kb-button, a.kt-button, a.button").first();
  const ctaHref = toLocalPath(absUrl(ctaLink.attr("href"), origin), origin);
  const ctaLabel = cleanText(ctaLink.find(".kt-btn-inner-text").text() || ctaLink.text());

  const img = $(mediaCol).find("img").first();
  const imgSrc =
    absUrl(img.attr("src"), origin) ||
    extractBg($(mediaCol).html() || "", origin) ||
    extractBg($row.html() || "", origin);

  return {
    eyebrow: price || undefined,
    title,
    body: body || undefined,
    bullets: [],
    cta: ctaHref && ctaLabel ? { href: ctaHref, label: ctaLabel } : null,
    image: imgSrc ? { src: imgSrc, alt: img.attr("alt") || title } : null,
    mediaPosition: firstHasCopy ? "right" : "left",
    tone: index % 2 === 1 ? "muted" : "default",
  };
}

export const getMarketingProgramsContent = cache(
  async (): Promise<MarketingProgramsContent> => {
    const page = await getPageBySlug("marketing-programs");
    if (!page?.content?.rendered) {
      throw new WordPressApiError(
        "Marketing programs page content was not returned by WordPress REST.",
      );
    }

    const origin = getWordPressUrl();
    const html = page.content.rendered;
    const $ = cheerio.load(`<div id="root">${html}</div>`);

    const slides = extractSmartSliderSlides(html, origin);
    const sliderTexts = extractSmartSliderTexts(html);

    const pageTitle = cleanText(page.title.rendered) || "Marketing Programs";
    const heroTitle =
      sliderTexts.find((t) => /marketing programs/i.test(t)) || pageTitle;
    const eyebrow = sliderTexts.find((t) => /^strategic$/i.test(t)) || "";
    const subtitle =
      sliderTexts.find((t) => /digital|traditional|web/i.test(t) && t.includes("•")) ||
      "";
    const heroCtaLabel =
      sliderTexts.find((t) => /connect with us/i.test(t)) || "";

    const programRows = $("#root")
      .children(".kb-row-layout-wrap")
      .toArray()
      .filter((row) => {
        const cls = $(row).attr("class") || "";
        return !cls.includes("2019_ad8c4e-8d");
      }) as Element[];

    const programs = programRows
      .map((row, index) => parseProgramRow($, row, origin, index))
      .filter((item): item is FeatureSplitData => Boolean(item));

    const ctaRow = $(".kb-row-layout-id2019_ad8c4e-8d").first();
    const ctaCopy = ctaRow
      .find("h2, h3, .wp-block-kadence-advancedheading, p")
      .toArray()
      .map((el) => cleanText($(el).text()))
      .filter(Boolean);
    const ctaTitle = ctaCopy[0] || "";
    const ctaDescription = ctaCopy.find((t) => t !== ctaTitle && t.length > 20) || "";
    const primary = ctaRow.find("a.kb-button, a.kt-button, a.button").first();
    const phone = ctaRow.find('a[href^="tel:"]').first();

    return {
      title: pageTitle,
      hero: {
        title: heroTitle,
        eyebrow,
        subtitle,
        cta: heroCtaLabel ? { label: heroCtaLabel, href: "/contact/" } : null,
        slides,
      },
      programs,
      cta: {
        title: ctaTitle,
        description: ctaDescription,
        primary: {
          label: cleanText(primary.find(".kt-btn-inner-text").text() || primary.text()),
          href: toLocalPath(absUrl(primary.attr("href"), origin), origin) || "/contact/",
        },
        phone: phone.length
          ? {
              label: cleanText(phone.text()),
              href: phone.attr("href") || "tel:+16049255800",
            }
          : null,
      },
    };
  },
);
