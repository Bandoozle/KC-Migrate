import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getBusinessDevelopmentContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("business-development");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Business Development | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function BusinessDevelopmentPage() {
  const content = await getBusinessDevelopmentContent();
  return <ServicePageView content={content} />;
}
