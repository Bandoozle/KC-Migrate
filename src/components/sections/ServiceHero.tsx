import { InternalPageHero } from "@/components/sections/InternalPageHero";
import type { HeroBannerSlide } from "@/components/sections/HeroBanner";
import { serviceHeroActions } from "@/lib/content/industry-heroes";

type ServiceHeroData = {
  slides: HeroBannerSlide[];
  eyebrow?: string;
  displayTitle?: string;
  titleSecondary?: string;
  subtitle?: string;
  cta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string; icon?: "phone" } | null;
};

function splitFallbackTitle(title: string): { primary: string; secondary?: string } {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { primary: title.trim() };
  return { primary: words[0], secondary: words.slice(1).join(" ") };
}

/**
 * Service pages use the shared internal hero. Pages that already carry a
 * split headline keep that copy; others fall back to the page title.
 */
export function ServiceHero({
  title,
  hero,
  backgroundPosition,
  backgroundPositionMobile,
}: {
  title: string;
  hero: ServiceHeroData;
  backgroundPosition?: string;
  backgroundPositionMobile?: string;
}) {
  const fallback = splitFallbackTitle(hero.displayTitle || title);
  const titlePrimary = hero.titleSecondary ? hero.displayTitle || title : fallback.primary;
  const titleSecondary = hero.titleSecondary || fallback.secondary;
  const defaults = serviceHeroActions();

  return (
    <InternalPageHero
      eyebrow={hero.eyebrow}
      titlePrimary={titlePrimary}
      titleSecondary={titleSecondary}
      description={hero.subtitle}
      slides={hero.slides}
      primaryCTA={hero.cta === undefined ? defaults.cta : hero.cta}
      secondaryCTA={hero.secondaryCta === undefined ? defaults.secondaryCta : hero.secondaryCta}
      backgroundPosition={backgroundPosition}
      backgroundPositionMobile={backgroundPositionMobile}
    />
  );
}
