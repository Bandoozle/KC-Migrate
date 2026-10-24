import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { EmailMarketingPage } from "@/components/sections/email-marketing/EmailMarketingPage";
import { getEmailMarketingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/email-marketing/");
}

export default async function Page() {
  const content = await getEmailMarketingContent();
  return <EmailMarketingPage content={content} />;
}
