import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { getFeatureArticlesContent } from "@/lib/wordpress/feature-articles";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/feature-articles/");
}

export default async function FeatureArticlesPage() {
  const content = await getFeatureArticlesContent();
  const actions = serviceHeroActions();

  return (
    <main>
      <InternalPageHero
        plain
        eyebrow="Resources"
        titlePrimary="Feature"
        titleSecondary="Articles"
        description="Insights, strategies, and practical marketing guidance to help your business grow."
        primaryCTA={actions.cta}
        secondaryCTA={actions.secondaryCta}
      />
      <ResourceLibrary articles={content.articles} />
    </main>
  );
}
