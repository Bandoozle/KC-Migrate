import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { getCorporateBrandingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/corporate-branding/");
}

export default async function CorporateBrandingPage() {
  const content = await getCorporateBrandingContent();
  return <ServicePageView content={content} />;
}
