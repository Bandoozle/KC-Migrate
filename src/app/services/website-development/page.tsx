import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getWebsiteDevelopmentContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("website-development");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Website Development & E-Commerce | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function WebsiteDevelopmentPage() {
  const content = await getWebsiteDevelopmentContent();
  return <ServicePageView content={content} />;
}
