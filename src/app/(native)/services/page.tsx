import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { ServicesOverview } from "@/components/sections/services-overview/ServicesOverview";
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
      <ServicesOverview />
    </main>
  );
}
