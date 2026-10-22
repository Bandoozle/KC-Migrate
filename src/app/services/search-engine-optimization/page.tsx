import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getSearchEngineOptimizationContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/search-engine-optimization/");
}

export default async function SearchEngineOptimizationPage() {
  const content = await getSearchEngineOptimizationContent();
  return <ServicePageView content={content} />;
}
