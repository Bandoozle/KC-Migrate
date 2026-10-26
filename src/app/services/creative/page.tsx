import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { CreativeProductionPage } from "@/components/sections/creative/CreativeProductionPage";
import { getCreativeContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/creative/");
}

export default async function CreativePage() {
  const content = await getCreativeContent();
  return <CreativeProductionPage content={content} />;
}
