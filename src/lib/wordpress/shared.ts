import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import { decodeRenderedText, getWordPressUrl } from "@/lib/wordpress";

export function absUrl(url: string | undefined | null, origin = getWordPressUrl()): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:")
  ) {
    return trimmed;
  }
  // Protocol-relative CDN / upload URLs from WordPress / Smart Slider.
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) return `${origin}${trimmed}`;
  // Bare domains sometimes appear in CMS link fields (e.g. "example.com").
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?].*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function toLocalPath(url: string | null, origin = getWordPressUrl()): string | null {
  if (!url) return null;
  if (url === "#" || url.startsWith("#")) return null;
  if (url.startsWith("tel:") || url.startsWith("mailto:")) return url;
  if (url.startsWith(origin)) {
    const path = url.slice(origin.length) || "/";
    return path.endsWith("/") || path.includes(".") || path.includes("?") ? path : `${path}/`;
  }
  if (url.startsWith("/")) return url;
  return url;
}

export function cleanText(value: string): string {
  return decodeRenderedText(value).replace(/\s+/g, " ").trim();
}

/**
 * Extract visible text from a Cheerio node with stable whitespace.
 * Inserts spaces for `<br>` and between adjacent block-ish tags so
 * line-broken headings do not concatenate (e.g. "ThatLeave").
 */
export function textFrom($: CheerioAPI, node: AnyNode | null | undefined): string {
  if (!node) return "";
  const clone = $(node).clone();
  clone.find("br").replaceWith(" ");
  clone.find("p, div, li, h1, h2, h3, h4, h5, h6, tr, blockquote").each((_, el) => {
    $(el).prepend(" ").append(" ");
  });
  return cleanText(clone.text());
}

export type SmartSliderSlide = {
  src: string;
  alt: string;
  kind: "image" | "video";
};

/** Extract Smart Slider background images/videos (n2 markup → native carousel slides). */
export function extractSmartSliderSlides(
  html: string,
  origin = getWordPressUrl(),
): SmartSliderSlide[] {
  const $ = cheerio.load(html);
  const slides: SmartSliderSlide[] = [];
  const seen = new Set<string>();

  $(
    ".n2-ss-slide-background-image img, .n2-ss-slide img, .n2-ss-layer img",
  ).each((_, img) => {
    const src = absUrl(
      $(img).attr("src") || $(img).attr("data-src") || $(img).attr("data-desktop"),
      origin,
    );
    if (!src || !/uploads/i.test(src) || seen.has(src)) return;
    seen.add(src);
    slides.push({ src, alt: $(img).attr("alt") || "", kind: "image" });
  });

  $(".n2-ss-slide-background-video source, .n2-ss-slide-background-video").each(
    (_, el) => {
      const src = absUrl($(el).attr("src"), origin);
      if (!src || !/\.mp4(\?|$)/i.test(src) || seen.has(src)) return;
      seen.add(src);
      slides.push({ src, alt: "", kind: "video" });
    },
  );

  return slides;
}

/** Extract short Smart Slider layer labels (title / eyebrow / CTA text). */
export function extractSmartSliderTexts(html: string): string[] {
  const $ = cheerio.load(html);
  const texts: string[] = [];
  $(".n2-ss-layer")
    .find("span, b, p, div, a, h1, h2, h3, h4")
    .each((_, el) => {
      const text = cleanText($(el).clone().children().remove().end().text());
      if (text && text.length < 100) texts.push(text);
    });
  return [...new Set(texts)];
}
