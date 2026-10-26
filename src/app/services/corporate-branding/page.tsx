import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { CorporateBrandingPage as CorporateBrandingView } from "@/components/sections/corporate-branding/CorporateBrandingPage";
import { getCorporateBrandingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/corporate-branding/");
}

export default async function CorporateBrandingPage() {
  const content = await getCorporateBrandingContent();
  return <CorporateBrandingView content={content} />;
}
