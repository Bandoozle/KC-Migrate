import type { ServicePageContent } from "@/lib/wordpress/service-page-types";

export type IndustryServiceHeroCopy = {
  eyebrow: string;
  displayTitle?: string;
  titleSecondary: string;
  subtitle?: string;
};

/** Page-specific service hero copy. Slides stay on the parsed page. */
export const INDUSTRY_SERVICE_HEROES = {
  dental: {
    eyebrow: "Digital • Traditional • Patient Growth • Web",
    displayTitle: "Strategic",
    titleSecondary: "Dental Marketing",
    subtitle:
      "Kosick Communications helps dental practices build stronger brands, attract new patients, and stay connected with their communities through integrated digital, traditional, and web marketing strategies.",
  },
  golf: {
    eyebrow: "Digital • Traditional • Membership • Events",
    displayTitle: "Strategic",
    titleSecondary: "Golf Marketing",
    subtitle:
      "From memberships and tournaments to events, dining, and course promotion, Kosick Communications helps golf clubs build visibility, attract the right audience, and create consistent marketing across every channel.",
  },
  programs: {
    eyebrow: "Digital • Traditional • Co-op Programs • Web",
    displayTitle: "Strategic",
    titleSecondary: "Marketing Programs",
    subtitle:
      "Kosick Communications builds integrated marketing programs that combine digital, traditional, co-op, and web strategies to help businesses strengthen their brand, reach the right audience, and generate consistent growth.",
  },
  leadGeneration: {
    eyebrow: "Digital • Local SEO • Paid Media • Automation",
    displayTitle: "Strategic",
    titleSecondary: "HVAC Lead Generation",
    subtitle:
      "We connect HVAC companies with homeowners actively searching for heating, cooling, and indoor air quality solutions using paid search, social ads, local SEO, and automated follow-up designed to turn interest into booked service calls.",
  },
  digital: {
    eyebrow: "Digital • Campaigns • Paid Media • Strategy",
    displayTitle: "Strategic",
    titleSecondary: "Digital Marketing",
    subtitle:
      "Plan and run digital campaigns with strategy, creative, and ongoing optimization designed to grow visibility, generate demand, and support measurable business results.",
  },
  social: {
    eyebrow: "Digital • Content • Paid Social • Community",
    displayTitle: "Strategic",
    titleSecondary: "Social Media Marketing",
    subtitle:
      "Build a stronger social presence with content, paid campaigns, and platform strategy designed to keep your brand visible, relevant, and connected with the right audience.",
  },
  email: {
    eyebrow: "Digital • Automation • Retention • Leads",
    displayTitle: "Strategic",
    titleSecondary: "Email Marketing",
    subtitle:
      "Turn customer data into meaningful communication with email campaigns, automation, and lifecycle strategies designed to nurture leads, strengthen relationships, and drive repeat business.",
  },
  seo: {
    eyebrow: "Search • Content • Local SEO • Technical",
    displayTitle: "Strategic",
    titleSecondary: "Search Engine Optimization",
    subtitle:
      "Improve visibility across search with technical SEO, content strategy, local optimization, and ongoing improvements that help the right customers find your business.",
  },
  website: {
    eyebrow: "Web • UX • Development • E-Commerce",
    displayTitle: "Strategic",
    titleSecondary: "Website Development\n& E-Commerce",
    subtitle:
      "Build fast, flexible websites and e-commerce experiences that support your brand, improve the customer journey, and turn traffic into measurable business results.",
  },
} as const satisfies Record<string, IndustryServiceHeroCopy>;

export function serviceHeroActions(contactHref = "/contact/", talkHref = "tel:+16049255800") {
  return {
    cta: { label: "Start a Project", href: contactHref },
    secondaryCta: { label: "Let's Talk", href: talkHref, icon: "phone" as const },
  };
}

/**
 * Apply the HVAC-style service hero fields without replacing background media.
 */
export function applyIndustryServiceHero(
  content: {
    hero: ServicePageContent["hero"];
    cta?: {
      primary?: { href: string } | null;
      phone?: { href: string } | null;
    } | null;
  },
  copy: IndustryServiceHeroCopy,
): ServicePageContent["hero"] {
  const contactHref = content.cta?.primary?.href || content.hero.cta?.href || "/contact/";
  const talkHref = content.cta?.phone?.href || "tel:+16049255800";

  return {
    ...content.hero,
    eyebrow: copy.eyebrow,
    displayTitle: copy.displayTitle || "Strategic",
    titleSecondary: copy.titleSecondary,
    subtitle: copy.subtitle,
    ...serviceHeroActions(contactHref, talkHref),
  };
}
