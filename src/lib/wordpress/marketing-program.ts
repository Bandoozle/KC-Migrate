import { cache } from "react";
import { applyHvacMarketingLocalAssets } from "@/lib/assets/hvac-marketing";
import { applyHvacLeadGenerationLayout } from "@/lib/content/hvac-lead-generation";
import { applyIndustryServiceHero, INDUSTRY_SERVICE_HEROES } from "@/lib/content/industry-heroes";
import { getPageBySlug, WordPressApiError } from "@/lib/wordpress";
import { normalizeServicePageHtml } from "@/lib/wordpress/service-page-parse";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";

export type { ServicePageContent as MarketingProgramPageContent } from "@/lib/wordpress/service-page-types";

async function loadMarketingProgramPage(slug: string): Promise<ServicePageContent> {
  const page = await getPageBySlug(slug);
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      `Marketing program page "${slug}" content was not returned by WordPress REST.`,
    );
  }

  return normalizeServicePageHtml(
    page.content.rendered,
    page.title.rendered,
    page.excerpt?.rendered || "",
  );
}

export const getHvacMarketingContent = cache(async () =>
  applyHvacMarketingLocalAssets(await loadMarketingProgramPage("hvac-marketing")),
);

export const getDentalMarketingContent = cache(async () => {
  const content = await loadMarketingProgramPage("dental-marketing");
  return { ...content, hero: applyIndustryServiceHero(content, INDUSTRY_SERVICE_HEROES.dental) };
});

export const getGolfMarketingContent = cache(async () => {
  const content = await loadMarketingProgramPage("golf-marketing");
  return { ...content, hero: applyIndustryServiceHero(content, INDUSTRY_SERVICE_HEROES.golf) };
});

export const getHvacLeadGenerationContent = cache(async () => {
  const content = await loadMarketingProgramPage("hvac-lead-generation");
  return applyHvacLeadGenerationLayout({
    ...content,
    hero: applyIndustryServiceHero(content, INDUSTRY_SERVICE_HEROES.leadGeneration),
    intro: null,
  });
});
