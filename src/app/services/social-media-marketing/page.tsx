import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getSocialMediaMarketingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("social-media-marketing");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Social Media Marketing | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function SocialMediaMarketingPage() {
  const content = await getSocialMediaMarketingContent();
  return <ServicePageView content={content} />;
}
