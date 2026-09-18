import type { Metadata } from "next";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getSiteMapContent } from "@/lib/wordpress/site-map";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("site-map");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Full Site Menu | Kosick Communications",
  };
}

export default async function SiteMapPage() {
  const content = await getSiteMapContent();

  return (
    <main>
      <LinkDirectory title={content.title} sections={content.sections} />
    </main>
  );
}
