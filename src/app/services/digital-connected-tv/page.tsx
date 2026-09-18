import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getDigitalConnectedTvContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("digital-connected-tv");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Digital Connected TV | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function DigitalConnectedTvPage() {
  const content = await getDigitalConnectedTvContent();
  return <ServicePageView content={content} />;
}
