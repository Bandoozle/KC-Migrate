import { canonicalUrl, PRODUCTION_SITE_ORIGIN } from "@/lib/site";

/**
 * Kosick as a schema.org provider. The `@id` is the one Rank Math gives the
 * LocalBusiness/Organization on every WordPress-era page, so Google treats the
 * provider of each native Service page as that same business.
 */
export const ORGANIZATION_REF = {
  "@type": "Organization",
  "@id": `${PRODUCTION_SITE_ORIGIN}/#organization`,
  name: "Kosick Communications",
  url: canonicalUrl("/"),
} as const;
