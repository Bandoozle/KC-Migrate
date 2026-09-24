import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { Element } from "domhandler";
import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import type { PageCtaData } from "@/components/sections/PageCta";
import { getWordPressUrl } from "@/lib/wordpress";
import {
  absUrl,
  cleanText,
  extractSmartSliderSlides,
  extractSmartSliderTexts,
  textFrom,
  toLocalPath,
} from "@/lib/wordpress/shared";
import type {
  ServiceFaqItem,
  ServiceGallerySection,
  ServiceInfoCard,
  ServiceLeadSection,
  ServiceLinkBanner,
  ServiceMediaCard,
  ServiceMediaCardSection,
  ServiceMediaTabsSection,
  ServiceOfferGroup,
  ServiceOverlayCard,
  ServicePackageSection,
  ServicePageContent,
  ServicePartnerLogos,
  ServiceProcessSection,
  ServiceProcessStep,
  ServicePromoBand,
  ServiceRelated,
  ServiceStatsSection,
  ServiceVideoSection,
} from "@/lib/wordpress/service-page-types";

function nodeText($: CheerioAPI, el: Element | null | undefined): string {
  return el ? textFrom($, el) : "";
}

function firstText($: CheerioAPI, scope: Element, selector: string): string {
  return nodeText($, $(scope).find(selector).get(0) as Element | undefined);
}

function extractCta(
  $: CheerioAPI,
  scope: Element,
  origin: string,
): { label: string; href: string } | null {
  const link = $(scope).find("a.kb-button, a.kt-button, a.button").first();
  if (!link.length) return null;
  const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
  const label =
    firstText($, link.get(0) as Element, ".kt-btn-inner-text") ||
    nodeText($, link.get(0) as Element);
  if (!href || !label) return null;
  return { label, href };
}

function extractBgUrl(html: string, origin: string): string | null {
  const match = html.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/i);
  return absUrl(match?.[2] || null, origin);
}

function splitCheckItems(text: string): string[] {
  if (!text.includes("✓")) return [];
  return text
    .split("✓")
    .map((part) => cleanText(part))
    .filter(Boolean);
}

function extractIconSvg($: CheerioAPI, box: Element): string | undefined {
  const svg = $(box).find(".kb-svg-icon-wrap svg, .kt-info-svg-icon svg, svg").first();
  if (!svg.length) return undefined;
  const markup = $.html(svg);
  // Keep small decorative icons only.
  if (!markup || markup.length > 2500) return undefined;
  return markup;
}

function extractInfoBoxId($: CheerioAPI, box: Element): string | undefined {
  const cls = $(box).attr("class") || "";
  const match = cls.match(/(?:^|\s)(kt-info-box[\w-]+)/);
  return match?.[1];
}

function parseInfoCards($: CheerioAPI, row: Element): ServiceInfoCard[] {
  const boxes = $(row).find(".wp-block-kadence-infobox").toArray();
  const cards: ServiceInfoCard[] = [];
  for (const box of boxes) {
    const title = firstText($, box, ".kt-blocks-info-box-title, h3, h4");
    const rawBody = firstText($, box, ".kt-blocks-info-box-text, p");
    if (!title) continue;
    const items = splitCheckItems(rawBody);
    cards.push({
      id: extractInfoBoxId($, box),
      title,
      body: items.length > 0 ? undefined : rawBody || undefined,
      items: items.length > 0 ? items : undefined,
      iconSvg: extractIconSvg($, box),
    });
  }
  return cards;
}

/** Image + title portfolio / case-study cards (often with outbound links). */
function parsePortfolioCards(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceMediaCard[] | null {
  const boxes = $(row).find(".wp-block-kadence-infobox").toArray();
  if (boxes.length < 3) return null;

  const cards: ServiceMediaCard[] = [];
  for (const box of boxes) {
    const title = firstText($, box, ".kt-blocks-info-box-title, h3, h4");
    const rawBody = firstText($, box, ".kt-blocks-info-box-text, p");
    if (!title) continue;
    if (splitCheckItems(rawBody).length > 0) return null;

    const img = $(box).find("img").first();
    const src = absUrl(img.attr("src") || img.attr("data-src"), origin);
    if (!src) return null;

    const link = $(box).find("a[href]").first();
    const href = link.length
      ? toLocalPath(absUrl(link.attr("href"), origin), origin)
      : null;

    cards.push({
      title,
      body: rawBody || undefined,
      image: { src, alt: img.attr("alt") || title },
      href,
    });
  }

  if (cards.length < 3) return null;
  if (!cards.every((card) => card.image)) return null;
  return cards;
}

function mergeMediaCardSection(
  current: ServiceMediaCardSection | null,
  next: ServiceMediaCardSection,
): ServiceMediaCardSection {
  if (!current) return next;
  const seen = new Set(current.cards.map((c) => c.title.toLowerCase()));
  return {
    title: current.title || next.title,
    cards: [
      ...current.cards,
      ...next.cards.filter((c) => !seen.has(c.title.toLowerCase())),
    ],
  };
}

/** Top-level service rows, including embeds between rows and group wrappers. */
function collectServiceRows($: CheerioAPI): Element[] {
  return $("#service-root")
    .find(".kb-row-layout-wrap, figure.wp-block-embed")
    .toArray()
    .filter((el) => {
      const $el = $(el);
      if ($el.parents(".kb-row-layout-wrap").length > 0) return false;
      if ($el.is("figure.wp-block-embed")) {
        return $el.find("iframe[src]").length > 0;
      }
      return true;
    }) as Element[];
}

function parseMediaTextFeature(
  $: CheerioAPI,
  row: Element,
  origin: string,
  index: number,
): FeatureSplitData | null {
  const mediaText = $(row).find(".wp-block-media-text").first();
  if (!mediaText.length) return null;

  const mediaOnRight = mediaText.hasClass("has-media-on-the-right");
  const tone =
    /background-color:\s*#f3f3f3/i.test(mediaText.attr("style") || "") ||
    index % 2 === 1
      ? "muted"
      : "default";

  const content = mediaText.find(".wp-block-media-text__content").first();
  const headings = content
    .find(".wp-block-kadence-advancedheading, h1, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);

  const paragraphs = content
    .find("p.wp-block-paragraph, p")
    .toArray()
    .map((p) => nodeText($, p))
    .filter(Boolean);

  const bullets = content
    .find("ul li")
    .toArray()
    .map((li) => nodeText($, li))
    .filter(Boolean);

  const img = mediaText.find(".wp-block-media-text__media img").first();
  const imgSrc = absUrl(img.attr("src") || img.attr("data-src"), origin);
  const { eyebrow, title } = splitFeatureHeadings(headings);

  return {
    eyebrow,
    title,
    body: paragraphs.join(" ") || undefined,
    bullets,
    cta: extractCta($, content.get(0) as Element, origin),
    image: imgSrc
      ? { src: imgSrc, alt: img.attr("alt") || title || eyebrow || "" }
      : null,
    mediaPosition: mediaOnRight ? "right" : "left",
    tone,
  };
}

/** Two-column Kadence rows that put the image in a column background. */
/**
 * Prefer the row's own 2-col grid; if the top-level row is a 1-col wrapper
 * (common on Dental Marketing), use the nested text+image layout instead.
 */
function columnHasFeatureMedia($: CheerioAPI, col: Element): boolean {
  if ($(col).find("img").length > 0) return true;
  return /background-image:\s*url\(/i.test(
    `${$(col).attr("style") || ""}${$(col).html() || ""}`,
  );
}

function resolveTwoColumnFeatureRow(
  $: CheerioAPI,
  row: Element,
): Element | null {
  const directCols = $(row)
    .find("> .kt-row-column-wrap > .wp-block-kadence-column")
    .toArray();
  // Direct 2-col rows keep using parseBackgroundFeature (img or CSS bg).
  if (directCols.length >= 2) return row;

  const nested = $(row)
    .find(".kb-row-layout-wrap")
    .toArray()
    .find((nestedRow) => {
      const cols = $(nestedRow)
        .find("> .kt-row-column-wrap > .wp-block-kadence-column")
        .toArray();
      if (cols.length < 2) return false;
      const hasMedia = cols.some((col) => columnHasFeatureMedia($, col));
      const hasCopy = cols.some(
        (col) =>
          $(col).find(".wp-block-kadence-advancedheading, h1, h2, h3, p, ul").length >
          0,
      );
      return hasMedia && hasCopy;
    });

  return (nested as Element | undefined) || null;
}

function parseBackgroundFeature(
  $: CheerioAPI,
  row: Element,
  origin: string,
  index: number,
): FeatureSplitData | null {
  const featureRow = resolveTwoColumnFeatureRow($, row);
  if (!featureRow) return null;

  const columns = $(featureRow)
    .find("> .kt-row-column-wrap > .wp-block-kadence-column")
    .toArray();
  if (columns.length < 2) return null;

  let textCol = columns[0];
  let mediaCol = columns[1];
  const firstHasCopy =
    $(columns[0]).find(".wp-block-kadence-advancedheading, p, ul, a.kb-button").length > 0;
  if (!firstHasCopy) {
    textCol = columns[1];
    mediaCol = columns[0];
  }

  const headings = $(textCol)
    .find(".wp-block-kadence-advancedheading, h1, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);
  if (headings.length === 0) return null;

  const body = firstText($, textCol, "p");
  const bullets = $(textCol)
    .find("ul li")
    .toArray()
    .map((li) => nodeText($, li))
    .filter(Boolean);
  const cta = extractCta($, textCol, origin);
  const rowHtml = $rowHtml($, featureRow);
  const imgSrc =
    extractColumnBg($, mediaCol, rowHtml, origin) ||
    extractColumnImage($, mediaCol, origin) ||
    extractBgUrl(rowHtml, origin);
  if (!imgSrc && !body && bullets.length === 0) return null;

  const { eyebrow, title } = splitFeatureHeadings(headings);
  const imgAlt =
    $(mediaCol).find("img").first().attr("alt")?.trim() || title || eyebrow || "";

  return {
    eyebrow,
    title,
    body: body || undefined,
    bullets,
    cta,
    image: imgSrc ? { src: imgSrc, alt: imgAlt } : null,
    mediaPosition: firstHasCopy ? "right" : "left",
    tone: index % 2 === 1 ? "muted" : "default",
  };
}

function $rowHtml($: CheerioAPI, row: Element): string {
  return $(row).html() || "";
}

function isFaqAccordion($: CheerioAPI, row: Element): boolean {
  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .filter(
      (el) => $(el).closest(".wp-block-kadence-pane, .kt-accordion-pane").length === 0,
    )
    .map((h) => nodeText($, h))
    .join(" ");
  return /have questions|frequently asked/i.test(headings);
}

function parseFaqs($: CheerioAPI, row: Element) {
  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .filter(
      (el) => $(el).closest(".wp-block-kadence-pane, .kt-accordion-pane").length === 0,
    )
    .map((h) => nodeText($, h))
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
    .filter((item): item is ServiceFaqItem => Boolean(item));

  if (items.length === 0) return null;

  return {
    eyebrow: headings[0] || "",
    title: headings[1] || headings[0] || "",
    items,
  };
}

function parseMediaCards(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceMediaCard[] {
  const cards: ServiceMediaCard[] = [];
  for (const pane of $(row).find(".wp-block-kadence-pane, .kt-accordion-pane").toArray()) {
    const title = cleanText(
      $(pane).find(".kt-blocks-accordion-title, h3, h4").first().text(),
    );
    const body = cleanText(
      $(pane).find(".kt-accordion-panel-inner p, .kt-accordion-panel p, p").first().text(),
    );
    const img = $(pane).find("img").first();
    const src = absUrl(img.attr("src") || img.attr("data-src"), origin);
    if (!title) continue;
    cards.push({
      title,
      body: body || undefined,
      image: src ? { src, alt: img.attr("alt") || title } : null,
    });
  }
  return cards;
}

function parseRelated($: CheerioAPI, row: Element, origin: string): ServiceRelated[] {
  const rowHtml = $(row).html() || "";
  return $(row)
    .find(".kt-has-4-columns > .wp-block-kadence-column")
    .toArray()
    .map((col): ServiceRelated | null => {
      const titleEl = $(col).find("h4, h3, .wp-block-kadence-advancedheading").first();
      const title = nodeText($, titleEl.get(0) as Element | undefined);
      if (!title) return null;

      const link = titleEl.find("a[href]").first().length
        ? titleEl.find("a[href]").first()
        : $(col).find("a[href]").first();
      const href = toLocalPath(absUrl(link.attr("href"), origin), origin);
      const items = $(col)
        .find("ul li")
        .toArray()
        .map((li) => nodeText($, li))
        .filter(Boolean);
      const bg = extractColumnBg($, col, rowHtml, origin);
      return {
        title,
        href,
        items,
        image: bg ? { src: bg, alt: title } : null,
      };
    })
    .filter((item): item is ServiceRelated => item !== null);
}

function parseCta($: CheerioAPI, row: Element, origin: string): PageCtaData | null {
  const copy = $(row)
    .find("h2, h3, .wp-block-kadence-advancedheading, p")
    .toArray()
    .map((el) => nodeText($, el))
    .filter((t) => t && !/^call us$/i.test(t));

  const title = copy[0] || "";
  const description = copy.find((t) => t !== title && t.length > 20) || "";
  const primary = extractCta($, row, origin);
  const phone = $(row).find('a[href^="tel:"]').first();

  if (!title && !primary) return null;

  return {
    title,
    description: description || undefined,
    primary: primary || { label: "", href: "/contact/" },
    phone: phone.length
      ? {
          label: cleanText(phone.text()) || "Call us",
          href: phone.attr("href") || "tel:+16049255800",
        }
      : null,
  };
}

function collectImages(
  $: CheerioAPI,
  row: Element,
  origin: string,
): { src: string; alt: string }[] {
  const seen = new Set<string>();
  return $(row)
    .find("img")
    .toArray()
    .map((img) => {
      const src = absUrl($(img).attr("src") || $(img).attr("data-src"), origin);
      if (!src || seen.has(src)) return null;
      seen.add(src);
      return { src, alt: $(img).attr("alt") || "" };
    })
    .filter((img): img is { src: string; alt: string } => Boolean(img));
}

function parseGallery(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceGallerySection | null {
  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);
  const body =
    headings.find((h, i) => i > 0 && h.length > 40) ||
    firstText($, row, "p") ||
    undefined;
  const labels = $(row)
    .find("ul li")
    .toArray()
    .map((li) => nodeText($, li))
    .filter(Boolean);
  const images = collectImages($, row, origin);

  if (images.length < 2 || images.length > 8 || !headings[0]) return null;
  if (/partner/i.test(headings[0])) return null;

  return {
    title: headings[0],
    body,
    labels: labels.length > 0 ? labels : undefined,
    images,
  };
}

function parsePartnerLogos(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServicePartnerLogos | null {
  const title = cleanText(
    $(row).find(".wp-block-kadence-advancedheading, h2, h3").first().text(),
  );
  const logos = collectImages($, row, origin);
  const isGallery = $(row).find(
    ".wp-block-kadence-advancedgallery, .kb-gallery-ul, .kb-gallery",
  ).length > 0;
  if (logos.length < 6) return null;
  if (!title && logos.length < 10 && !isGallery) return null;
  return {
    title: title || "",
    logos,
  };
}

function parseSplitHero(
  $: CheerioAPI,
  row: Element,
  origin: string,
): {
  intro: NonNullable<ServicePageContent["intro"]>;
  slide: { src: string; alt: string; kind: "image" };
} | null {
  const columns = $(row)
    .find("> .kt-row-column-wrap > .wp-block-kadence-column")
    .toArray();
  if (columns.length < 2) return null;
  if ($(row).find(".wp-block-kadence-infobox, .wp-block-media-text").length) {
    return null;
  }

  let textCol = columns[0];
  let mediaCol = columns[1];
  const firstHasImage = $(columns[0]).find("img").length > 0;
  const secondHasCopy =
    $(columns[1]).find(".wp-block-kadence-advancedheading, h1, h2, h3").length > 0;
  if (firstHasImage && secondHasCopy) {
    textCol = columns[1];
    mediaCol = columns[0];
  }

  const img = $(mediaCol).find("img").first();
  const src = absUrl(img.attr("src") || img.attr("data-src"), origin);
  if (!src) return null;

  const headings = $(textCol)
    .find(".wp-block-kadence-advancedheading, h1, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);
  if (headings.length < 2) return null;

  const shortHeadings = headings.filter((h) => h.length < 80);
  const longHeadings = headings.filter((h) => h.length >= 80);
  const paragraphs = $(textCol)
    .find("p")
    .toArray()
    .map((p) => nodeText($, p))
    .filter(Boolean);

  const eyebrow = shortHeadings[0] || "";
  const title = shortHeadings[1] || shortHeadings[0] || "";
  const bodyParts = [
    ...shortHeadings.slice(2),
    ...longHeadings,
    ...paragraphs,
  ].filter((t) => t && t !== eyebrow && t !== title);

  const actions = $(textCol)
    .find("a.kb-button, a.kt-button, a.button")
    .toArray()
    .map((a) => {
      const href = toLocalPath(absUrl($(a).attr("href"), origin), origin);
      const label =
        firstText($, a, ".kt-btn-inner-text") || nodeText($, a);
      if (!href || !label) return null;
      return { label, href };
    })
    .filter((item): item is { label: string; href: string } => Boolean(item));

  // Deduplicate identical actions.
  const seen = new Set<string>();
  const uniqueActions = actions.filter((action) => {
    const key = `${action.label}::${action.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    intro: {
      eyebrow,
      title,
      body: bodyParts.join(" ") || undefined,
      actions: uniqueActions.length > 0 ? uniqueActions : undefined,
    },
    slide: {
      src,
      alt: img.attr("alt") || title || eyebrow,
      kind: "image",
    },
  };
}

function extractRowBackground(
  $: CheerioAPI,
  row: Element,
  origin: string,
): string | null {
  const cls = $(row).attr("class") || "";
  const idMatch = cls.match(/kb-row-layout-id([^\s]+)/);
  const scopeHtml =
    ($("style").toArray().map((s) => $(s).html() || "").join("\n") || "") +
    ($(row).html() || "");

  if (idMatch) {
    const escaped = idMatch[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `\\.kb-row-layout-id${escaped}[^{]*\\{[^}]*background-image:\\s*url\\((['"]?)([^)'"]+)\\1\\)`,
      "i",
    );
    const match = scopeHtml.match(re);
    if (match?.[2]) return absUrl(match[2], origin);
  }

  return extractBgUrl(scopeHtml, origin);
}

function parsePromoBand(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServicePromoBand | null {
  if (
    $(row).find(
      ".wp-block-media-text, .wp-block-kadence-infobox, .kt-accordion-pane, .kb-count-up, iframe, .wp-block-kadence-countup",
    ).length
  ) {
    return null;
  }
  if (parseProcessSteps($, row)) return null;
  if (isFaqAccordion($, row)) return null;
  if (isCtaRow($, row)) return null;
  if (isRelatedRow($, row)) return null;

  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3, h6")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);
  const shortHeadings = headings.filter((h) => h.length < 80);
  const body =
    headings.find((h) => h.length >= 80) ||
    $(row)
      .find("p")
      .toArray()
      .map((p) => nodeText($, p))
      .find((t) => t.length >= 80) ||
    "";
  const cta = extractCta($, row, origin);
  if (shortHeadings.length === 0 || body.length < 80 || !cta) return null;

  return {
    eyebrow: shortHeadings.length > 1 ? shortHeadings[0] : undefined,
    title:
      shortHeadings.length > 1 ? shortHeadings[1] : shortHeadings[0] || "",
    body,
    cta,
    backgroundImage: extractRowBackground($, row, origin),
  };
}

function inferHeroCopy(
  html: string,
  pageTitle: string,
): Pick<ServicePageContent["hero"], "eyebrow" | "displayTitle" | "subtitle" | "cta"> {
  const texts = extractSmartSliderTexts(html);
  if (texts.length === 0) return {};

  const eyebrow =
    texts.find((t) => /^custom$/i.test(t)) ||
    texts.find((t) => t.length <= 24 && !/corporate events|let('|’)s|planning|•/i.test(t));
  const displayTitle =
    texts.find((t) => /corporate events/i.test(t) && t.length < 40) || undefined;
  const subtitle =
    texts.find((t) => t.includes("•")) ||
    texts.find((t) => /conference|incentive|reward|travel/i.test(t) && t.length > 20);
  const ctaLabel =
    texts.find((t) => /start planning|plan your|get started|let('|’)s/i.test(t)) ||
    undefined;

  return {
    eyebrow: eyebrow && eyebrow !== displayTitle ? eyebrow : undefined,
    displayTitle: displayTitle || cleanText(pageTitle) || undefined,
    subtitle,
    cta: ctaLabel ? { label: ctaLabel, href: "/contact/" } : null,
  };
}

function parseChannelFeatureLeaves(
  $: CheerioAPI,
  row: Element,
  origin: string,
  startIndex: number,
): FeatureSplitData[] {
  if (
    $(row).find(
      ".wp-block-media-text, .wp-block-kadence-infobox, .kt-accordion-pane, .kb-count-up, iframe",
    ).length
  ) {
    return [];
  }

  // Two-column text + image rows belong to parseBackgroundFeature
  // (including 1-col wrappers that nest a real 2-col split).
  const featureRow = resolveTwoColumnFeatureRow($, row);
  if (featureRow) {
    const cols = $(featureRow)
      .find("> .kt-row-column-wrap > .wp-block-kadence-column")
      .toArray();
    const hasMedia = cols.some((col) => columnHasFeatureMedia($, col));
    const hasCopy = cols.some(
      (col) =>
        $(col).find(".wp-block-kadence-advancedheading, h1, h2, h3, p").length > 0,
    );
    if (hasMedia && hasCopy) return [];
  }

  const leaves = $(row)
    .find(".wp-block-kadence-column")
    .toArray()
    .filter((col) => $(col).find(".wp-block-kadence-column").length === 0);

  const features: FeatureSplitData[] = [];
  for (const leaf of leaves) {
    const headings = $(leaf)
      .find(".wp-block-kadence-advancedheading, h1, h2, h3")
      .toArray()
      .map((h) => nodeText($, h))
      .filter(Boolean);
    const shortHeadings = headings.filter((h) => h.length < 90 && !isNumberHeading(h));
    const { eyebrow, title } = splitFeatureHeadings(shortHeadings);
    const body =
      headings.find((h) => h.length >= 90) ||
      $(leaf)
        .find("p")
        .toArray()
        .map((p) => nodeText($, p))
        .find((t) => t.length >= 60) ||
      "";
    if (!title || body.length < 60) continue;

    const cta = extractCta($, leaf, origin);
    const index = startIndex + features.length;
    features.push({
      eyebrow,
      title,
      body,
      bullets: [],
      cta,
      image: null,
      mediaPosition: "right",
      tone: index % 2 === 1 ? "muted" : "default",
    });
  }

  return features.length >= 1 ? features : [];
}

function extractColumnBg(
  $: CheerioAPI,
  col: Element,
  rowHtml: string,
  origin: string,
): string | null {
  const cls = $(col).attr("class") || "";
  const idMatch = cls.match(/kadence-column([^\s]+)/);
  if (idMatch) {
    const escaped = idMatch[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `kadence-column${escaped}[^{]*\\{[^}]*background-image:\\s*url\\((['"]?)([^)'"]+)\\1\\)`,
      "i",
    );
    const match = rowHtml.match(re);
    if (match?.[2]) return absUrl(match[2], origin);
  }

  return (
    extractBgUrl($(col).html() || "", origin) ||
    extractColumnImage($, col, origin)
  );
}

/** Prefer explicit <img> / lazy-src / srcset from a media column. */
function extractColumnImage(
  $: CheerioAPI,
  col: Element,
  origin: string,
): string | null {
  const img = $(col).find("img").first();
  if (!img.length) return null;
  const srcsetFirst = (img.attr("srcset") || "")
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .find(Boolean);
  const src =
    img.attr("src") ||
    img.attr("data-src") ||
    img.attr("data-lazy-src") ||
    img.attr("data-full-url") ||
    srcsetFirst ||
    null;
  return absUrl(src, origin);
}

function parseOverlayCards(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceOverlayCard[] {
  const rowHtml = $(row).html() || "";
  const columns = $(row).find(".wp-block-kadence-column").toArray();
  const cards: ServiceOverlayCard[] = [];
  const seen = new Set<string>();

  for (const col of columns) {
    // Prefer leaf columns (skip wrappers that only nest other columns).
    if ($(col).find(".wp-block-kadence-column").length > 0) continue;

    const title = cleanText(
      $(col).find(".wp-block-kadence-advancedheading, h2, h3, h4").first().text(),
    );
    const src = extractColumnBg($, col, rowHtml, origin);
    if (!title || !src || seen.has(title)) continue;
    if ($(col).find("p").text().trim().length > 80) continue;
    seen.add(title);
    const href = toLocalPath(
      absUrl($(col).find("a[href]").first().attr("href"), origin),
      origin,
    );
    cards.push({
      title,
      href,
      image: { src, alt: title },
    });
  }

  return cards.length >= 3 ? cards : [];
}

function parseLead($: CheerioAPI, row: Element): ServiceLeadSection | null {
  if ($(row).find(".wp-block-media-text, .wp-block-kadence-infobox, .kt-accordion-pane").length) {
    return null;
  }
  if ($(row).find("a.kb-button, a.kt-button").length > 0) return null;

  const texts = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3, p")
    .toArray()
    .map((el) => nodeText($, el))
    .filter(Boolean);
  if (texts.length === 0) return null;

  const shortTitles = texts.filter((t) => t.length < 80 && !isNumberHeading(t));
  const paragraphs = texts.filter((t) => t.length >= 80);
  if (paragraphs.length === 0) return null;

  const title = shortTitles[0];
  return {
    title: title || undefined,
    paragraphs,
  };
}

function parseLinkBanner(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceLinkBanner | null {
  const cta = extractCta($, row, origin);
  if (!cta) return null;
  // Skip feature-like rows with body copy or lists.
  if ($(row).find("ul li").length > 0) return null;
  const longPara = $(row)
    .find("p")
    .toArray()
    .some((p) => nodeText($, p).length > 80);
  if (longPara) return null;

  const title = firstText($, row, ".wp-block-kadence-advancedheading, h2, h3");
  if (!title || title === cta.label) return null;
  if ($(row).find('a[href^="tel:"]').length > 0) return null;
  if (/ready to/i.test(title)) return null;
  if (/^starting from/i.test(title)) return null;
  return { title, cta };
}

function isCtaRow($: CheerioAPI, row: Element): boolean {
  const cls = $(row).attr("class") || "";
  const hasPrimary = $(row).find("a.kb-button, a.kt-button").length > 0;
  const hasPhone = $(row).find('a[href^="tel:"]').length > 0;
  return (
    hasPrimary &&
    hasPhone &&
    (cls.includes("palette3") || /ready to/i.test($(row).text()))
  );
}

function isRelatedRow($: CheerioAPI, row: Element): boolean {
  const cols = $(row).find(".kt-has-4-columns > .wp-block-kadence-column");
  if (cols.length < 4) return false;
  if ($(row).find(".wp-block-kadence-infobox, .wp-block-media-text").length > 0) {
    return false;
  }
  // Partner/logo grids have many images.
  if ($(row).find("img").length >= 6) return false;
  const titles = cols
    .toArray()
    .map((col) => firstText($, col, "h4, h3, .wp-block-kadence-advancedheading"))
    .filter(Boolean);
  if (titles.length < 3) return false;

  // List-based related services (may also have column background images).
  const listCols = cols
    .toArray()
    .filter((col) => $(col).find("ul li").length >= 2);
  if (listCols.length >= 3) return true;

  // Background-image columns without lists are overlay cards, not related lists.
  if (/background-image:\s*url\(/i.test($(row).html() || "")) return false;
  return true;
}

function parseStatsSection($: CheerioAPI, row: Element): ServiceStatsSection | null {
  const counters = $(row).find(".wp-block-kadence-countup, .kb-count-up").toArray();
  if (counters.length < 2) return null;

  const items = counters
    .map((el) => {
      const end = Number($(el).attr("data-end") || "");
      if (!Number.isFinite(end)) return null;
      const label = cleanText($(el).find(".kb-count-up-title").text());
      if (!label) return null;
      const durationRaw = Number($(el).attr("data-duration") || "2.5");
      return {
        end,
        prefix: $(el).attr("data-prefix") || undefined,
        suffix: $(el).attr("data-suffix") || undefined,
        label,
        duration: Number.isFinite(durationRaw) ? durationRaw : 2.5,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (items.length < 2) return null;

  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .filter((el) => $(el).closest(".wp-block-kadence-countup, .kb-count-up").length === 0)
    .map((h) => nodeText($, h))
    .filter(Boolean);

  return {
    eyebrow: headings[0] || undefined,
    title: headings[1] || undefined,
    items,
  };
}

function parseVideoEmbed($: CheerioAPI, row: Element): string | null {
  if ($(row).find(".wp-block-kadence-infobox, .wp-block-media-text, .kb-count-up").length) {
    return null;
  }
  const iframe = $(row).find("iframe[src]").first();
  if (!iframe.length) return null;
  const src = iframe.attr("src") || "";
  if (!/vimeo\.com|youtube\.com|youtu\.be/i.test(src)) return null;
  // Prefer standalone video rows (little surrounding copy).
  const copyLen = cleanText(
    $(row)
      .find("p, .wp-block-kadence-advancedheading, h1, h2, h3")
      .toArray()
      .map((el) => nodeText($, el))
      .join(" "),
  ).length;
  if (copyLen > 120) return null;
  return src;
}

function parseMediaTabsSection(
  $: CheerioAPI,
  row: Element,
  origin: string,
): ServiceMediaTabsSection | null {
  const tabsRoot = $(row).find(".wp-block-tabs, [data-wp-interactive='core/tabs']").first();
  if (!tabsRoot.length) return null;

  const labels = tabsRoot
    .find('[role="tab"]')
    .toArray()
    .map((el) => cleanText($(el).text()))
    .filter(Boolean);

  const panels = tabsRoot.find('[role="tabpanel"]').toArray();
  const tabs = panels
    .map((panel, index) => {
      const img = $(panel).find("img").first();
      const src = absUrl(img.attr("src") || img.attr("data-src"), origin);
      if (!src) return null;
      const label =
        labels[index] ||
        img.attr("alt") ||
        cleanText($(panel).find("h3, h4, figcaption").first().text()) ||
        `Slide ${index + 1}`;
      return {
        label,
        image: { src, alt: img.attr("alt") || label },
      };
    })
    .filter((tab): tab is NonNullable<typeof tab> => Boolean(tab));

  if (tabs.length < 2) return null;

  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .filter((el) => $(el).closest(".wp-block-tabs, [role='tabpanel']").length === 0)
    .map((h) => nodeText($, h))
    .filter(Boolean);

  return {
    eyebrow: headings[0] || undefined,
    title: headings[1] || headings[0] || undefined,
    tabs,
  };
}

function isIntroRow($: CheerioAPI, row: Element): boolean {
  if ($(row).find(".wp-block-media-text, .wp-block-kadence-infobox, .kt-accordion-pane").length) {
    return false;
  }
  if (extractBgUrl($(row).html() || "", getWordPressUrl())) return false;
  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h1, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean);
  return headings.length >= 1 && headings.length <= 2 && $(row).find("img").length === 0;
}

function introFromHeadings(
  headings: string[],
  body?: string,
): ServicePageContent["intro"] {
  const filtered = headings.filter(Boolean);
  if (filtered.length === 0) return null;
  return {
    eyebrow: filtered[0] || "",
    title: filtered[1] || filtered[0] || "",
    body: body || undefined,
  };
}

function isNumberHeading(value: string): boolean {
  return /^\d+\.?$/.test(value.trim());
}

/** True when a heading is effectively ALL CAPS (WP punchy feature titles). */
function isMostlyUpperHeading(value: string): boolean {
  const letters = value.replace(/[^A-Za-z]/g, "");
  return letters.length >= 4 && letters === letters.toUpperCase();
}

/**
 * Split feature headings into Amplitude-style eyebrow + title.
 * ALL-CAPS punch lines stay the title; the other heading becomes the label.
 * Otherwise: first = eyebrow, second = title.
 */
function splitFeatureHeadings(headings: string[]): {
  eyebrow?: string;
  title: string;
} {
  const cleaned = headings.map((h) => cleanText(h)).filter(Boolean);
  if (cleaned.length === 0) return { title: "" };
  if (cleaned.length === 1) return { title: cleaned[0] };

  const upperIdx = cleaned.findIndex(
    (h) => isMostlyUpperHeading(h) && h.length < 90,
  );
  if (upperIdx >= 0) {
    const title = cleaned[upperIdx];
    const eyebrow = cleaned.find((_, i) => i !== upperIdx);
    return eyebrow ? { eyebrow, title } : { title };
  }

  return { eyebrow: cleaned[0], title: cleaned[1] };
}

function parseNumberedStepTitle(value: string): {
  number: string;
  title: string;
} | null {
  const match = cleanText(value).match(/^(\d+\.?)\s+(.+)$/);
  if (!match) return null;
  return { number: match[1], title: match[2] };
}

function parseProcessSteps(
  $: CheerioAPI,
  row: Element,
): ServiceProcessSection | null {
  const leafCols = $(row)
    .find(".wp-block-kadence-column")
    .toArray()
    .filter((col) => $(col).find(".wp-block-kadence-column").length === 0);

  const steps: ServiceProcessStep[] = [];
  for (const col of leafCols) {
    const headings = $(col)
      .find(".wp-block-kadence-advancedheading, h2, h3, h4")
      .toArray()
      .map((h) => nodeText($, h))
      .filter(Boolean);
    if (headings.length < 2 || !isNumberHeading(headings[0])) continue;
    const body = firstText($, col, "p");
    steps.push({
      number: headings[0].replace(/\.$/, ""),
      title: headings[1],
      body: body || undefined,
    });
  }

  if (steps.length < 3) return null;

  const stepTitles = new Set(steps.flatMap((s) => [s.number, s.title, `${s.number}.`]));
  const sectionHeadings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean)
    .filter((h) => !stepTitles.has(h) && !isNumberHeading(h) && !parseNumberedStepTitle(h));

  return {
    eyebrow: sectionHeadings[0] || undefined,
    title: sectionHeadings[1] || undefined,
    steps,
  };
}

function processStepsFromMediaCards(
  cards: ServiceMediaCard[],
): ServiceProcessStep[] | null {
  const steps: ServiceProcessStep[] = [];
  for (const card of cards) {
    const parsed = parseNumberedStepTitle(card.title);
    if (!parsed || card.image) return null;
    steps.push({
      number: parsed.number.replace(/\.$/, ""),
      title: parsed.title,
      body: card.body,
    });
  }
  return steps.length >= 3 ? steps : null;
}

function parseTextSpotlight(
  $: CheerioAPI,
  row: Element,
  origin: string,
  index: number,
): FeatureSplitData | null {
  if ($(row).find(".wp-block-media-text, .wp-block-kadence-infobox, .kt-accordion-pane").length) {
    return null;
  }
  if (parseProcessSteps($, row)) return null;

  const headings = $(row)
    .find(".wp-block-kadence-advancedheading, h2, h3")
    .toArray()
    .map((h) => nodeText($, h))
    .filter(Boolean)
    .filter((h) => !isNumberHeading(h));

  // Long advancedheading used as body on branding spotlight.
  const titleCandidates = headings.filter((h) => h.length < 80);
  const bodyFromHeading = headings.find((h) => h.length >= 80);
  const bodyFromParagraphs = $(row)
    .find("p")
    .toArray()
    .map((p) => nodeText($, p))
    .filter(Boolean)
    .join(" ");
  const body = bodyFromParagraphs || bodyFromHeading || "";
  const cta = extractCta($, row, origin);
  if (titleCandidates.length === 0 || body.length < 80 || !cta) return null;

  return {
    eyebrow: titleCandidates.length > 1 ? titleCandidates[0] : undefined,
    title:
      titleCandidates.length > 1
        ? titleCandidates[1]
        : titleCandidates[0] || "",
    body,
    bullets: [],
    cta,
    image: null,
    mediaPosition: "right",
    tone: index % 2 === 1 ? "muted" : "default",
  };
}

function mergeProcessSection(
  current: ServiceProcessSection | null,
  next: ServiceProcessSection,
): ServiceProcessSection {
  if (!current) return next;
  const seen = new Set(current.steps.map((s) => s.title.toLowerCase()));
  const added = next.steps.filter((s) => !seen.has(s.title.toLowerCase()));
  return {
    eyebrow: current.eyebrow || next.eyebrow,
    title: current.title || next.title,
    steps: [...current.steps, ...added],
  };
}

/**
 * Infer a truthful package-card title from checklist items when WP titles
 * were copy-pasted incorrectly (e.g. duplicate "Reputation & Branding").
 * Only rewrites when the heading clearly disagrees with the items.
 */
function inferInfoCardTitleFromContent(card: ServiceInfoCard): string {
  const blob = [...(card.items || []), card.body || ""].join(" ").toLowerCase();
  if (!blob) return card.title;

  const title = card.title;
  const looksEmail =
    /mailchimp|mailchamp|list management|list hygiene|template design & development/i.test(
      blob,
    );
  const looksPaid =
    /google ads|retargeting campaigns|call tracking|budget optimization/i.test(blob) &&
    !/google business profile|map pack|local seo/i.test(blob);

  // Email checklist under an SEO / reputation heading.
  if (looksEmail && /search|seo|local|reputation|branding/i.test(title)) {
    return "Email Marketing";
  }
  // Paid-ads checklist under a duplicated reputation / SEO heading.
  if (looksPaid && /reputation|branding|search|seo/i.test(title)) {
    return "Paid Advertising";
  }

  return title;
}

/**
 * Correct mislabeled package-card titles from checklist content.
 * Overlay imagery is intentionally not attached — this grid stays icon/text.
 */
function enrichPackagesWithOverlayMedia(
  packageSections: ServicePackageSection[],
  _overlayCards: ServiceOverlayCard[],
): {
  packageSections: ServicePackageSection[];
  overlayCards: ServiceOverlayCard[];
} {
  const sections = packageSections.map((section) => ({
    ...section,
    cards: section.cards.map((card) => ({
      ...card,
      title: inferInfoCardTitleFromContent(card),
      image: undefined,
    })),
  }));

  return {
    packageSections: sections,
    // Drop the separate overlay strip so it is not shown under text cards.
    overlayCards: [],
  };
}

/**
 * Structure-detecting normalizer for service pages.
 * Prefer pattern detection over hard-coded Kadence row IDs.
 */
export function normalizeServicePageHtml(
  html: string,
  pageTitle: string,
  excerpt = "",
): ServicePageContent {
  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="service-root">${html}</div>`);
  const rows = collectServiceRows($);

  let intro: ServicePageContent["intro"] = null;
  const offerGroups: ServiceOfferGroup[] = [];
  const features: FeatureSplitData[] = [];
  const packageSections: ServicePackageSection[] = [];
  let mediaCardSection: ServiceMediaCardSection | null = null;
  let processSection: ServiceProcessSection | null = null;
  let statsSection: ServiceStatsSection | null = null;
  const videoSections: ServiceVideoSection[] = [];
  let mediaTabsSection: ServiceMediaTabsSection | null = null;
  let gallerySection: ServiceGallerySection | null = null;
  let partnerLogos: ServicePartnerLogos | null = null;
  let overlayCards: ServiceOverlayCard[] = [];
  const leadSections: ServiceLeadSection[] = [];
  let linkBanner: ServiceLinkBanner | null = null;
  let promoBand: ServicePromoBand | null = null;
  let faqs: ServicePageContent["faqs"] = null;
  let relatedServices: ServiceRelated[] = [];
  let cta: PageCtaData | null = null;
  let featureIndex = 0;
  let pendingMediaCardTitle: string | null = null;
  let pendingVideoMeta: { eyebrow?: string; title?: string } | null = null;
  const extraHeroSlides: Array<{ src: string; alt: string; kind: "image" }> = [];

  for (const row of rows) {
    const $row = $(row);
    const paneCount = $row.find(".wp-block-kadence-pane, .kt-accordion-pane").length;

    if (!intro) {
      const splitHero = parseSplitHero($, row, origin);
      if (splitHero) {
        intro = splitHero.intro;
        extraHeroSlides.push(splitHero.slide);
        continue;
      }
    }

    if (paneCount > 0) {
      if (isFaqAccordion($, row)) {
        faqs = parseFaqs($, row);
      } else {
        const cards = parseMediaCards($, row, origin);
        const processFromPanes = processStepsFromMediaCards(cards);
        const outsideHeadings = $row
          .find(".wp-block-kadence-advancedheading, h1, h2, h3")
          .toArray()
          .filter(
            (el) =>
              $(el).closest(".wp-block-kadence-pane, .kt-accordion-pane").length === 0,
          )
          .map((h) => nodeText($, h))
          .filter(Boolean);
        const outsideBody = cleanText(
          $row
            .find("p")
            .toArray()
            .filter(
              (el) =>
                $(el).closest(".wp-block-kadence-pane, .kt-accordion-pane").length === 0,
            )
            .map((p) => nodeText($, p))
            .find((t) => t.length > 40) || "",
        );

        if (processFromPanes) {
          if (!intro && outsideHeadings.length > 0) {
            intro = introFromHeadings(outsideHeadings, outsideBody || undefined);
          }
          // Prefer desktop process grids when present; accordion is often a mobile duplicate.
          if (!processSection) {
            processSection = {
              eyebrow: pendingMediaCardTitle || undefined,
              title: undefined,
              steps: processFromPanes,
            };
          }
          pendingMediaCardTitle = null;
        } else if (cards.length > 0) {
          mediaCardSection = mergeMediaCardSection(mediaCardSection, {
            title: pendingMediaCardTitle || undefined,
            cards,
          });
          pendingMediaCardTitle = null;
        }
      }
      continue;
    }

    if (isCtaRow($, row)) {
      cta = parseCta($, row, origin);
      continue;
    }

    const stats = parseStatsSection($, row);
    if (stats) {
      statsSection = stats;
      continue;
    }

    const mediaTabs = parseMediaTabsSection($, row, origin);
    if (mediaTabs) {
      mediaTabsSection = mediaTabs;
      continue;
    }

    const videoSrc = parseVideoEmbed($, row);
    if (videoSrc) {
      videoSections.push({
        eyebrow: pendingVideoMeta?.eyebrow,
        title: pendingVideoMeta?.title,
        src: videoSrc,
      });
      pendingVideoMeta = null;
      continue;
    }

    if ($row.find(".wp-block-media-text").length > 0) {
      const feature = parseMediaTextFeature($, row, origin, featureIndex);
      if (feature?.title) {
        features.push(feature);
        featureIndex += 1;
      }
      continue;
    }

    const portfolioCards = parsePortfolioCards($, row, origin);
    if (portfolioCards) {
      const sectionHeadings = $row
        .find(".wp-block-kadence-advancedheading, h2")
        .toArray()
        .filter((el) => $(el).closest(".wp-block-kadence-infobox").length === 0)
        .map((h) => nodeText($, h))
        .filter(Boolean);
      mediaCardSection = mergeMediaCardSection(mediaCardSection, {
        title: pendingMediaCardTitle || sectionHeadings[0] || undefined,
        cards: portfolioCards,
      });
      pendingMediaCardTitle = null;
      continue;
    }

    const infoCards = parseInfoCards($, row);
    if (infoCards.length >= 3) {
      const hasItems = infoCards.some((card) => (card.items?.length || 0) > 0);
      const headingEls = $row
        .find(".wp-block-kadence-advancedheading, h2")
        .toArray()
        .filter(
          (el) => $(el).closest(".wp-block-kadence-infobox").length === 0,
        )
        .map((h) => nodeText($, h))
        .filter(Boolean);
      const cardTitles = new Set(infoCards.map((c) => c.title));
      const sectionHeadings = headingEls.filter((h) => !cardTitles.has(h));

      if (hasItems) {
        packageSections.push({
          title: sectionHeadings[0] || headingEls[0] || "",
          cards: infoCards,
        });
      } else {
        if (!intro && sectionHeadings.length > 0) {
          intro = introFromHeadings(sectionHeadings);
        }
        offerGroups.push({ cards: infoCards });
      }
      continue;
    }

    const process = parseProcessSteps($, row);
    if (process) {
      processSection = mergeProcessSection(processSection, process);
      continue;
    }

    if (processSection && !promoBand) {
      const band = parsePromoBand($, row, origin);
      if (band) {
        promoBand = band;
        continue;
      }
    }

    if (isRelatedRow($, row)) {
      relatedServices = parseRelated($, row, origin);
      continue;
    }

    const partners = parsePartnerLogos($, row, origin);
    if (partners) {
      partnerLogos = partners;
      continue;
    }

    const gallery = parseGallery($, row, origin);
    if (gallery && (features.length > 0 || offerGroups.length > 0 || mediaCardSection)) {
      gallerySection = gallery;
      continue;
    }

    const overlays = parseOverlayCards($, row, origin);
    if (overlays.length >= 3 && (features.length > 0 || offerGroups.length > 0)) {
      overlayCards = overlays;
      continue;
    }

    // Two-column image + copy feature splits (HVAC / Dental / etc.).
    // Must run before leaf-only channel parsing so sibling <img> media is kept.
    const bgFeature = parseBackgroundFeature($, row, origin, featureIndex);
    if (
      bgFeature?.title &&
      (bgFeature.image || (bgFeature.bullets?.length || 0) > 0 || bgFeature.body)
    ) {
      if (
        ((bgFeature.body && bgFeature.body.length > 40) ||
          (bgFeature.bullets?.length || 0) > 0) &&
        bgFeature.image
      ) {
        features.push(bgFeature);
        featureIndex += 1;
        continue;
      }
    }

    const channelFeatures = parseChannelFeatureLeaves($, row, origin, featureIndex);
    if (channelFeatures.length > 0) {
      features.push(...channelFeatures);
      featureIndex += channelFeatures.length;
      continue;
    }

    const spotlight = parseTextSpotlight($, row, origin, featureIndex);
    if (spotlight?.title) {
      features.push(spotlight);
      featureIndex += 1;
      continue;
    }

    const banner = parseLinkBanner($, row, origin);
    if (banner && (features.length > 0 || intro || partnerLogos) && !linkBanner) {
      linkBanner = banner;
      continue;
    }

    if (isIntroRow($, row) && !intro) {
      const headings = $row
        .find(".wp-block-kadence-advancedheading, h1, h2, h3")
        .toArray()
        .map((h) => nodeText($, h))
        .filter(Boolean);

      if (
        headings.length === 1 &&
        (/formats?|options|solutions|projects|portfolio|work/i.test(headings[0]) ||
          features.length > 0 ||
          mediaCardSection)
      ) {
        pendingMediaCardTitle = headings[0];
        continue;
      }

      if (
        headings.length >= 1 &&
        headings.length <= 2 &&
        /tv creative|as seen on|watch|video/i.test(headings.join(" "))
      ) {
        pendingVideoMeta = {
          eyebrow: headings[0],
          title: headings[1],
        };
        continue;
      }

      intro = introFromHeadings(headings);
      continue;
    }

    // Title-only row that precedes a portfolio grid (even if intro already set).
    if (isIntroRow($, row) && !pendingMediaCardTitle) {
      const headings = $row
        .find(".wp-block-kadence-advancedheading, h1, h2, h3")
        .toArray()
        .map((h) => nodeText($, h))
        .filter(Boolean);
      if (
        headings.length === 1 &&
        /projects|portfolio|work|latest/i.test(headings[0])
      ) {
        pendingMediaCardTitle = headings[0];
        continue;
      }
      if (
        headings.length >= 1 &&
        headings.length <= 2 &&
        /tv creative|as seen on|watch|video/i.test(headings.join(" "))
      ) {
        pendingVideoMeta = {
          eyebrow: headings[0],
          title: headings[1],
        };
        continue;
      }
    }

    const lead = parseLead($, row);
    if (lead && lead.paragraphs.some((p) => p.length > 80)) {
      if (features.length > 0 || offerGroups.length > 0 || intro || mediaCardSection || partnerLogos) {
        if (!lead.title || !isNumberHeading(lead.title.replace(/\.$/, ""))) {
          leadSections.push(lead);
          continue;
        }
      }
    }
  }

  const sliderSlides = extractSmartSliderSlides(html, origin);
  const heroSlides =
    sliderSlides.length > 0
      ? sliderSlides
      : extraHeroSlides.map((slide) => ({
          src: slide.src,
          alt: slide.alt,
          kind: slide.kind as "image" | "video",
        }));
  const heroCopy = inferHeroCopy(html, pageTitle);

  const enriched = enrichPackagesWithOverlayMedia(packageSections, overlayCards);

  return {
    title: cleanText(pageTitle),
    excerpt: cleanText(excerpt),
    hero: {
      slides: heroSlides,
      ...heroCopy,
    },
    intro,
    offerGroups,
    features,
    packageSection: enriched.packageSections[0] || null,
    packageSections: enriched.packageSections,
    mediaCardSection,
    processSection,
    statsSection,
    videoSections,
    mediaTabsSection,
    gallerySection,
    partnerLogos,
    overlayCards: enriched.overlayCards,
    leadSection: leadSections[0] || null,
    leadSections,
    summary: null,
    narrative: null,
    linkBanner,
    promoBand,
    faqs,
    relatedServices,
    cta,
  };
}
