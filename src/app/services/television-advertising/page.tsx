import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getTelevisionAdvertisingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/television-advertising/");
}

export default async function TelevisionAdvertisingPage() {
  const content = await getTelevisionAdvertisingContent();
  return <ServicePageView content={content} />;
}
