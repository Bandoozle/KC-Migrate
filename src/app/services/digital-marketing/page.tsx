import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { DigitalMarketingView } from "@/components/sections/digital-marketing/DigitalMarketingView";
import { getDigitalMarketingContent } from "@/lib/wordpress/digital-marketing";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/digital-marketing/");
}

export default async function DigitalMarketingPage() {
  const content = await getDigitalMarketingContent();
  return <DigitalMarketingView content={content} />;
}
