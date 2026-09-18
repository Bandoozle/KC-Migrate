import type { Metadata } from "next";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getDentalMarketingContent } from "@/lib/wordpress/marketing-program";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("dental-marketing");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Dental Marketing To Grow Your Practice | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function DentalMarketingPage() {
  const content = await getDentalMarketingContent();
  return <MarketingProgramPageView content={content} />;
}
