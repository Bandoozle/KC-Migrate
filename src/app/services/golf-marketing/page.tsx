import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { GolfMarketingPage as GolfMarketingView } from "@/components/sections/GolfMarketingPage";
import { getGolfMarketingContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/golf-marketing/");
}

export default async function GolfMarketingPage() {
  const content = await getGolfMarketingContent();
  return <GolfMarketingView content={content} />;
}
