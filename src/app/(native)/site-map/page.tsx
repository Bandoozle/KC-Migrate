import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { LinkDirectory } from "@/components/sections/LinkDirectory";
import { getSiteMapContent } from "@/lib/wordpress/site-map";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/site-map/");
}

export default async function SiteMapPage() {
  const content = await getSiteMapContent();
  const words = content.title.trim().split(/\s+/).filter(Boolean);
  const mid = Math.max(1, Math.ceil(words.length / 2));

  return (
    <main>
      <InternalPageHero
        plain
        eyebrow="Index"
        titlePrimary={words.slice(0, mid).join(" ") || content.title}
        titleSecondary={words.length > 1 ? words.slice(mid).join(" ") : undefined}
      />
      <LinkDirectory title={content.title} sections={content.sections} showTitle={false} />
    </main>
  );
}
