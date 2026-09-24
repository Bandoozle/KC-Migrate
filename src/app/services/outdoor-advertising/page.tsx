import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getOutdoorAdvertisingContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("outdoor-advertising");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Outdoor Advertising | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function OutdoorAdvertisingPage() {
  const content = await getOutdoorAdvertisingContent();
  return <ServicePageView content={content} />;
}
