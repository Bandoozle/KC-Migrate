import type { Metadata } from "next";
import manifest from "@/lib/seo/social-images.generated.json";
import { canonicalPath, PRODUCTION_SITE_ORIGIN } from "@/lib/site";

/*
 * Link-preview images. Sources are chosen in social-image-sources.json; `npm run social-images`
 * crops each to a 1200 × 630 JPEG and writes social-images.generated.json, read here.
 * Pages without an entry get the Kosick-branded card, never another page's image.
 */

type ManifestEntry = { file: string; alt: string };
const pages = manifest.pages as Record<string, ManifestEntry>;

export type SocialImage = { url: string; width: number; height: number; alt: string; type: "image/jpeg" };

/** The link-preview image for a page, as an absolute production URL. */
export function socialImage(path: string): SocialImage {
  const entry = pages[canonicalPath(path)] ?? manifest.fallback;
  return {
    url: `${PRODUCTION_SITE_ORIGIN}${manifest.dir}/${entry.file}`,
    width: manifest.width,
    height: manifest.height,
    alt: entry.alt,
    type: "image/jpeg",
  };
}

/** The Open Graph image list and the matching Twitter card, so the two never disagree. */
export function socialPreview(path: string, text: { title: string; description?: string }) {
  const image = socialImage(path);
  return {
    images: [image],
    twitter: {
      card: "summary_large_image",
      title: text.title,
      description: text.description,
      images: [{ url: image.url, alt: image.alt }],
    } satisfies Metadata["twitter"],
  };
}
