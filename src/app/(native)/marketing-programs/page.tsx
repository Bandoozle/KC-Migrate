import type { Metadata } from "next";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { PageCta } from "@/components/sections/PageCta";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getMarketingProgramsContent } from "@/lib/wordpress/marketing-programs";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("marketing-programs");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Marketing Programs | Kosick Communications",
  };
}

export default async function MarketingProgramsPage() {
  const content = await getMarketingProgramsContent();

  return (
    <main>
      <HeroBanner
        variant="service"
        slides={content.hero.slides}
        title={content.hero.displayTitle}
        titleSecondary={content.hero.titleSecondary}
        eyebrow={content.hero.eyebrow}
        subtitle={content.hero.subtitle}
        cta={content.hero.cta}
        secondaryCta={content.hero.secondaryCta}
      />
      {content.programs.map((program) => (
        <FeatureSplit key={program.title} feature={program} />
      ))}
      <PageCta cta={content.cta} />
    </main>
  );
}
