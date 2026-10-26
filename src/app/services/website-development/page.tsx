import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { WebsiteDevelopmentPage as WebsiteDevelopmentView } from "@/components/sections/website/WebsiteDevelopmentPage";
import { getWebsiteDevelopmentContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/website-development/");
}

export default async function WebsiteDevelopmentPage() {
  const content = await getWebsiteDevelopmentContent();
  return <WebsiteDevelopmentView content={content} />;
}
