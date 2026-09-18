import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getRadioAdvertisingContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("radio-advertising");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Radio Advertising | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function RadioAdvertisingPage() {
  const content = await getRadioAdvertisingContent();
  return <ServicePageView content={content} />;
}
