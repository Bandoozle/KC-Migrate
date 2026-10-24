import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { DentalMarketingPage as DentalMarketingView } from "@/components/sections/DentalMarketingPage";
import { getDentalMarketingContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/dental-marketing/");
}

export default async function DentalMarketingPage() {
  const content = await getDentalMarketingContent();
  return <DentalMarketingView content={content} />;
}
