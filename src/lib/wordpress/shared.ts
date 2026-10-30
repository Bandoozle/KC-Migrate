import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import { SITE_ORIGINS, matchesOrigin } from "@/lib/site";
import { decodeRenderedText, CONTENT_ORIGIN } from "@/lib/wordpress";
import { isUnavailableMedia } from "@/lib/unavailable-media";
import { localMediaUrl } from "@/lib/media";

export function absUrl(url: string | undefined | null, origin = CONTENT_ORIGIN): string | null {
  if (!url) return null;
  const trimmed = localMediaUrl(url.trim());
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
  // Files in /public/images and /public/wp-content stay on this app. Other root paths are CMS assets.
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/wp-content/")) return trimmed;
  if (trimmed.startsWith("/")) return `${origin}${trimmed}`;
  // Bare domains sometimes appear in CMS link fields (e.g. "example.com").
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?].*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function toLocalPath(url: string | null, origin = CONTENT_ORIGIN): string | null {
  if (!url) return null;
  if (url === "#" || url.startsWith("#")) return null;
  if (url.startsWith("tel:") || url.startsWith("mailto:")) return url;
  const wordpress = CONTENT_ORIGIN;
  // Older posts link to the CMS host over plain http
  const bases = [origin, wordpress, wordpress.replace(/^https:/, "http:"), ...SITE_ORIGINS];
  for (const base of bases) {
    if (!matchesOrigin(url, base)) continue;
    const path = url.slice(base.length) || "/";
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
  origin = CONTENT_ORIGIN,
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
    if (!src || !/uploads/i.test(src) || seen.has(src) || isUnavailableMedia(src)) return;
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
