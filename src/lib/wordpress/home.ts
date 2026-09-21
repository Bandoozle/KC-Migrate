import { cache } from "react";
import { getWordPressUrl } from "@/lib/wordpress";

export type HomeBentoItem = {
  titlePrimary: string;
  titleSecondary: string;
  description: string;
  href: string;
  image: string;
  alt: string;
};

export type HomeSolutionItem = {
  title: string;
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

export type HomePageContent = {
  hero: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    vimeoSrc: string;
  };
  whatWeDoIntro: {
    title: string;
    description: string;
  };
  bento: HomeBentoItem[];
  solutions: {
    title: string;
    subtitle: string;
    items: HomeSolutionItem[];
  };
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
      ajaxUrl: string;
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
      "https://staging.kosick.com/wp-content/uploads/2026/06/social-media-content-marketing-1-640x960.jpg",
    alt: "Digital advertising analytics dashboard",
  },
  {
    titlePrimary: "Television",
    titleSecondary: "& Broadcast",
    description:
      "Premium broadcast and streaming placements delivering high visibility and consistent reach to large, trusted audiences.",
    href: "/services/television-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/06/tv-advertising-750x600.jpg",
    alt: "Television and broadcast advertising",
  },
  {
    titlePrimary: "Radio",
    titleSecondary: "& Streaming",
    description:
      "Scheduled ad spots and sponsorships across news, talk, and top music platforms on radio and audio streaming.",
    href: "/services/radio-advertising/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/radio-streaming-advertising-750x750.jpg",
    alt: "Radio and streaming advertising",
  },
  {
    titlePrimary: "Out of",
    titleSecondary: "Home",
    description:
      "Billboards, transit shelters, bus wraps, and digital screens — reaching audiences as they commute, shop, and travel.",
    href: "/services/outdoor-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/02/media-buying-750x499.jpg",
    alt: "Out of home advertising",
  },
  {
    titlePrimary: "Connected",
    titleSecondary: "TV",
    description:
      "Premium streaming apps and smart TVs — television impact with digital targeting across Crave, Sportsnet+, TSN+, and Tubi.",
    href: "/services/digital-connected-tv/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/connected-tv-streaming-750x563.jpg",
    alt: "Connected TV advertising",
  },
  {
    titlePrimary: "Corporate",
    titleSecondary: "Branding",
    description:
      "Strategically defined brands that generate human emotion, meaningful connections, and increased marketshare.",
    href: "/services/corporate-branding/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2025/08/home-services-lead-generation-1-750x750.webp",
    alt: "Corporate branding",
  },
];

const SOLUTION_ITEMS: HomeSolutionItem[] = [
  {
    title: "Digital Marketing + Social",
    description:
      "Performance campaigns across search, social, and YouTube that put your brand in front of ready-to-buy customers.",
    href: "/services/digital-marketing/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/social-media-content-marketing-1-640x960.jpg",
    alt: "Digital marketing and social media",
  },
  {
    title: "Targeted Media",
    description:
      "Precision media buying across TV, digital, and out-of-home to reach the audiences that matter most.",
    href: "/services/television-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/06/tv-advertising-750x600.jpg",
    alt: "Targeted media planning",
  },
  {
    title: "Branding",
    description:
      "Brand systems that create recognition, emotion, and lasting preference across every touchpoint.",
    href: "/services/corporate-branding/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2025/08/home-services-lead-generation-1-750x750.webp",
    alt: "Corporate branding",
  },
  {
    title: "Connected TV",
    description:
      "Streaming inventory with television impact and digital targeting across premium CTV platforms.",
    href: "/services/digital-connected-tv/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/connected-tv-streaming-750x563.jpg",
    alt: "Connected TV advertising",
  },
  {
    title: "Out of Home",
    description:
      "Billboards, transit, and digital screens that meet audiences where they commute, shop, and travel.",
    href: "/services/outdoor-advertising/",
    image: "https://staging.kosick.com/wp-content/uploads/2026/02/media-buying-750x499.jpg",
    alt: "Out of home advertising",
  },
  {
    title: "Radio & Streaming",
    description:
      "Audio spots and sponsorships across news, talk, and music platforms that keep your brand top of mind.",
    href: "/services/radio-advertising/",
    image:
      "https://staging.kosick.com/wp-content/uploads/2026/06/radio-streaming-advertising-750x750.jpg",
    alt: "Radio and streaming advertising",
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
    title: "THE ART OF MARKETING",
    subtitle: "Digital • Media • Branding • Business Development",
    ctaLabel: "CONNECT WITH US",
    ctaHref: "/contact/",
    vimeoSrc:
      "https://player.vimeo.com/video/911448655?autoplay=1&controls=0&mute=1&muted=1&loop=1&playlist=911448655&disablekb=1&modestbranding=1&playsinline=1&rel=0&background=1",
  },
  whatWeDoIntro: {
    title: "Marketing built to move brands forward.",
    description:
      "We help brands grow through strategy, creative, media, and digital experiences. With 40+ years of experience, Kosick combines traditional advertising with modern digital marketing to build visibility, reach the right audience, and drive measurable growth.",
  },
  bento: BENTO_ITEMS,
  solutions: {
    title: "Our bespoke solutions",
    subtitle:
      "Strategy, creative, and media working together — tailored solutions that build visibility and drive measurable growth.",
    items: SOLUTION_ITEMS,
  },
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
      image:
        "https://staging.kosick.com/wp-content/uploads/2025/08/digital-marketing-750x500.webp",
      alt: "Digital Marketing Vancouver",
    },
    {
      id: "strategy",
      label: "Strategy",
      title: "Strategy",
      subtitle: "Turn clear direction into smarter marketing decisions.",
      description:
        "Strong marketing starts with a plan built around your goals, audience, and opportunities. We connect insight with action to create focused strategies that prioritize the right channels, messages, and initiatives for meaningful business growth.",
      image:
        "https://staging.kosick.com/wp-content/uploads/2026/09/henderson-inclusive-strategy-edited-750x563.jpg",
      alt: "Brand strategy workshop",
    },
    {
      id: "consistency",
      label: "Consistency",
      title: "Consistency",
      subtitle: "Create one recognizable brand across every touchpoint.",
      description:
        "Every interaction should feel like it comes from the same brand. From digital campaigns and social media to advertising, websites, and print, we help maintain a consistent voice and visual identity that builds familiarity and confidence over time.",
      image:
        "https://staging.kosick.com/wp-content/uploads/2026/09/kc-branding-edited-750x562.jpg",
      alt: "Corporate event specialists organizing high-level meetings and brand activations to create memorable experiences for clients and stakeholders.",
    },
    {
      id: "connections",
      label: "Connections",
      title: "Connections",
      subtitle: "Create experiences that turn attention into relationships.",
      description:
        "Effective marketing is about more than being seen. We create meaningful connections between your brand and the people you want to reach, combining relevant messaging, thoughtful creative, and the right channels to encourage engagement and long-term loyalty.",
      image:
        "https://staging.kosick.com/wp-content/uploads/2026/03/digital-marketing-lead-generation-750x563.jpg",
      alt: "Lead Generation Vancouver HVAC Medical Electrical",
    },
  ],
  testimonials: {
    title: "Hear it from our customers",
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
        name: "Frances Johnson",
        rating: 5,
        quote:
          "They take the time to understand our business, explain the reasoning behind their recommendations, and genuinely care about helping us grow. Their communication is excellent, and we always leave our meetings feeling confident about the direction we're headed.",
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
      "https://staging.kosick.com/wp-content/uploads/2026/09/gettyimages-515214352-copy.avif",
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
      ajaxUrl: "",
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
export const getHomePageContent = cache(async (): Promise<HomePageContent> => {
  const origin = getWordPressUrl();
  return {
    ...HOME_CONTENT,
    contact: {
      ...HOME_CONTENT.contact,
      form: {
        ...HOME_CONTENT.contact.form,
        ajaxUrl: `${origin}/wp-admin/admin-ajax.php`,
      },
    },
  };
});
