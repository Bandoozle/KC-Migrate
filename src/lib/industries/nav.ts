/**
 * Industry names and paths for navigation. Kept apart from the page copy so the
 * header (a client component) doesn't ship it. `index.ts` checks this list
 * against the registry.
 */
export const INDUSTRY_LINKS = [
  { label: "HVAC Marketing", href: "/services/hvac-marketing/" },
  { label: "Medical & Dental Marketing", href: "/services/dental-marketing/" },
  { label: "Golf Marketing", href: "/services/golf-marketing/" },
  { label: "Retail Marketing", href: "/services/retail-marketing/" },
  { label: "Specialty Retail Marketing", href: "/services/specialty-retail-marketing/" },
  { label: "Construction Marketing", href: "/services/construction-marketing/" },
  { label: "Travel Marketing", href: "/services/travel-marketing/" },
] as const;
