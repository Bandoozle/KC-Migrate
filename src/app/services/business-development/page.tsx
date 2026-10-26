import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { BusinessDevelopmentPage as BusinessDevelopmentView } from "@/components/sections/business-development/BusinessDevelopmentPage";
import { getBusinessDevelopmentContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/business-development/");
}

export default async function BusinessDevelopmentPage() {
  const content = await getBusinessDevelopmentContent();
  return <BusinessDevelopmentView content={content} />;
}
