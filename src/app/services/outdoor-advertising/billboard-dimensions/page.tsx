import type { Metadata } from "next";
import { ResourceGuidePageView } from "@/components/sections/ResourceGuidePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getBillboardDimensionsContent } from "@/lib/wordpress/resource-guide";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("billboard-dimensions");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Canadian Billboard Dimensions | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function BillboardDimensionsPage() {
  const content = await getBillboardDimensionsContent();
  return <ResourceGuidePageView content={content} />;
}
