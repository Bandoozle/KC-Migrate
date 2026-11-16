import type { Metadata } from "next";
import { socialPreview } from "@/lib/seo/social-image";
import { canonicalUrl } from "@/lib/site";
import { servicePath } from "./index";
import type { Industry, IndustryService } from "./types";

/* Same shape as the Rank Math pages, written here because these pages have no WordPress SEO record */
function pageMetadata(path: string, seo: { title: string; description: string }): Metadata {
  const url = canonicalUrl(path);
  const { images, twitter } = socialPreview(path, seo);
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Kosick Communications",
      locale: "en_US",
      title: seo.title,
      description: seo.description,
      url,
      images,
    },
    twitter,
  };
}

export function industryServiceMetadata(industry: Industry, service: IndustryService): Metadata {
  return pageMetadata(servicePath(industry, service), service.seo);
}

export function industryLandingMetadata(industry: Industry): Metadata {
  if (!industry.landing) throw new Error(`${industry.id} has a WordPress page; use its Rank Math metadata`);
  return pageMetadata(industry.path, industry.landing.seo);
}
