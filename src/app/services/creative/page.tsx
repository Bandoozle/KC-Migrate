import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getCreativeContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/creative/");
}

export default async function CreativePage() {
  const content = await getCreativeContent();
  return <ServicePageView content={content} />;
}
