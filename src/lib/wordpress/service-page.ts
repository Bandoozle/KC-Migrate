import { cache } from "react";
import {
  applyIndustryServiceHero,
  INDUSTRY_SERVICE_HEROES,
  type IndustryServiceHeroCopy,
} from "@/lib/content/industry-heroes";
import { getPageBySlug, WordPressApiError } from "@/lib/wordpress";
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

export const getSearchEngineOptimizationContent = withServiceHero(
  "search-engine-optimization",
  INDUSTRY_SERVICE_HEROES.seo,
);

export const getRadioAdvertisingContent = cache(() =>
  loadServicePage("radio-advertising"),
);

export const getTelevisionAdvertisingContent = cache(() =>
  loadServicePage("television-advertising"),
);

export const getOutdoorAdvertisingContent = cache(() =>
  loadServicePage("outdoor-advertising"),
);

export const getDigitalConnectedTvContent = cache(() =>
  loadServicePage("digital-connected-tv"),
);

export const getBusinessDevelopmentContent = cache(() =>
  loadServicePage("business-development"),
);

export const getCreativeContent = cache(() => loadServicePage("creative"));

export const getCorporateBrandingContent = cache(() =>
  loadServicePage("corporate-branding"),
);

export const getWebsiteDevelopmentContent = withServiceHero(
  "website-development",
  INDUSTRY_SERVICE_HEROES.website,
);

export const getCorporateEventsContent = cache(() =>
  loadServicePage("corporate-events"),
);
