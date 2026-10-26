import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { SocialMediaMarketingPage as SocialMediaMarketingView } from "@/components/sections/social-media/SocialMediaMarketingPage";
import { getSocialMediaMarketingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/social-media-marketing/");
}

export default async function SocialMediaMarketingPage() {
  const content = await getSocialMediaMarketingContent();
  return <SocialMediaMarketingView content={content} />;
}
