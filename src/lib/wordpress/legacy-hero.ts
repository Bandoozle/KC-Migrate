import * as cheerio from "cheerio";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { isUnavailableMedia } from "@/lib/unavailable-media";
import {
  absUrl,
  cleanText,
  extractSmartSliderSlides,
  extractSmartSliderTexts,
} from "@/lib/wordpress/shared";
import type { InternalPageHeroProps } from "@/components/sections/InternalPageHero";

const HERO_SLOT = "<!--KOSICK_INTERNAL_HERO-->";

export { HERO_SLOT };

export type LegacyPageHero = {
  props: InternalPageHeroProps;
  html: string;
};

function splitTitle(title: string): { titlePrimary: string; titleSecondary?: string } {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { titlePrimary: title.trim() || "Kosick Communications" };
  const mid = words.length > 5 ? 2 : Math.ceil(words.length / 2);
  return {
    titlePrimary: words.slice(0, mid).join(" "),
    titleSecondary: words.slice(mid).join(" "),
  };
}

function rowBackground($: cheerio.CheerioAPI, rowHtml: string): string | null {
  const match = rowHtml.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/i);
  const src = absUrl(match?.[2] || null);
  if (!src || isUnavailableMedia(src)) return null;
  return src;
}

/**
 * Replace the first photographic hero on a legacy WordPress page with the
 * shared internal hero. Later page sections stay in the returned HTML.
 */
export function applyLegacyPageHero(html: string, pageTitle?: string): LegacyPageHero {
  const $ = cheerio.load(`<div id="kosick-legacy-root">${html}</div>`);
  const root = $("#kosick-legacy-root");
  const rows = root.children(".kb-row-layout-wrap").toArray().slice(0, 2);

  let slideHtml = "";
  let backgroundImage: string | null = null;

  for (const row of rows) {
    const $row = $(row);
    if ($row.find(".n2-ss-slider, .n2-section-smartslider").length) {
      slideHtml = $.html(row) || "";
      $row.remove();
      break;
    }
    const textLength = cleanText($row.text()).length;
    const image = rowBackground($, $.html(row) || "");
    if (image && textLength > 0 && textLength < 500) {
      backgroundImage = image;
      $row.remove();
      break;
    }
  }

  const slides = slideHtml ? extractSmartSliderSlides(slideHtml) : [];
  const texts = slideHtml ? extractSmartSliderTexts(slideHtml) : [];
  const h1 = root.find("h1").first();
  const h1Text = cleanText(h1.text());
  if (h1.length) {
    const className = h1.attr("class");
    h1.replaceWith(
      `<h2${className ? ` class="${className}"` : ""}>${h1.html() || ""}</h2>`,
    );
  }

  const title =
    cleanText(pageTitle || "") ||
    h1Text ||
    texts.find((text) => text.length > 12) ||
    "Kosick Communications";
  const headline = splitTitle(title);
  const description =
    texts.find((text) => text.length > 40 && !title.includes(text)) || undefined;
  const eyebrow =
    texts.find(
      (text) =>
        text.length <= 36 &&
        text !== title &&
        text !== description &&
        text !== headline.titlePrimary &&
        text !== headline.titleSecondary,
    ) || undefined;
  const hasPhoto = slides.length > 0 || Boolean(backgroundImage);
  const actions = hasPhoto ? serviceHeroActions() : { cta: null, secondaryCta: null };

  return {
    props: {
      eyebrow,
      titlePrimary: headline.titlePrimary,
      titleSecondary: headline.titleSecondary,
      description,
      backgroundImage,
      slides,
      plain: !hasPhoto,
      primaryCTA: actions.cta,
      secondaryCTA: actions.secondaryCta,
    },
    html: root.html() || html,
  };
}
