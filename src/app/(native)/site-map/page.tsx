import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { getSiteMapContent } from "@/lib/wordpress/site-map";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/site-map/");
}

export default async function SiteMapPage() {
  const content = await getSiteMapContent();

  return (
    <main>
      <LinkDirectory title={content.title} sections={content.sections} />
    </main>
  );
}
