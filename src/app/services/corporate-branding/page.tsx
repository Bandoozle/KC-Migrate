import type { Metadata } from "next";
import { ServicePageView } from "@/components/sections/ServicePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getCorporateBrandingContent } from "@/lib/wordpress/service-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("corporate-branding");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Corporate Branding | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function CorporateBrandingPage() {
  const content = await getCorporateBrandingContent();
  return <ServicePageView content={content} />;
}
