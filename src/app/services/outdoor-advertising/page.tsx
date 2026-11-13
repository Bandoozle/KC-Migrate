import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { OutdoorAdvertisingPage as OutdoorAdvertisingView } from "@/components/sections/outdoor/OutdoorAdvertisingPage";
import { getOutdoorAdvertisingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/outdoor-advertising/");
}

export default async function OutdoorAdvertisingPage() {
  const content = await getOutdoorAdvertisingContent();
  return <OutdoorAdvertisingView content={content} />;
}
