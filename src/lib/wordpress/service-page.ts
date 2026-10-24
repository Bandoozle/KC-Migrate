import { cache } from "react";
import {
  applyIndustryServiceHero,
  INDUSTRY_SERVICE_HEROES,
  type IndustryServiceHeroCopy,
} from "@/lib/content/industry-heroes";
import { getPageBySlug, WordPressApiError } from "@/lib/wordpress";
import { enrichSeoNarrative } from "@/lib/wordpress/seo-narrative";
import { normalizeServicePageHtml } from "@/lib/wordpress/service-page-parse";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";

export type { ServicePageContent } from "@/lib/wordpress/service-page-types";

async function loadServicePage(slug: string): Promise<ServicePageContent> {
  const page = await getPageBySlug(slug);
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      `Service page "${slug}" content was not returned by WordPress REST.`,
    );
  }

  return normalizeServicePageHtml(
    page.content.rendered,
    page.title.rendered,
    page.excerpt?.rendered || "",
  );
}

function withServiceHero(slug: string, copy: IndustryServiceHeroCopy) {
  return cache(async () => {
    const content = await loadServicePage(slug);
    return {
      ...content,
      hero: applyIndustryServiceHero(content, copy),
    };
  });
}

export const getEmailMarketingContent = withServiceHero(
  "email-marketing",
  INDUSTRY_SERVICE_HEROES.email,
);

export const getSocialMediaMarketingContent = withServiceHero(
  "social-media-marketing",
  INDUSTRY_SERVICE_HEROES.social,
);

export const getSearchEngineOptimizationContent = cache(async () => {
  const page = await getPageBySlug("search-engine-optimization");
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      `Service page "search-engine-optimization" content was not returned by WordPress REST.`,
    );
  }

  const parsed = normalizeServicePageHtml(
    page.content.rendered,
    page.title.rendered,
    page.excerpt?.rendered || "",
  );
  const enriched = enrichSeoNarrative(page.content.rendered, parsed);
  return {
    ...enriched,
    hero: applyIndustryServiceHero(enriched, INDUSTRY_SERVICE_HEROES.seo),
  };
});

export const getRadioAdvertisingContent = withServiceHero(
  "radio-advertising",
  INDUSTRY_SERVICE_HEROES.radio,
);

export const getTelevisionAdvertisingContent = withServiceHero(
  "television-advertising",
  INDUSTRY_SERVICE_HEROES.television,
);

export const getOutdoorAdvertisingContent = withServiceHero(
  "outdoor-advertising",
  INDUSTRY_SERVICE_HEROES.outdoor,
);

export const getDigitalConnectedTvContent = withServiceHero(
  "digital-connected-tv",
  INDUSTRY_SERVICE_HEROES.connectedTv,
);

export const getBusinessDevelopmentContent = withServiceHero(
  "business-development",
  INDUSTRY_SERVICE_HEROES.businessDevelopment,
);

export const getCreativeContent = withServiceHero(
  "creative",
  INDUSTRY_SERVICE_HEROES.creative,
);

export const getCorporateBrandingContent = withServiceHero(
  "corporate-branding",
  INDUSTRY_SERVICE_HEROES.corporateBranding,
);

export const getWebsiteDevelopmentContent = withServiceHero(
  "website-development",
  INDUSTRY_SERVICE_HEROES.website,
);

export const getCorporateEventsContent = withServiceHero(
  "corporate-events",
  INDUSTRY_SERVICE_HEROES.events,
);
