import * as cheerio from "cheerio";
import { absUrl } from "@/lib/wordpress/shared";

/** Neutral card image used only when a post has no usable media. */
export const RESOURCE_CARD_FALLBACK = "/images/resource-card-fallback.svg";

const SKIP_SRC =
  /logo|icon|favicon|pixel|spacer|tracking|gravatar|emoji|badge|sprite|wp-smiley|cropped-kosick|1x1|blank\.gif/i;

type MediaSize = {
  source_url?: string;
  width?: number;
  height?: number;
};

export type EmbeddedFeaturedMedia = {
  source_url?: string;
  alt_text?: string;
  code?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, MediaSize>;
  };
};

export type ResourceCardImage = {
  src: string;
  alt: string;
};

function numeric(value: string | undefined): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function isTooSmall(width?: number, height?: number): boolean {
  if (width && width < 200) return true;
  if (height && height < 200) return true;
  return false;
}

function isUsableImage(src: string, width?: number, height?: number): boolean {
  const value = src.trim();
  if (!value || value.startsWith("data:")) return false;
  if (SKIP_SRC.test(value)) return false;
  if (/\.svg(\?|$)/i.test(value)) return false;
  if (isTooSmall(width, height)) return false;
  return true;
}

function featuredSource(media: EmbeddedFeaturedMedia | undefined): ResourceCardImage | null {
  if (!media?.source_url || media.code) return null;
  const sizes = media.media_details?.sizes;
  const sized = sizes?.large || sizes?.medium_large;
  const src = sized?.source_url || media.source_url;
  const width = sized?.width || media.media_details?.width;
  const height = sized?.height || media.media_details?.height;
  if (!isUsableImage(src, width, height)) return null;
  return { src, alt: media.alt_text || "" };
}

function firstContentImage(html: string, origin: string): ResourceCardImage | null {
  if (!html) return null;
  const $ = cheerio.load(html);
  const images = $("img").toArray();
  for (const image of images) {
    const src = absUrl($(image).attr("src") || $(image).attr("data-src") || null, origin);
    if (!src) continue;
    const width = numeric($(image).attr("width"));
    const height = numeric($(image).attr("height"));
    if (!isUsableImage(src, width, height)) continue;
    return { src, alt: $(image).attr("alt") || "" };
  }
  return null;
}

/**
 * featured image → first meaningful image in the article → shared card fallback.
 */
export function resolveResourceImage(
  media: EmbeddedFeaturedMedia | undefined,
  contentHtml: string,
  origin: string,
  altFallback: string,
): ResourceCardImage {
  const featured = featuredSource(media);
  if (featured) return { ...featured, alt: featured.alt || altFallback };

  const contentImage = firstContentImage(contentHtml, origin);
  if (contentImage) return { ...contentImage, alt: contentImage.alt || altFallback };

  return { src: RESOURCE_CARD_FALLBACK, alt: altFallback };
}
