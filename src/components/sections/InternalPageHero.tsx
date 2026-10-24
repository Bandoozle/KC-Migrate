import {
  HeroBanner,
  type HeroBannerSlide,
} from "@/components/sections/HeroBanner";

export type InternalPageCta = {
  label: string;
  href: string;
  icon?: "phone";
};

export type InternalPageHeroProps = {
  eyebrow?: string;
  titlePrimary: string;
  titleSecondary?: string;
  description?: string;
  backgroundImage?: string | null;
  backgroundPosition?: string;
  /** Cover position below 721px, when a portrait crop needs a different subject lock. */
  backgroundPositionMobile?: string;
  slides?: HeroBannerSlide[];
  primaryCTA?: InternalPageCta | null;
  secondaryCTA?: InternalPageCta | null;
  /** Utility pages: same type, alignment, and spacing without a photograph. */
  plain?: boolean;
};

/**
 * Shared hero for every internal page. Visual source of truth is the
 * Strategic Social Media Marketing service hero.
 */
export function InternalPageHero({
  eyebrow,
  titlePrimary,
  titleSecondary,
  description,
  backgroundImage,
  backgroundPosition,
  backgroundPositionMobile,
  slides,
  primaryCTA,
  secondaryCTA,
  plain = false,
}: InternalPageHeroProps) {
  const heading = [titlePrimary, titleSecondary].filter(Boolean).join(" ");
  const media: HeroBannerSlide[] =
    slides && slides.length > 0
      ? slides
      : backgroundImage
        ? [{ src: backgroundImage, alt: heading }]
        : [];

  return (
    <HeroBanner
      variant="service"
      plain={plain || media.length === 0}
      slides={media}
      title={titlePrimary}
      titleSecondary={titleSecondary}
      eyebrow={eyebrow}
      subtitle={description}
      cta={primaryCTA}
      secondaryCta={secondaryCTA}
      backgroundPosition={backgroundPosition}
      backgroundPositionMobile={backgroundPositionMobile}
    />
  );
}
