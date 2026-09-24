import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import type { PageCtaData } from "@/components/sections/PageCta";
import type { SmartSliderSlide } from "@/lib/wordpress/shared";

export type ServiceMedia = {
  src: string;
  alt: string;
};

export type ServiceInfoCard = {
  /** Stable Kadence block id when available (e.g. kt-info-box12468_d47e3b-a8). */
  id?: string;
  title: string;
  body?: string;
  items?: string[];
  /** Inline SVG markup from Kadence info-box icons when extractable. */
  iconSvg?: string;
  /** Optional header image (e.g. mapped from overlay media). */
  image?: ServiceMedia | null;
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceRelated = {
  title: string;
  href: string | null;
  items: string[];
  /** Column background when present; always set by the service-page parser. */
  image: { src: string; alt: string } | null;
};

export type ServiceOfferGroup = {
  cards: ServiceInfoCard[];
};

export type ServicePackageSection = {
  title: string;
  cards: ServiceInfoCard[];
};

export type ServiceGallerySection = {
  title: string;
  body?: string;
  labels?: string[];
  images: ServiceMedia[];
};

export type ServicePartnerLogos = {
  title: string;
  description?: string;
  logos: ServiceMedia[];
  /** Card grid keeps visible names. Trust is a logo-only brand row. */
  variant?: "cards" | "trust";
};

export type ServiceMediaCard = {
  title: string;
  body?: string;
  image: ServiceMedia | null;
  /** Optional outbound or internal link for portfolio / case cards. */
  href?: string | null;
};

export type ServiceMediaCardSection = {
  title?: string;
  cards: ServiceMediaCard[];
};

export type ServiceOverlayCard = {
  title: string;
  href: string | null;
  image: ServiceMedia;
};

export type ServiceLeadSection = {
  title?: string;
  paragraphs: string[];
};

/** Intro plus supporting cards, rendered with InfoCardGrid. */
export type ServiceSummarySection = {
  eyebrow?: string;
  title: string;
  body?: string;
  cards: ServiceInfoCard[];
};

export type ServiceNarrativeCard = {
  label: string;
  title: string;
  body: string;
};

/** Centered intro, optional pillar cards, and two editorial columns. */
export type ServiceNarrativeSection = {
  eyebrow?: string;
  title: string;
  intro?: string;
  cards?: ServiceNarrativeCard[];
  statement?: string;
  columns: Array<{ title: string; body: string }>;
};

export type ServiceIntroAction = {
  label: string;
  href: string;
};

export type ServiceLinkBanner = {
  title: string;
  cta: { label: string; href: string };
};

export type ServiceProcessStep = {
  number: string;
  title: string;
  body?: string;
};

export type ServiceProcessSection = {
  eyebrow?: string;
  title?: string;
  steps: ServiceProcessStep[];
};

export type ServiceStatItem = {
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
};

export type ServiceStatsSection = {
  eyebrow?: string;
  title?: string;
  items: ServiceStatItem[];
};

export type ServiceVideoSection = {
  eyebrow?: string;
  title?: string;
  src: string;
};

export type ServiceMediaTab = {
  label: string;
  image: ServiceMedia;
  /** Optional panel copy. Platform tabs fall back to platform-media-tabs.ts. */
  title?: string;
  subtitle?: string;
  description?: string;
};

export type ServiceMediaTabsSection = {
  eyebrow?: string;
  title?: string;
  tabs: ServiceMediaTab[];
};

export type ServicePromoBand = {
  eyebrow?: string;
  title: string;
  body?: string;
  cta: { label: string; href: string } | null;
  /** Full-bleed background image behind the promo card. */
  backgroundImage?: string | null;
};

export type ServicePageContent = {
  title: string;
  excerpt: string;
  hero: {
    slides: SmartSliderSlide[];
    eyebrow?: string;
    /** First title line when the hero uses a split headline. */
    displayTitle?: string;
    /** Muted second title line (e.g. "HVAC Marketing"). */
    titleSecondary?: string;
    subtitle?: string;
    cta?: { label: string; href: string } | null;
    secondaryCta?: { label: string; href: string; icon?: "phone" } | null;
  };
  intro: {
    eyebrow: string;
    title: string;
    body?: string;
    actions?: ServiceIntroAction[];
  } | null;
  offerGroups: ServiceOfferGroup[];
  features: FeatureSplitData[];
  /** @deprecated Prefer packageSections — kept as the first package group. */
  packageSection: ServicePackageSection | null;
  packageSections: ServicePackageSection[];
  mediaCardSection: ServiceMediaCardSection | null;
  processSection: ServiceProcessSection | null;
  statsSection: ServiceStatsSection | null;
  videoSections: ServiceVideoSection[];
  mediaTabsSection: ServiceMediaTabsSection | null;
  gallerySection: ServiceGallerySection | null;
  partnerLogos: ServicePartnerLogos | null;
  overlayCards: ServiceOverlayCard[];
  /** @deprecated Prefer leadSections. */
  leadSection: ServiceLeadSection | null;
  leadSections: ServiceLeadSection[];
  /** Optional summary placed after partner logos. */
  summary: ServiceSummarySection | null;
  /** Optional two-column closer placed after feature splits. */
  narrative: ServiceNarrativeSection | null;
  linkBanner: ServiceLinkBanner | null;
  promoBand: ServicePromoBand | null;
  faqs: {
    eyebrow: string;
    title: string;
    items: ServiceFaqItem[];
  } | null;
  relatedServices: ServiceRelated[];
  cta: PageCtaData | null;
};
