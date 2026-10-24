import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { SectionLead } from "@/components/sections/SectionLead";
import { getServicesContent } from "@/lib/wordpress/services";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/");
}

function splitHeroTitle(title: string): { titlePrimary: string; titleSecondary?: string } {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { titlePrimary: title.trim() };
  const mid = Math.ceil(words.length / 2);
  return {
    titlePrimary: words.slice(0, mid).join(" "),
    titleSecondary: words.slice(mid).join(" "),
  };
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^[\s\S]{24,}?\.(?:\s|$)/);
  return (match?.[0] || trimmed).trim();
}

export default async function ServicesPage() {
  const content = await getServicesContent();
  const headline = splitHeroTitle(
    content.hero.title.replace(/SERVICEs/g, "Services"),
  );
  const actions = serviceHeroActions();

  return (
    <main>
      <InternalPageHero
        eyebrow="Services"
        titlePrimary={headline.titlePrimary}
        titleSecondary={headline.titleSecondary}
        description={content.intro.body ? firstSentence(content.intro.body) : undefined}
        backgroundImage={content.hero.backgroundImage}
        primaryCTA={actions.cta}
        secondaryCTA={actions.secondaryCta}
      />
      <SectionLead title={content.intro.title} body={content.intro.body} />
      {content.categories.map((category) => (
        <FeatureSplit key={category.title} feature={category} />
      ))}
    </main>
  );
}
