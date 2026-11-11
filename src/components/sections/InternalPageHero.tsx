import { heroVideoPoster } from "@/lib/media/video-posters";
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
  /** With `plain`: short band for index pages such as the site map. */
  compact?: boolean;
  /** See HeroBanner. */
  cinematic?: boolean;
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
  compact = false,
  cinematic = false,
}: InternalPageHeroProps) {
  const heading = [titlePrimary, titleSecondary].filter(Boolean).join(" ");
  const media: HeroBannerSlide[] =
    slides && slides.length > 0
      ? slides
      : backgroundImage
        ? [{ src: backgroundImage, alt: heading }]
        : [];

  const first = media[0];
  const poster = first?.kind === "video" ? heroVideoPoster(first.src) : undefined;

  return (
    <>
      {/* The opening video's poster is the hero's first paint: React hoists this into <head> */}
      {poster ? <link rel="preload" as="image" href={poster} fetchPriority="high" /> : null}
      <HeroBanner
        variant="service"
        plain={plain || media.length === 0}
        compact={compact}
        cinematic={cinematic}
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
    </>
  );
}
