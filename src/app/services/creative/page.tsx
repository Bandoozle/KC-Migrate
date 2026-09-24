import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getCreativeContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("creative");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Creative | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function CreativePage() {
  const content = await getCreativeContent();
  return <ServicePageView content={content} />;
}
