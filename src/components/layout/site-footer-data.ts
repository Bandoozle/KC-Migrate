export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterSocialLink = {
  label: string;
  href: string;
};

export const SITE_FOOTER_BRAND = {
  name: "Kosick",
  blurb:
    "Full-service marketing agency transforming brands through strategic creativity.",
} as const;

/** Matches Kadence element 11279 social block. */
export const SITE_FOOTER_SOCIAL: FooterSocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/kosick_communications/",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/KosickCommunications",
  },
];

/**
 * Services column — labels from the WordPress footer.
 * Hrefs map labels to the correct native routes (WP footer had several mismatched destinations).
 */
export const SITE_FOOTER_SERVICES: FooterColumn = {
  title: "Services",
  links: [
    { label: "Digital Advertising", href: "/services/digital-marketing/" },
    { label: "Media Buying", href: "/services/digital-marketing/" },
    { label: "Creative Production", href: "/services/creative/" },
    { label: "Events Management", href: "/corporate-events/" },
    { label: "Outdoor Advertising", href: "/services/outdoor-advertising/" },
    { label: "Branding", href: "/services/corporate-branding/" },
    { label: "Website Development", href: "/services/website-development/" },
    { label: "Social Media Marketing", href: "/services/social-media-marketing/" },
    { label: "Business Development", href: "/services/business-development/" },
  ],
};

/** Company column from WordPress footer. */
export const SITE_FOOTER_COMPANY: FooterColumn = {
  title: "Company",
  links: [
    { label: "Our Company", href: "/" },
    { label: "Our Work", href: "/services/" },
    { label: "Contact", href: "/contact/" },
  ],
};

/** Utility links kept out of the header, shown in the bottom bar. */
export const SITE_FOOTER_UTILITY: FooterLink[] = [
  { label: "Pay your invoice online", href: "/online-payments/" },
  { label: "Site map", href: "/site-map/" },
];

export const SITE_FOOTER_NEWSLETTER = {
  title: "Stay updated",
  description: "Get the latest insights and trends delivered to your inbox",
  placeholder: "Your Email",
  submitLabel: "Join",
  /** Kadence advanced form 11281 (newsletter). */
  postId: "11281",
  formId: "11281-cpt-id",
} as const;

export const SITE_FOOTER_COPYRIGHT = {
  prefix: "©",
  owner: "Kosick Communications. All rights reserved.",
} as const;
