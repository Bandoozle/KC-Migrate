import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { OutdoorAdvertisingPage as OutdoorAdvertisingView } from "@/components/sections/outdoor/OutdoorAdvertisingPage";
import { getOutdoorAdvertisingContent, getTelevisionAdvertisingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/outdoor-advertising/");
}

export default async function OutdoorAdvertisingPage() {
  const [content, television] = await Promise.all([
    getOutdoorAdvertisingContent(),
    getTelevisionAdvertisingContent().catch(() => null),
  ]);
  const mediaOwner = television?.partnerLogos?.logos.find((logo) => /pattison/i.test(`${logo.src} ${logo.alt}`)) ?? null;
  return <OutdoorAdvertisingView content={content} mediaOwner={mediaOwner} />;
}
