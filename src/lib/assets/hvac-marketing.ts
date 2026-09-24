import { applyIndustryServiceHero } from "@/lib/content/industry-heroes";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";

/**
 * Explicit local visual assets for /services/hvac-marketing.
 * WordPress remains the source of truth for copy; these paths are design-critical imagery.
 */
export const HVAC_MARKETING_ASSETS = {
  heroVideo: "/images/hvac-marketing/hero-timeline.mp4",
  features: {
    leadGeneration: {
      src: "/images/hvac-marketing/feature-lead-generation.jpg",
      alt: "HVAC marketing and lead generation",
    },
    billboard: {
      src: "/images/hvac-marketing/feature-billboard.jpg",
      alt: "HVAC billboard and co-op advertising",
    },
    strategies: {
      src: "/images/hvac-marketing/feature-strategies.jpg",
      alt: "HVAC website and digital marketing strategies",
    },
  },
  tabs: {
    youtube: {
      src: "/images/hvac-marketing/tab-youtube.jpg",
      alt: "YouTube and connected TV HVAC advertising",
    },
    facebook: {
      src: "/images/hvac-marketing/tab-facebook.jpg",
      alt: "Facebook and Meta HVAC ads",
    },
    visual: {
      src: "/images/hvac-marketing/tab-tiktok.jpg",
      alt: "TikTok and visual HVAC marketing content",
    },
    social: {
      src: "/images/hvac-marketing/tab-instagram.jpg",
      alt: "Instagram HVAC social media marketing",
    },
  },
} as const;

function matchFeatureVisual(title: string, eyebrow?: string) {
  const hay = `${eyebrow || ""} ${title}`.toLowerCase();
  if (/lead generation|20\+\s*years|hvac expertise/i.test(hay)) {
    return {
      image: HVAC_MARKETING_ASSETS.features.leadGeneration,
      mediaPosition: "right" as const,
    };
  }
  if (/co-?op|maximize|seo domination|billboard/i.test(hay)) {
    return {
      image: HVAC_MARKETING_ASSETS.features.billboard,
      mediaPosition: "left" as const,
    };
  }
  if (/digital storefront|website development/i.test(hay)) {
    return {
      image: HVAC_MARKETING_ASSETS.features.strategies,
      mediaPosition: "right" as const,
    };
  }
  return null;
}

function hvacHeroEyebrow(content: ServicePageContent): string {
  const titles = [
    ...content.offerGroups.flatMap((group) => group.cards.map((card) => card.title)),
    ...content.packageSections.flatMap((section) => section.cards.map((card) => card.title)),
  ]
    .join(" ")
    .toLowerCase();

  const parts: string[] = [];
  if (/digital/.test(titles)) parts.push("Digital");
  if (/traditional/.test(titles)) parts.push("Traditional");
  if (/co-?op/.test(titles)) parts.push("Co-op Programs");
  if (/\bweb/.test(titles)) parts.push("Web");
  if (parts.length >= 3) return parts.join(" • ");
  return "Digital • Traditional • Co-op Programs • Web";
}

function hvacHeroLead(content: ServicePageContent): string | undefined {
  const fromCta = content.cta?.description?.trim();
  if (fromCta && fromCta.length > 40) return fromCta;

  const fromFeature = content.features.find((feature) =>
    /trane|20\+|years of/i.test(`${feature.title} ${feature.body || ""}`),
  )?.body;
  return fromFeature?.trim() || content.excerpt.trim() || undefined;
}

function matchTabImage(label: string) {
  const hay = label.toLowerCase();
  if (/youtube|connected\s*tv|ctv/i.test(hay)) return HVAC_MARKETING_ASSETS.tabs.youtube;
  if (/facebook|meta/i.test(hay)) return HVAC_MARKETING_ASSETS.tabs.facebook;
  if (/visual|tiktok/i.test(hay)) return HVAC_MARKETING_ASSETS.tabs.visual;
  if (/social|instagram/i.test(hay)) return HVAC_MARKETING_ASSETS.tabs.social;
  return null;
}

/**
 * Replace heuristic WP media URLs with explicit local assets for HVAC Marketing.
 * Copy, headings, and structure stay from WordPress.
 */
export function applyHvacMarketingLocalAssets(
  content: ServicePageContent,
): ServicePageContent {
  const hero = {
    ...applyIndustryServiceHero(content, {
      eyebrow: hvacHeroEyebrow(content),
      titleSecondary: content.title || "HVAC Marketing",
      subtitle: hvacHeroLead(content),
    }),
    slides: [
      {
        src: HVAC_MARKETING_ASSETS.heroVideo,
        alt: content.title || "HVAC Marketing",
        kind: "video" as const,
      },
    ],
  };

  const features = content.features.map((feature) => {
    const visual = matchFeatureVisual(feature.title, feature.eyebrow);
    if (!visual) return feature;
    return {
      ...feature,
      image: { src: visual.image.src, alt: visual.image.alt },
      mediaPosition: visual.mediaPosition,
    };
  });

  const mediaTabsSection = content.mediaTabsSection
    ? {
        ...content.mediaTabsSection,
        tabs: content.mediaTabsSection.tabs.map((tab) => {
          const image = matchTabImage(tab.label);
          if (!image) return tab;
          return {
            ...tab,
            image: { src: image.src, alt: image.alt },
          };
        }),
      }
    : null;

  return {
    ...content,
    hero,
    features,
    mediaTabsSection,
  };
}
