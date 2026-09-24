import { MARKETING_PROGRAM_ASSETS } from "@/lib/assets/marketing-programs";

export type MarketingProgram = {
  title: string;
  description: string;
  href: string;
  image: { src: string; alt: string; position?: string };
};

export type MarketingProgramGroup = {
  id: string;
  title: string;
  eyebrow: string;
  lead: string;
  programs: MarketingProgram[];
};

export const MARKETING_PROGRAMS_INTRO = {
  eyebrow: "Marketing Programs",
  title: "Marketing Programs Built Around How Your Business Grows",
  description:
    "Kosick combines strategy, media, creative, digital, and industry expertise into focused marketing programs designed around real business goals.",
  cta: { label: "Talk to our team", href: "/contact/" },
} as const;

/**
 * Destinations listed under Marketing Programs in the site header.
 * Copy is taken from each program page's existing description.
 */
export const MARKETING_PROGRAM_GROUPS: MarketingProgramGroup[] = [
  {
    id: "industry",
    title: "Industry Marketing",
    eyebrow: "Industry",
    lead: "Programs built for HVAC, dental, and golf businesses.",
    programs: [
      {
        title: "HVAC Marketing",
        description:
          "Comprehensive, omni-channel marketing programs tailored to the HVAC industry, from Google Ads and Local Service Ads to television, radio, and outdoor billboards.",
        href: "/services/hvac-marketing/",
        image: MARKETING_PROGRAM_ASSETS.hvac,
      },
      {
        title: "Dental Marketing",
        description:
          "Kosick Communications helps dental practices build stronger brands, attract new patients, and stay connected with their communities through integrated digital, traditional, and web marketing strategies.",
        href: "/services/dental-marketing/",
        image: MARKETING_PROGRAM_ASSETS.dental,
      },
      {
        title: "Golf Marketing",
        description:
          "From memberships and tournaments to events, dining, and course promotion, Kosick Communications helps golf clubs build visibility, attract the right audience, and create consistent marketing across every channel.",
        href: "/services/golf-marketing/",
        image: MARKETING_PROGRAM_ASSETS.golf,
      },
    ],
  },
  {
    id: "digital",
    title: "Digital Marketing",
    eyebrow: "Digital",
    lead: "Programs built for social, email, search, and the website.",
    programs: [
      {
        title: "Social Media Marketing",
        description:
          "Build a stronger social presence with content, paid campaigns, and platform strategy designed to keep your brand visible, relevant, and connected with the right audience.",
        href: "/services/social-media-marketing/",
        image: MARKETING_PROGRAM_ASSETS.social,
      },
      {
        title: "Email Marketing",
        description:
          "Turn customer data into meaningful communication with email campaigns, automation, and lifecycle strategies designed to nurture leads, strengthen relationships, and drive repeat business.",
        href: "/services/email-marketing/",
        image: MARKETING_PROGRAM_ASSETS.email,
      },
      {
        title: "Search Engine Optimization",
        description:
          "Improve visibility across search with technical SEO, content strategy, local optimization, and ongoing improvements that help the right customers find your business.",
        href: "/services/search-engine-optimization/",
        image: MARKETING_PROGRAM_ASSETS.seo,
      },
      {
        title: "Website Development & E-Commerce",
        description:
          "Build fast, flexible websites and e-commerce experiences that support your brand, improve the customer journey, and turn traffic into measurable business results.",
        href: "/services/website-development/",
        image: MARKETING_PROGRAM_ASSETS.website,
      },
    ],
  },
];

export const MARKETING_PROGRAMS_WHY = {
  title: "More Than a Campaign. A Complete Marketing Partner.",
  points: [
    {
      title: "Strategy",
      body: "Turn clear direction into smarter marketing decisions.",
    },
    {
      title: "Creative",
      body: "Build a brand people recognize, remember, and trust.",
    },
    {
      title: "Media",
      body: "Combine traditional advertising with modern digital marketing.",
    },
    {
      title: "Digital",
      body: "Reach the right audience and drive measurable growth.",
    },
  ],
} as const;

export const MARKETING_PROGRAMS_HERO_VISUALS = [
  MARKETING_PROGRAM_ASSETS.hvac,
  MARKETING_PROGRAM_ASSETS.dental,
  MARKETING_PROGRAM_ASSETS.golf,
] as const;

export const MARKETING_PROGRAMS_CTA = {
  title: "Not sure which program fits?",
  description: "Tell us what you're trying to grow, and we'll help build the right mix.",
  primary: { label: "Let's Talk", href: "/contact/" },
} as const;
