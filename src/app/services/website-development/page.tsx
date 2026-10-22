import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getWebsiteDevelopmentContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/website-development/");
}

export default async function WebsiteDevelopmentPage() {
  const content = await getWebsiteDevelopmentContent();
  return <ServicePageView content={content} />;
}
