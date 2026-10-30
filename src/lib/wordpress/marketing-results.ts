import { cache } from "react";
import * as cheerio from "cheerio";
import { getPageBySlug, CONTENT_ORIGIN, WordPressApiError } from "@/lib/wordpress";
import type { PageCtaData } from "@/components/sections/PageCta";
import type { HeroBannerSlide } from "@/components/sections/HeroBanner";
import {
  absUrl,
  cleanText,
  extractSmartSliderSlides,
  extractSmartSliderTexts,
  toLocalPath,
} from "@/lib/wordpress/shared";

export type MarketingResultProject = {
  title: string;
  href: string | null;
  image: { src: string; alt: string };
};

export type MarketingResultsContent = {
  title: string;
  hero: {
    title: string;
    eyebrow: string;
    subtitle: string;
    cta: { label: string; href: string } | null;
    slides: HeroBannerSlide[];
  };
  intro: {
    title: string;
    body: string;
  } | null;
  projects: MarketingResultProject[];
  cta: PageCtaData;
};

export const getMarketingResultsContent = cache(
  async (): Promise<MarketingResultsContent> => {
    const page = await getPageBySlug("marketing-results");
    if (!page?.content?.rendered) {
      throw new WordPressApiError(
        "Marketing results page content was not returned by WordPress REST.",
      );
    }

    const origin = CONTENT_ORIGIN;
    const html = page.content.rendered;
    const $ = cheerio.load(`<div id="root">${html}</div>`);

    const slides = extractSmartSliderSlides(html, origin);
    const sliderTexts = extractSmartSliderTexts(html);

    const pageTitle = cleanText(page.title.rendered) || "Marketing Results";
    const heroTitle =
      sliderTexts.find((t) => /marketing results/i.test(t)) || pageTitle;
    const eyebrow = sliderTexts.find((t) => /our work/i.test(t)) || "";
    const subtitle =
      sliderTexts.find((t) => /canada|usa|mexico/i.test(t)) || "";
    const heroCtaLabel =
      sliderTexts.find((t) => /connect with us/i.test(t)) || "";

    const projects: MarketingResultProject[] = [];
    const seenTitles = new Set<string>();
    $(".wp-block-kadence-imageoverlay").each((_, el) => {
      const $el = $(el);
      const img = $el.find("img").first();
      const src = absUrl(img.attr("src") || img.attr("data-src"), origin);
      if (!src) return;

      const title = cleanText(
        $el.find(".image-overlay-title, h2, h3, h4").first().text(),
      );
      if (!title || seenTitles.has(title)) return;
      seenTitles.add(title);

      const href = toLocalPath(
        absUrl($el.find("a[href]").first().attr("href"), origin),
        origin,
      );

      projects.push({
        title,
        href,
        image: { src, alt: img.attr("alt") || title },
      });
    });

    const headingTexts = $("h2, .wp-block-kadence-advancedheading")
      .toArray()
      .map((el) => cleanText($(el).text()))
      .filter(Boolean);
    const introTitle =
      headingTexts.find((text) => /delivering|marketing results/i.test(text)) ||
      headingTexts[0] ||
      "";
    const introBody =
      $("p")
        .toArray()
        .map((el) => cleanText($(el).text()))
        .find((text) => text.length > 80) || "";

    const ctaRow = $(".kb-row-layout-id1698_514e77-49").first();
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
      intro:
        introTitle && introBody ? { title: introTitle, body: introBody } : null,
      projects,
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
