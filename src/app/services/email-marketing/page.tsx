import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getEmailMarketingContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("email-marketing");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Email Marketing | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function EmailMarketingPage() {
  const content = await getEmailMarketingContent();
  return <ServicePageView content={content} />;
}
