import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getSearchEngineOptimizationContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("search-engine-optimization");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Search Engine Optimization | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function SearchEngineOptimizationPage() {
  const content = await getSearchEngineOptimizationContent();
  return <ServicePageView content={content} />;
}
