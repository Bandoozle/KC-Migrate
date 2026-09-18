import { cache } from "react";
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

export const getEmailMarketingContent = cache(() =>
  loadServicePage("email-marketing"),
);

export const getSocialMediaMarketingContent = cache(() =>
  loadServicePage("social-media-marketing"),
);

export const getSearchEngineOptimizationContent = cache(() =>
  loadServicePage("search-engine-optimization"),
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

export const getWebsiteDevelopmentContent = cache(() =>
  loadServicePage("website-development"),
);

export const getCorporateEventsContent = cache(() =>
  loadServicePage("corporate-events"),
);
