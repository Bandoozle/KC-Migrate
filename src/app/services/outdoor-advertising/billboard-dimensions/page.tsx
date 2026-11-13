import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ResourceGuidePageView } from "@/components/sections/ResourceGuidePageView";
import { getBillboardDimensionsContent } from "@/lib/wordpress/resource-guide";
import { getTelevisionAdvertisingContent } from "@/lib/wordpress/service-page";

export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/outdoor-advertising/billboard-dimensions/");
}

export default async function BillboardDimensionsPage() {
  const [content, television] = await Promise.all([
    getBillboardDimensionsContent(),
    getTelevisionAdvertisingContent().catch(() => null),
  ]);
  const mediaOwner =
    television?.partnerLogos?.logos.find((logo) => /pattison/i.test(`${logo.src} ${logo.alt}`)) ?? null;

  return <ResourceGuidePageView content={content} mediaOwner={mediaOwner} showOutdoorPrinciples />;
}
