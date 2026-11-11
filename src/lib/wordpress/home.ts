import { cache } from "react";

export type HomeBentoItem = {
  titlePrimary: string;
  titleSecondary?: string;
  description: string;
  href: string;
  image: string;
  alt: string;
};

export type HomeCapabilityIcon =
  | "strategy"
  | "web"
  | "ai"
  | "crm"
  | "marketing"
  | "seo"
  | "analytics"
  | "automation";

export type HomeCapability = {
  label: string;
  icon: HomeCapabilityIcon;
};

export type HomeBrandTab = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
};

export type HomeTestimonial = {
  name: string;
  affiliation?: string;
  rating: 5;
  quote: string;
};

export type HomeMetric = {
  end: number;
  suffix: string;
  label: string;
  duration: number;
};

export type HomeWhyTile = {
  line1: string;
  line2: string;
};

export type HomeHeroRotation = {
  word: string;
  subtitle: string;
};

export type HomePageContent = {
  hero: {
    title: string;
    subtitle: string;
    /** Rotating “THE ART OF …” words with matching subtext. */
    rotations: HomeHeroRotation[];
    ctaLabel: string;
    ctaHref: string;
    /** Self-hosted background loop (fast-start MP4) and the frame shown until it plays. */
    video: { src: string; poster: string };
  };
  whatWeDoIntro: {
    title: string;
    description: string;
  };
  bento: HomeBentoItem[];
  brandTabsPreceding: {
    title: string;
    lead: string;
  };
  brandTabs: HomeBrandTab[];
  testimonials: {
    title: string;
    lead: string;
    items: HomeTestimonial[];
  };
  whyChoose: {
    title: string;
    lead: string;
    metrics: HomeMetric[];
    capabilitiesLead: string;
    capabilities: HomeCapability[];
    tiles: HomeWhyTile[];
  };
  quote: {
    text: string;
    photoSrc: string;
    photoAlt: string;
    name: string;
    role: string;
  };
  contact: {
    heading: string;
    lead: string;
    phone: { label: string; display: string; href: string };
    email: { label: string; display: string; href: string };
    location: { label: string; display: string };
    form: {
      postId: string;
      formId: string;
      fields: {
        name: string;
        email: string;
        phone: string;
        company: string;
        message: string;
      };
      submitLabel: string;
    };
  };
};

const BENTO_ITEMS: HomeBentoItem[] = [
  {
    titlePrimary: "Digital",
    titleSecondary: "Advertising",
    description:
      "Performance-driven campaigns across Google Ads, Social Media, YouTube, and more — putting your business in front of ready-to-buy customers.",
    href: "/services/digital-marketing/",
    image:
      "/wp-content/uploads/2026/06/social-media-content-marketing-1.jpg",
    alt: "Digital advertising analytics dashboard",
  },
  {
    titlePrimary: "Television",
    titleSecondary: "& Broadcast",
    description:
      "Premium broadcast and streaming placements delivering high visibility and consistent reach to large, trusted audiences.",
    href: "/services/television-advertising/",
    image: "/images/home/television-expedia-cruises-tv.jpg",
    alt: "An Expedia Cruises TV ad on a living-room television",
  },
  {
    titlePrimary: "Web",
    description:
      "Custom websites and e-commerce stores, designed and developed to perform on every device and easy for search engines to read.",
    href: "/services/website-development/",
    image: "/wp-content/uploads/2026/03/website-development-e-commerce.jpg",
    alt: "A storefront website open on a laptop",
  },
  {
    titlePrimary: "Out of",
    titleSecondary: "Home",
    description:
      "Billboards, transit shelters, bus wraps, and digital screens — reaching audiences as they commute, shop, and travel.",
    href: "/services/outdoor-advertising/",
    image:
      "/wp-content/uploads/2025/08/home-services-lead-generation-1.webp",
    alt: "A Belyea Bros. Trane heat pump billboard",
  },
  {
    titlePrimary: "Connected",
    titleSecondary: "TV",
    description:
      "Premium streaming apps and smart TVs — television impact with digital targeting across Crave, Sportsnet+, TSN+, and Tubi.",
    href: "/services/digital-connected-tv/",
    image: "/wp-content/uploads/2026/02/media-buying.jpg",
    alt: "A Formula 1 race on a wall-mounted TV in a living room",
  },
  {
    titlePrimary: "Corporate",
    titleSecondary: "Branding",
    description:
      "Strategically defined brands that generate human emotion, meaningful connections, and increased marketshare.",
    href: "/services/corporate-branding/",
    image: "/images/home/corporate-branding-van-kam.jpg",
    alt: "The Van-Kam Freightways logo on the side of a truck cab",
  },
];

const WHY_CHOOSE_CAPABILITIES: HomeCapability[] = [
  { label: "Brand Strategy", icon: "strategy" },
  { label: "Web Development", icon: "web" },
  { label: "AI Solutions", icon: "ai" },
  { label: "CRM Development", icon: "crm" },
  { label: "Digital Marketing", icon: "marketing" },
  { label: "SEO", icon: "seo" },
  { label: "Analytics", icon: "analytics" },
  { label: "Automation", icon: "automation" },
];

const HOME_CONTENT: HomePageContent = {
  hero: {
    title: "THE ART OF GROWTH",
    subtitle: "Connect strategy, creative, and execution to drive measurable growth.",
    rotations: [
      {
        word: "GROWTH",
        subtitle: "Connect strategy, creative, and execution to drive measurable growth.",
      },
      {
        word: "BRANDING",
        subtitle: "Build a brand people recognize, remember, and trust.",
      },
      {
        word: "VISIBILITY",
        subtitle: "Build awareness and demand across the channels that matter.",
      },
      {
        word: "DEMAND",
        subtitle: "Traditional and digital marketing working together to grow your business.",
      },
      {
        word: "MOMENTUM",
        subtitle: "From brand positioning to lead generation, we help businesses move forward.",
      },
    ],
    ctaLabel: "CONNECT WITH US",
    ctaHref: "/contact/",
    video: {
      src: "/videos/home/KC-Mov-3a.mp4",
      poster: "/images/home/hero-poster.webp",
    },
  },
  whatWeDoIntro: {
    title: "Marketing built to move brands forward.",
    description:
      "We help brands grow through strategy, creative, media, and digital experiences. With 40+ years of experience, Kosick combines traditional advertising with modern digital marketing to build visibility, reach the right audience, and drive measurable growth.",
  },
  bento: BENTO_ITEMS,
  brandTabsPreceding: {
    title: "Build a brand people remember",
    lead: "From strategy to consistency, create meaningful experiences across every touchpoint.",
  },
  brandTabs: [
    {
      id: "defineyourself",
      label: "Define Yourself",
      title: "Define Yourself",
      subtitle: "Build a brand people recognize, remember, and trust.",
      description:
        "Great brands start with a clear understanding of who they are and what they stand for. We help define your positioning, personality, messaging, and visual identity so every part of your brand feels intentional, memorable, and uniquely yours.",
      image: "/images/home/define-yourself-trane-logo.jpg",
      alt: "The Trane logo badge on a rain-beaded outdoor HVAC unit",
    },
    {
      id: "strategy",
      label: "Strategy",
      title: "Strategy",
      subtitle: "Turn clear direction into smarter marketing decisions.",
      description:
        "Strong marketing starts with a plan built around your goals, audience, and opportunities. We connect insight with action to create focused strategies that prioritize the right channels, messages, and initiatives for meaningful business growth.",
      image: "/images/home/strategy-masterplan-aerial.jpg",
      alt: "An aerial masterplan rendering of a beachfront resort community",
    },
    {
      id: "consistency",
      label: "Consistency",
      title: "Consistency",
      subtitle: "Create one recognizable brand across every touchpoint.",
      description:
        "Every interaction should feel like it comes from the same brand. From digital campaigns and social media to advertising, websites, and print, we help maintain a consistent voice and visual identity that builds familiarity and confidence over time.",
      image: "/images/home/consistency-westmount-van-wrap.jpg",
      alt: "The Westmount Electrical van wrap shown from every side",
    },
    {
      id: "connections",
      label: "Connections",
      title: "Connections",
      subtitle: "Create experiences that turn attention into relationships.",
      description:
        "Effective marketing is about more than being seen. We create meaningful connections between your brand and the people you want to reach, combining relevant messaging, thoughtful creative, and the right channels to encourage engagement and long-term loyalty.",
      image: "/images/home/connections-garden-centre-staff.jpg",
      alt: "A smiling Amsterdam Garden Centre team member among spring plants",
    },
  ],
  testimonials: {
    title: "Hear it from our clients",
    lead: "See how our work helps create real results.",
    items: [
      {
        name: "Brad Johnson",
        affiliation: "Heritage Mountain Heating & Cooling",
        rating: 5,
        quote:
          "The progress we've made since working with them speaks for itself. They don't feel like an outside marketing company—they feel like part of our team. I would highly recommend Kosick Communications to any business looking for honest, hardworking people who will take the time to understand your company and help it grow.",
      },
      {
        name: "LC Fitness Management",
        rating: 5,
        quote:
          "Their team understands marketing at a strategic level—not just running ads, but actually driving results that impact the bottom line. They helped us refine our messaging, improve our ad performance, and position our brand in a more professional and compelling way.",
      },
      {
        name: "Justin Giroux",
        rating: 5,
        quote:
          "Kosick has been very helpful with my marketing and website for my business. They are very friendly to deal with and have a great way of explaining all the complexities of SEO and web design to someone who is foreign to that whole world.",
      },
      {
        name: "Frances Johnson",
        rating: 5,
        quote:
          "They take the time to understand our business, explain the reasoning behind their recommendations, and genuinely care about helping us grow. Their communication is excellent, and we always leave our meetings feeling confident about the direction we're headed.",
      },
      {
        name: "SkinONE Innovations",
        rating: 5,
        quote:
          "The Kosick Communications team have been incredible to work with! They have strategically re branded our premium clinic, actively manage our social media accounts, develop news/media features, and deliver highly successful digital campaigns.",
      },
      {
        name: "Jack Tree",
        rating: 5,
        quote:
          "What an incredible team. Some of the nicest people to work with, seamless operators and unbelievable problem solvers. These guys are easy to work with and produce incredible results. We'll absolutely continue working with them!",
      },
    ],
  },
  whyChoose: {
    title: "Why Choose Kosick",
    lead: "We combine creativity with analytics to deliver campaigns that don't just look good they perform.",
    metrics: [
      { end: 150, suffix: "+", label: "Clients Served", duration: 2.5 },
      { end: 500, suffix: "+", label: "Campaigns Launched", duration: 2.5 },
      { end: 98, suffix: "%", label: "Client Retention", duration: 2.5 },
      { end: 10, suffix: "+", label: "Years Experience", duration: 2.5 },
    ],
    capabilitiesLead: "One partner. Every digital touchpoint:",
    capabilities: WHY_CHOOSE_CAPABILITIES,
    tiles: [
      { line1: "Data-driven", line2: "Strategy" },
      { line1: "Creative", line2: "Excellence" },
      { line1: "Transparent", line2: "Reporting" },
      { line1: "Dedicated", line2: "Support" },
      { line1: "Scalable", line2: "Solutions" },
      { line1: "Industry", line2: "Expertise" },
    ],
  },
  quote: {
    text: "Design must be functional, and functionality must be translated into visual aesthetics",
    photoSrc:
      "/wp-content/uploads/2026/09/gettyimages-515214352-copy.avif",
    photoAlt: "Ferdinand Porsche",
    name: "Ferdinand Porsche",
    role: "Austrian-German automotive engineer",
  },
  contact: {
    heading: "Let's Work Together",
    lead: "Ready to amplify your brand? Get in touch and let's discuss how we can help you achieve your goals.",
    phone: {
      label: "Call us",
      display: "+1 (604) 925-5800",
      href: "tel:16049255800",
    },
    email: {
      label: "Email us",
      display: "info@kosick.com",
      href: "mailto:info@kosick.com",
    },
    location: {
      label: "Locations",
      display: "Vancouver & Calgary",
    },
    form: {
      postId: "11283",
      formId: "11283-cpt-id",
      fields: {
        name: "field652327-6b",
        email: "field4d218f-d3",
        phone: "field7ef1b0-96",
        company: "field02e9e9-ef",
        message: "field34af12-76",
      },
      submitLabel: "Send Message",
    },
  },
};

/** Typed homepage content — parity constants from the live WP homepage / island data. */
export const getHomePageContent = cache(async (): Promise<HomePageContent> => HOME_CONTENT);
