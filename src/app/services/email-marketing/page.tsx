import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getEmailMarketingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/email-marketing/");
}

export default async function EmailMarketingPage() {
  const content = await getEmailMarketingContent();
  return <ServicePageView content={content} />;
}
