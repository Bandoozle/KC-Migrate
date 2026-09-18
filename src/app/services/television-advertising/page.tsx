import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getTelevisionAdvertisingContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("television-advertising");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Television Advertising | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function TelevisionAdvertisingPage() {
  const content = await getTelevisionAdvertisingContent();
  return <ServicePageView content={content} />;
}
