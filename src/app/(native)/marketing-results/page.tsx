import type { Metadata } from "next";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { OverlayCardGrid } from "@/components/sections/OverlayCardGrid";
import { PageCta } from "@/components/sections/PageCta";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getMarketingResultsContent } from "@/lib/wordpress/marketing-results";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("marketing-results");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Marketing Results | Kosick Communications",
  };
}

export default async function MarketingResultsPage() {
  const content = await getMarketingResultsContent();

  return (
    <main>
      <HeroBanner
        slides={content.hero.slides}
        title={content.hero.title}
        eyebrow={content.hero.eyebrow}
        subtitle={content.hero.subtitle}
        cta={content.hero.cta}
      />
      <OverlayCardGrid cards={content.industries} />
      <PageCta cta={content.cta} />
    </main>
  );
}
