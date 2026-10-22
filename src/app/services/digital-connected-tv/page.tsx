import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getDigitalConnectedTvContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/digital-connected-tv/");
}

export default async function DigitalConnectedTvPage() {
  const content = await getDigitalConnectedTvContent();
  return <ServicePageView content={content} />;
}
