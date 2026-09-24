import type { Metadata } from "next";
import { CorporateEventsPageView } from "@/components/sections/CorporateEventsPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getCorporateEventsContent } from "@/lib/wordpress/service-page";


export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("corporate-events");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Corporate Events | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function CorporateEventsPage() {
  const content = await getCorporateEventsContent();
  return <CorporateEventsPageView content={content} />;
}
