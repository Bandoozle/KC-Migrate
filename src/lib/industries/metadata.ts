import type { Metadata } from "next";
import { canonicalUrl, PRODUCTION_SITE_ORIGIN } from "@/lib/site";
import { servicePath } from "./index";
import type { Industry, IndustryImage, IndustryService } from "./types";

/* Same shape as the Rank Math pages, written here because these pages have no WordPress SEO record */
function pageMetadata(path: string, seo: { title: string; description: string }, image: IndustryImage): Metadata {
  const url = canonicalUrl(path);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Kosick Communications",
      title: seo.title,
      description: seo.description,
      url,
      images: [{ url: `${PRODUCTION_SITE_ORIGIN}${image.src}`, alt: image.alt }],
    },
  };
}

export function industryServiceMetadata(industry: Industry, service: IndustryService): Metadata {
  return pageMetadata(servicePath(industry, service), service.seo, service.hero.image);
}

export function industryLandingMetadata(industry: Industry): Metadata {
  if (!industry.landing) throw new Error(`${industry.id} has a WordPress page; use its Rank Math metadata`);
  return pageMetadata(industry.path, industry.landing.seo, industry.landing.hero.image);
}
