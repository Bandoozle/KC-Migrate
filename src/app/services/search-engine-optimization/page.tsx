import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { SeoMarketingPage } from "@/components/sections/SeoMarketingPage";
import { getSearchEngineOptimizationContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/search-engine-optimization/");
}

export default async function SearchEngineOptimizationPage() {
  const content = await getSearchEngineOptimizationContent();
  return <SeoMarketingPage content={content} />;
}
