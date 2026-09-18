import type { SmartSliderSlide } from "@/lib/wordpress/shared";

export type ResourceGuideCta = {
  label: string;
  href: string;
};

export type ResourceGuideSection = {
  title: string;
  /** Spec line such as “Typical size: 10′ × 20′”. */
  spec?: string;
  body: string;
  image?: { src: string; alt: string } | null;
  cta?: ResourceGuideCta | null;
};

export type ResourceGuideContent = {
  title: string;
  excerpt: string;
  hero: {
    title: string;
    subtitle?: string;
    slides: SmartSliderSlide[];
  };
  intro: {
    body: string;
    cta?: ResourceGuideCta | null;
  } | null;
  sections: ResourceGuideSection[];
};
