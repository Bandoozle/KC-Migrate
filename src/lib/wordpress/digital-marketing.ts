import { cache } from "react";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { AnyNode, Element } from "domhandler";
import {
  decodeRenderedText,
  getWordPressUrl,
  WordPressApiError,
} from "@/lib/wordpress";
import type { WordPressPage } from "@/types/wordpress";

export type MediaImage = {
  src: string;
  alt: string;
};

export type OfferCard = {
  title: string;
  subtitle: string;
  image: MediaImage;
  href: string | null;
};

export type FeatureBlock = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  cta: { label: string; href: string } | null;
  image: MediaImage | null;
  mediaPosition: "left" | "right";
  tone: "default" | "muted";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RelatedService = {
  title: string;
  href: string | null;
  items: string[];
  image?: { src: string; alt: string } | null;
};

export type DigitalMarketingContent = {
  title: string;
  excerpt: string;
  hero: {
    slides: MediaImage[];
  };
  offers: {
    eyebrow: string;
    title: string;
    cards: OfferCard[];
  };
  features: FeatureBlock[];
  faqs: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  relatedServices: RelatedService[];
  cta: {
    title: string;
    description: string;
    primary: { label: string; href: string };
    phone: { label: string; href: string };
  };
};

function absUrl(url: string | undefined | null, origin: string): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("tel:")) {
    return url;
  }
  if (url.startsWith("/")) return `${origin}${url}`;
  return url;
}

function toLocalPath(url: string | null, origin: string): string | null {
  if (!url) return null;
  if (url === "#" || url.startsWith("#")) return null;
  if (url.startsWith("tel:")) return url;
  if (url.startsWith(origin)) {
    const path = url.slice(origin.length) || "/";
    return path.endsWith("/") || path.includes(".") ? path : `${path}/`;
  }
  if (url.startsWith("/")) return url;
  return url;
}

function cleanText(value: string): string {
  return decodeRenderedText(value).replace(/\s+/g, " ").trim();
}

function sentenceCaseLabel(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  }
  return trimmed;
}

async function fetchPageWithContent(slug: string): Promise<WordPressPage | null> {
  const origin = getWordPressUrl();
  const endpoint = `${origin}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=publish`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown network error";
    throw new WordPressApiError(
      `Unable to reach WordPress at ${origin}. ${reason}`,
      undefined,
      endpoint,
    );
  }

  if (!response.ok) {
    throw new WordPressApiError(
      `WordPress API returned ${response.status} for digital-marketing page.`,
      response.status,
      endpoint,
    );
  }

  const data = (await response.json()) as WordPressPage[];
  return data[0] ?? null;
}

function extractImage($: CheerioAPI, el: AnyNode | null): MediaImage | null {
  if (!el) return null;
  const img = $(el).is("img") ? $(el) : $(el).find("img").first();
  if (!img.length) return null;
  const src =
    absUrl(img.attr("src"), getWordPressUrl()) ||
    absUrl(img.attr("data-src"), getWordPressUrl());
  if (!src) return null;
  return { src, alt: img.attr("alt") || "" };
}

function extractListItems($: CheerioAPI, scope: AnyNode): string[] {
  return $(scope)
    .find("ul.wp-block-list > li, ul > li")
    .toArray()
    .map((li) => cleanText($(li).text()))
    .filter(Boolean);
}

function extractCta(
  $: CheerioAPI,
  scope: AnyNode,
  origin: string,
): { label: string; href: string } | null {
  const link = $(scope).find("a.kb-button, a.kt-button, a.button").first();
  if (!link.length) return null;
  const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
  const label = cleanText(link.find(".kt-btn-inner-text").text() || link.text());
  if (!href || !label) return null;
  return { label, href };
}

function parseOfferCards(
  $: CheerioAPI,
  row: Element,
  origin: string,
): OfferCard[] {
  const cards: OfferCard[] = [];
  const columns = $(row)
    .find(".kt-has-4-columns > .wp-block-kadence-column")
    .toArray();

  for (const col of columns) {
    const image = extractImage($, col);
    const headings = $(col)
      .find(".wp-block-kadence-advancedheading")
      .toArray()
      .map((h) => cleanText($(h).text()))
      .filter(Boolean);
    const title = headings[0] || "";
    const subtitle = headings[1] || "";
    const link = $(col).find("a.kb-advanced-image-link, a[href]").first();
    const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
    if (!title || !image) continue;
    cards.push({
      title: sentenceCaseLabel(title),
      subtitle,
      image,
      href,
    });
  }

  return cards;
}

function parseFeature(
  $: CheerioAPI,
  row: Element,
  origin: string,
): FeatureBlock | null {
  const mediaText = $(row).find(".wp-block-media-text").first();
  if (!mediaText.length) return null;

  const mediaOnRight = mediaText.hasClass("has-media-on-the-right");
  const tone = /background-color:\s*#f3f3f3/i.test(mediaText.attr("style") || "")
    ? "muted"
    : "default";

  const content = mediaText.find(".wp-block-media-text__content").first();
  const headings = content
    .find(".wp-block-kadence-advancedheading, h1, h2, h3")
    .toArray()
    .map((h) => cleanText($(h).text()))
    .filter(Boolean);

  const body =
    cleanText(content.find("p.wp-block-paragraph, p").first().text()) || "";
  const bullets = extractListItems($, content.get(0)!);
  const cta = extractCta($, content.get(0)!, origin);
  const image = extractImage($, mediaText.find(".wp-block-media-text__media").get(0) || null);

  return {
    eyebrow: sentenceCaseLabel(headings[0] || ""),
    title: sentenceCaseLabel(headings[1] || headings[0] || ""),
    body,
    bullets,
    cta,
    image,
    mediaPosition: mediaOnRight ? "right" : "left",
    tone,
  };
}

function parseFaqs($: CheerioAPI, row: Element) {
  const headings = $(row)
    .find("> .kt-row-column-wrap .wp-block-kadence-advancedheading, .kt-inside-inner-col > .wp-block-kadence-advancedheading")
    .toArray()
    .map((h) => cleanText($(h).text()))
    .filter(Boolean);

  const items = $(row)
    .find(".wp-block-kadence-pane, .kt-accordion-pane")
    .toArray()
    .map((pane) => {
      const question = cleanText(
        $(pane).find(".kt-blocks-accordion-title").first().text(),
      );
      const answer = cleanText(
        $(pane).find(".kt-accordion-panel-inner, .kt-accordion-panel").first().text(),
      );
      return question && answer ? { question, answer } : null;
    })
    .filter((item): item is FaqItem => Boolean(item));

  return {
    eyebrow: sentenceCaseLabel(headings[0] || "Have questions?"),
    title: sentenceCaseLabel(headings[1] || "Frequently asked questions"),
    items,
  };
}

function parseRelatedServices(
  $: CheerioAPI,
  row: Element,
  origin: string,
): RelatedService[] {
  return $(row)
    .find(".kt-has-4-columns > .wp-block-kadence-column")
    .toArray()
    .map((col) => {
      const titleEl = $(col).find("h4, .wp-block-kadence-advancedheading").first();
      const link = titleEl.find("a").first();
      const title = cleanText(link.length ? link.text() : titleEl.text());
      const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
      const items = extractListItems($, col);
      return title ? { title, href, items } : null;
    })
    .filter((item): item is RelatedService => Boolean(item));
}

function parseCta($: CheerioAPI, row: Element, origin: string) {
  const title = cleanText(
    $(row).find("h2.wp-block-kadence-advancedheading, h2").first().text(),
  );
  const description = cleanText(
    $(row).find("p.wp-block-kadence-advancedheading, p").first().text(),
  );
  const primary =
    extractCta($, row, origin) ||
    ({ label: "Get in Touch", href: "/contact/" } as const);
  const phoneLink = $(row).find('a[href^="tel:"]').first();
  const phoneHref = phoneLink.attr("href") || "tel:+16049255800";
  const phoneLabel = cleanText(phoneLink.text()) || "Call us";

  return {
    title: title || "Ready to elevate your digital marketing?",
    description:
      description ||
      "Let's discuss how strategic digital marketing can help grow your business.",
    primary,
    phone: { label: phoneLabel, href: phoneHref },
  };
}

function normalizeHtml(html: string, page: WordPressPage): DigitalMarketingContent {
  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="dm-root">${html}</div>`);
  const root = $("#dm-root");

  // Hero slides from Smart Slider background images in embedded CSS/markup
  const slideUrls = [
    ...new Set(
      [...html.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)]
        .map((m) => m[2])
        .filter((url) => /\/wp-content\/uploads\//.test(url)),
    ),
  ]
    .map((url) => absUrl(url, origin))
    .filter((url): url is string => Boolean(url))
    .slice(0, 6)
    .map((src) => ({ src, alt: page.title.rendered ? cleanText(page.title.rendered) : "Digital marketing" }));

  const rows = root.children(".kb-row-layout-wrap").toArray() as Element[];

  let offers = {
    eyebrow: "What we offer",
    title: "Digital marketing campaigns",
    cards: [] as OfferCard[],
  };
  const features: FeatureBlock[] = [];
  let faqs = {
    eyebrow: "Have questions?",
    title: "Frequently asked questions",
    items: [] as FaqItem[],
  };
  let relatedServices: RelatedService[] = [];
  let cta = {
    title: "Ready to elevate your digital marketing?",
    description:
      "Let's discuss how strategic digital marketing can help grow your business.",
    primary: { label: "Get in Touch", href: "/contact/" },
    phone: { label: "Call us", href: "tel:+16049255800" },
  };

  for (const row of rows) {
    const $row = $(row);
    const className = $row.attr("class") || "";

    if (className.includes("4609_aafd79-76")) {
      const eyebrow = cleanText(
        $row.find(".kt-adv-heading4609_56a2cf-4d, h3").first().text(),
      );
      const title = cleanText(
        $row.find(".kt-adv-heading4609_6b96b2-05, h1").first().text(),
      );
      offers = {
        eyebrow: sentenceCaseLabel(eyebrow || "What we offer"),
        title: sentenceCaseLabel(title || "Digital marketing campaigns"),
        cards: parseOfferCards($, row, origin),
      };
      continue;
    }

    if (
      className.includes("4609_dbe7e2-10") ||
      className.includes("4609_d18beb-c7") ||
      className.includes("4609_df196f-55")
    ) {
      const feature = parseFeature($, row, origin);
      if (feature) features.push(feature);
      continue;
    }

    if (className.includes("4609_ed3285-38")) {
      faqs = parseFaqs($, row);
      continue;
    }

    if (className.includes("4609_970b5f-53")) {
      relatedServices = parseRelatedServices($, row, origin);
      continue;
    }

    if (className.includes("4609_fbc0d8-f2")) {
      cta = parseCta($, row, origin);
    }
  }

  // Fallback hero if slider CSS URLs missing: use offer card images
  const heroSlides =
    slideUrls.length > 0
      ? slideUrls
      : offers.cards.map((card) => card.image).filter(Boolean);

  return {
    title: cleanText(page.title.rendered),
    excerpt: page.excerpt?.rendered ? cleanText(page.excerpt.rendered) : "",
    hero: { slides: heroSlides },
    offers,
    features,
    faqs,
    relatedServices,
    cta,
  };
}

export const getDigitalMarketingContent = cache(
  async (): Promise<DigitalMarketingContent> => {
    const page = await fetchPageWithContent("digital-marketing");
    if (!page?.content?.rendered) {
      throw new WordPressApiError(
        "Digital marketing page content was not returned by WordPress REST.",
      );
    }
    return normalizeHtml(page.content.rendered, page);
  },
);
