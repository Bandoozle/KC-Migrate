/**
 * Industry marketing pages and their service subpages. One file per industry
 * holds the copy; `index.ts` is the registry the routes, navigation, sitemap
 * and Site Map read from, so a service card can never point at a missing page.
 */

export type IndustryId =
  | "hvac"
  | "medical-dental"
  | "golf"
  | "specialty-retail"
  | "retail"
  | "construction"
  | "travel";

export type IndustryImage = {
  src: string;
  alt: string;
  /** CSS object-position when the subject is off-centre. */
  position?: string;
};

export type TitledText = { title: string; body: string };

export type TextLink = { label: string; href: string };

export type IndustryService = {
  /** URL segment under the industry path. */
  slug: string;
  title: string;
  /** One or two sentences for the card on the industry page. */
  summary: string;
  seo: { title: string; description: string };
  hero: {
    /** Short phrase above the headline, sentence case. */
    label: string;
    title: string;
    lead: string;
    image: IndustryImage;
  };
  /** What the service is for this industry. */
  intro: { title: string; paragraphs: string[] };
  /** The subpage's own "What We Offer": informative cards, not links. */
  offers: TitledText[];
  deliverables: string[];
  benefits: TitledText[];
  /** Short, concrete situations the service is used in. */
  applications: string[];
  approach: TitledText[];
  /** Supporting photography shown together on the page. */
  gallery: IndustryImage[];
  /** Kosick's general service pages and articles on the same subject. */
  related: TextLink[];
  /** Card photograph on the industry page when it should differ from the hero. */
  card?: IndustryImage;
};

/** Main page copy for industries without an existing WordPress page. */
export type IndustryLanding = {
  seo: { title: string; description: string };
  hero: { label: string; title: string; lead: string; image: IndustryImage };
  intro: { title: string; paragraphs: string[] };
  /** Why the industry works differently, and how Kosick plans for it. */
  reasonsTitle: string;
  reasons: Array<TitledText & { image?: IndustryImage }>;
  /** Optional: the moments the intro names, each shown with a photograph (Retail). */
  moments?: Array<{ caption: string; image: IndustryImage }>;
  gallery: IndustryImage[];
};

export type Industry = {
  id: IndustryId;
  /** Navigation and heading name, e.g. "Medical & Dental Marketing". */
  name: string;
  /** Used in running copy, e.g. "medical and dental". */
  noun: string;
  path: string;
  /** Card on the Services and Marketing Programs directories; every industry gets the same treatment. */
  directory: { line: string; image: IndustryImage };
  /** Header for the industry page's "What We Offer" section. */
  offersIntro: { label: string; title: string; lead: string };
  services: IndustryService[];
  cta: { title: string; description: string };
  landing?: IndustryLanding;
};
