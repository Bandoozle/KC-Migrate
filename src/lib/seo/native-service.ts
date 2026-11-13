import type { Metadata } from "next";
import { faqJsonLd } from "@/lib/industries/faqs";
import { ORGANIZATION_REF } from "@/lib/seo/organization";
import { canonicalUrl, PRODUCTION_SITE_ORIGIN } from "@/lib/site";
import type { FaqItem } from "@/lib/wordpress/digital-marketing";

/**
 * Metadata and structured data for service pages built on the new site, which have no
 * Rank Math record. Same conventions as the captured pages: " | Kosick Communications"
 * titles, canonical on www, Open Graph image from the site's own uploads.
 */
export type NativeServiceSeo = { path: string; title: string; description: string; image?: string };

const DEFAULT_IMAGE = "/wp-content/uploads/2026/06/kosick-communications-branding.jpg";

export function nativeServiceMetadata({ path, title, description, image = DEFAULT_IMAGE }: NativeServiceSeo): Metadata {
  const url = canonicalUrl(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      siteName: "Kosick Communications",
      locale: "en_US",
      title,
      description,
      url,
      images: [{ url: `${PRODUCTION_SITE_ORIGIN}${image}` }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** Service, breadcrumb and FAQPage structured data in one graph. */
export function nativeServiceJsonLd({ path, name, description, faqs }: { path: string; name: string; description: string; faqs: FaqItem[] }) {
  const url = canonicalUrl(path);
  const faq = faqJsonLd(faqs);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${url}#service`, name, description, url, areaServed: "CA", provider: ORGANIZATION_REF },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: canonicalUrl("/services/") },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq.mainEntity },
    ],
  };
}
