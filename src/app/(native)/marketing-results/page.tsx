import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { MarketingResultsPortfolio } from "@/components/sections/MarketingResultsPortfolio";
import { PageCta } from "@/components/sections/PageCta";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { classifyMarketingResults } from "@/lib/content/marketing-results-work";
import { getMarketingResultsContent } from "@/lib/wordpress/marketing-results";
import styles from "./page.module.css";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/marketing-results/");
}

export default async function MarketingResultsPage() {
  const content = await getMarketingResultsContent();
  const actions = serviceHeroActions();
  const heroTitle = content.hero.title || "Marketing Results";
  const [titlePrimary, ...rest] = heroTitle.split(/\s+/);
  const titleSecondary = rest.join(" ") || undefined;
  const work = classifyMarketingResults(content.projects);

  return (
    <main>
      <InternalPageHero
        eyebrow={content.hero.eyebrow || "Our Work"}
        titlePrimary={titlePrimary || "Marketing"}
        titleSecondary={titleSecondary}
        description={content.hero.subtitle || undefined}
        slides={content.hero.slides}
        primaryCTA={content.hero.cta || actions.cta}
        secondaryCTA={actions.secondaryCta}
      />
      <MarketingResultsPortfolio work={work} />
      <PageCta className={styles.closing} cta={content.cta} />
    </main>
  );
}
