import type { Metadata } from "next";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getGolfMarketingContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("golf-marketing");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Strategic Golf Marketing | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function GolfMarketingPage() {
  const content = await getGolfMarketingContent();
  return <MarketingProgramPageView content={content} />;
}
