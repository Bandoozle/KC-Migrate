import { HeroBanner, type HeroBannerSlide } from "@/components/sections/HeroBanner";
import { HeroCarousel } from "@/components/sections/digital-marketing/HeroCarousel";

type ServiceHeroData = {
  slides: HeroBannerSlide[];
  eyebrow?: string;
  displayTitle?: string;
  titleSecondary?: string;
  subtitle?: string;
  cta?: { label: string; href: string } | null;
  secondaryCta?: { label: string; href: string; icon?: "phone" } | null;
};

/**
 * Shared marketing hero. Service copy switches on the split headline;
 * pages without that copy keep the simple image carousel.
 */
export function ServiceHero({ title, hero }: { title: string; hero: ServiceHeroData }) {
  if (!hero.titleSecondary) {
    return <HeroCarousel slides={hero.slides} title={title} />;
  }

  return (
    <HeroBanner
      variant="service"
      slides={hero.slides}
      title={hero.displayTitle || title}
      titleSecondary={hero.titleSecondary}
      eyebrow={hero.eyebrow}
      subtitle={hero.subtitle}
      cta={hero.cta}
      secondaryCta={hero.secondaryCta}
    />
  );
}
