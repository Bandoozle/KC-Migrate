import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { OverlayCardGrid } from "@/components/sections/OverlayCardGrid";
import { PageCta } from "@/components/sections/PageCta";
import { getMarketingResultsContent } from "@/lib/wordpress/marketing-results";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/marketing-results/");
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
