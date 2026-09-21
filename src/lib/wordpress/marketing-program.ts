import { cache } from "react";
import { applyHvacMarketingLocalAssets } from "@/lib/assets/hvac-marketing";
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

export const getDentalMarketingContent = cache(() =>
  loadMarketingProgramPage("dental-marketing"),
);

export const getGolfMarketingContent = cache(() =>
  loadMarketingProgramPage("golf-marketing"),
);

export const getHvacLeadGenerationContent = cache(() =>
  loadMarketingProgramPage("hvac-lead-generation"),
);
