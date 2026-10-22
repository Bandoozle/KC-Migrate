import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ResourceGuidePageView } from "@/components/sections/ResourceGuidePageView";
import { getBillboardDimensionsContent } from "@/lib/wordpress/resource-guide";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/outdoor-advertising/billboard-dimensions/");
}

export default async function BillboardDimensionsPage() {
  const content = await getBillboardDimensionsContent();
  return <ResourceGuidePageView content={content} />;
}
