import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { getGolfMarketingContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/golf-marketing/");
}

export default async function GolfMarketingPage() {
  const content = await getGolfMarketingContent();
  return <MarketingProgramPageView content={content} />;
}
