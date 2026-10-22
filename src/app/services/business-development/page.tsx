import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getBusinessDevelopmentContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/business-development/");
}

export default async function BusinessDevelopmentPage() {
  const content = await getBusinessDevelopmentContent();
  return <ServicePageView content={content} />;
}
