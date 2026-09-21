export type NavLink = {
  label: string;
  href: string;
};

export type NavGroup = {
  title: string;
  items: NavLink[];
};

/** Direct top-level link (no dropdown). */
export type NavLinkItem = {
  type: "link";
  label: string;
  href: string;
};

/** Compact dropdown (single column of links). */
export type NavMenuItem = {
  type: "menu";
  label: string;
  items: NavLink[];
  /**
   * Hub / “view all” link.
   * Desktop: rendered above items. Mobile: rendered below items.
   */
  viewAll?: NavLink;
};

/** Wide grouped mega menu. */
export type NavMegaItem = {
  type: "mega";
  label: string;
  groups: NavGroup[];
  footer?: NavLink;
};

export type NavItem = NavLinkItem | NavMenuItem | NavMegaItem;

export const SITE_HEADER_LOGO = {
  src: "https://staging.kosick.com/wp-content/uploads/2024/02/cropped-Kosick-Communications.png",
  alt: "Kosick Communications",
  width: 794,
  height: 220,
} as const;

export const SITE_HEADER_PHONE = {
  label: "(604) 925-5800",
  href: "tel:+16049255800",
} as const;

export const SITE_HEADER_CTA = {
  label: "GET IN TOUCH",
  href: "/contact/",
} as const;

export const SITE_HEADER_MOBILE_CTA = {
  label: "CONTACT US",
  href: "/contact/",
} as const;

/** Mobile drawer intro links (logo still goes home; this helps when the drawer covers it). */
export const SITE_HEADER_MOBILE_LINKS = [
  { label: "Home | Communications", href: "/" },
] as const;

export const SITE_HEADER_SOCIAL = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/KosickCommunications",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kosick_communications/",
  },
] as const;

/** Primary navigation — grouped mega-menu IA. */
export const SITE_HEADER_NAV: NavItem[] = [
  {
    type: "mega",
    label: "Services",
    groups: [
      {
        title: "Advertising & Media",
        items: [
          { label: "Television Advertising", href: "/services/television-advertising/" },
          { label: "Radio Advertising", href: "/services/radio-advertising/" },
          { label: "Outdoor Advertising", href: "/services/outdoor-advertising/" },
          { label: "Digital Video Advertising", href: "/services/digital-connected-tv/" },
        ],
      },
      {
        title: "Digital Marketing",
        items: [
          { label: "Digital Marketing", href: "/services/digital-marketing/" },
          { label: "Social Media Marketing", href: "/services/social-media-marketing/" },
          { label: "Email Marketing", href: "/services/email-marketing/" },
          { label: "Search Engine Optimization", href: "/services/search-engine-optimization/" },
          { label: "Website Development & E-Commerce", href: "/services/website-development/" },
        ],
      },
      {
        title: "Brand & Creative",
        items: [
          { label: "Strategic Corporate Branding", href: "/services/corporate-branding/" },
          { label: "Creative & Production", href: "/services/creative/" },
          { label: "Business Development", href: "/services/business-development/" },
        ],
      },
      {
        title: "Events",
        items: [{ label: "Corporate Events", href: "/corporate-events/" }],
      },
    ],
    footer: { label: "View All Services", href: "/services/" },
  },
  {
    type: "menu",
    label: "Marketing Programs",
    viewAll: {
      label: "View All Marketing Programs",
      href: "/marketing-programs/",
    },
    items: [
      { label: "HVAC Marketing", href: "/services/hvac-marketing/" },
      { label: "Dental Marketing", href: "/services/dental-marketing/" },
      { label: "Golf Marketing", href: "/services/golf-marketing/" },
    ],
  },
  {
    type: "menu",
    label: "Resources",
    items: [
      { label: "Feature Articles", href: "/feature-articles/" },
      {
        label: "HVAC Lead Generation",
        href: "/services/hvac-marketing/hvac-lead-generation/",
      },
      {
        label: "Canadian Billboard Dimensions",
        href: "/services/outdoor-advertising/billboard-dimensions/",
      },
    ],
  },
  {
    type: "link",
    label: "Results",
    href: "/marketing-results/",
  },
];
