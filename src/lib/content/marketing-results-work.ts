import type { MarketingResultProject } from "@/lib/wordpress/marketing-results";

export type MarketingSolutionId = "brand" | "digital" | "web" | "creative" | "traditional";

export type MarketingResultWork = {
  id: string;
  /** Title as published, with only obvious letter-casing corrected. */
  displayTitle: string;
  href: string | null;
  image: { src: string; alt: string };
  solutions: MarketingSolutionId[];
  /** What the existing page actually says this work covers. */
  summary: string;
  /** Services named in the existing description. Empty when none are. */
  services: string[];
  /** Visible or verified deliverable. Not a fabricated outcome. */
  deliverable: string;
  outcome: string | null;
  /** How the photograph should be packed in the collection. */
  crop: "landscape" | "portrait";
  imagePosition: string;
};

export const MARKETING_SOLUTIONS: Array<{
  id: MarketingSolutionId;
  label: string;
  short: string;
}> = [
  { id: "brand", label: "Brand Strategy & Identity", short: "Brand Strategy" },
  { id: "digital", label: "Digital Marketing & Advertising", short: "Digital Marketing" },
  { id: "web", label: "Website Development", short: "Websites" },
  { id: "creative", label: "Creative & Production", short: "Creative" },
  { id: "traditional", label: "Traditional Advertising", short: "Traditional" },
];

const FEATURED_IDS = ["real-estate-developments", "hvac-services", "medical-aesthetics"];

const BROWSE_ORDER = [
  "residential-construction",
  "logistics-transportation",
  "fashion",
  "home-services",
  "luxury-automotive",
  "wealth-management",
  "hearth",
  "diamond-jewelry",
  "petroleum",
  "auction-liquidation",
];

type WorkCopy = Omit<MarketingResultWork, "id" | "href" | "image">;

const WORK_COPY: Record<string, WorkCopy> = {
  "real estate developments": {
    displayTitle: "Real Estate Developments",
    solutions: ["brand", "digital"],
    summary:
      "Targeted advertising, branding, and digital strategy for real estate developments.",
    services: ["Targeted advertising", "Branding", "Digital strategy"],
    deliverable: "Architectural photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "62% 40%",
  },
  "residential construction": {
    displayTitle: "Residential Construction",
    solutions: ["brand", "web", "digital"],
    summary: "Branding, web design, SEO, and advertising for residential construction.",
    services: ["Branding", "Web design", "SEO", "Advertising"],
    deliverable: "Construction photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center 42%",
  },
  "hvac services": {
    displayTitle: "HVAC Services",
    solutions: ["digital", "web"],
    summary:
      "Lead generation, Google Ads, SEO, and custom websites for heating and cooling companies.",
    services: ["Lead generation", "Google Ads", "SEO", "Custom websites"],
    deliverable: "HVAC photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center 42%",
  },
  "medical aesthetics": {
    displayTitle: "Medical Aesthetics",
    solutions: ["digital", "brand"],
    summary: "Social media, SEO, Google Ads, and branding for medical aesthetics clinics.",
    services: ["Social media", "SEO", "Google Ads", "Branding"],
    deliverable: "Clinic product photography published with this entry.",
    outcome: null,
    crop: "portrait",
    imagePosition: "center 55%",
  },
  "diamond jewelry": {
    displayTitle: "Diamond & Jewelry",
    solutions: ["brand", "creative", "digital"],
    summary: "Brand storytelling, visual creative, and targeted media for luxury jewelry.",
    services: ["Brand storytelling", "Visual creative", "Targeted media"],
    deliverable: "Product photography published with this entry.",
    outcome: null,
    crop: "portrait",
    imagePosition: "32% 48%",
  },
  "logistics transportation": {
    displayTitle: "Logistics & Transportation",
    solutions: ["brand", "web", "digital"],
    summary: "Branding, web development, SEO, and advertising for logistics and transportation.",
    services: ["Branding", "Web development", "SEO", "Advertising"],
    deliverable: "Fleet photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "42% 58%",
  },
  fashion: {
    // Shown as Retail: Fashion Marketing was renamed Retail Marketing across the site
    displayTitle: "Retail",
    solutions: ["brand", "creative", "digital", "web"],
    summary:
      "Branding, social media, influencer campaigns, and e-commerce. The photograph shows packaging.",
    services: ["Branding", "Social media", "Influencer campaigns", "E-commerce"],
    deliverable: "Packaging photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "68% 48%",
  },
  "home services": {
    displayTitle: "Home Services",
    solutions: ["digital"],
    summary: "SEO, Google Ads, social media, and local advertising for home services.",
    services: ["SEO", "Google Ads", "Social media", "Local advertising"],
    deliverable: "Installation photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center",
  },
  "luxury automotive": {
    displayTitle: "Luxury Automotive",
    solutions: ["digital", "brand"],
    summary:
      "Digital advertising, SEO, social media, and branding. The image is a screenshot from this collection.",
    services: ["Digital advertising", "SEO", "Social media", "Branding"],
    deliverable: "Screenshot published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center",
  },
  "wealth management": {
    displayTitle: "Wealth Management",
    solutions: [],
    summary:
      "A photograph filed under wealth management. The original wording describes financial planning, not a marketing deliverable.",
    services: [],
    deliverable: "Photograph filed with the wealth management entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center",
  },
  "auction liquidation": {
    displayTitle: "Auction & Liquidation",
    solutions: ["digital", "traditional"],
    summary:
      "Digital ads, email, and signage for auctions and liquidations. The image is a stock photograph, not a client shoot.",
    services: ["Digital ads", "Email", "Signage"],
    deliverable: "Stock photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center",
  },
  hearth: {
    displayTitle: "Hearth",
    solutions: ["digital", "brand", "creative"],
    summary:
      "Targeted ads, SEO, and showroom branding for fireplaces, stoves, and inserts.",
    services: ["Targeted ads", "SEO", "Showroom branding"],
    deliverable: "Hearth photography published with this entry.",
    outcome: null,
    crop: "landscape",
    imagePosition: "center",
  },
  petroleum: {
    displayTitle: "Petroleum",
    solutions: ["brand", "digital", "traditional"],
    summary:
      "Brand visibility, B2B outreach, and digital and traditional media. No client name is documented.",
    services: ["Brand visibility", "B2B outreach", "Digital media", "Traditional media"],
    deliverable: "Fuel-equipment photography published with this entry.",
    outcome: null,
    crop: "portrait",
    imagePosition: "center",
  },
};

function workKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function workId(title: string): string {
  return workKey(title).replace(/\s+/g, "-");
}

export function solutionLabel(item: MarketingResultWork): string {
  const match = MARKETING_SOLUTIONS.find((solution) => solution.id === item.solutions[0]);
  return match?.short || "Selected work";
}

export function classifyMarketingResults(projects: MarketingResultProject[]): MarketingResultWork[] {
  return projects.map((project) => {
    const copy = WORK_COPY[workKey(project.title)];
    if (!copy) {
      return {
        id: workId(project.title),
        displayTitle: project.title,
        href: project.href,
        image: project.image,
        solutions: [],
        summary: project.image.alt || "Selected work published on the marketing results page.",
        services: [],
        deliverable: "Photograph and title published on the marketing results page.",
        outcome: null,
        crop: "landscape" as const,
        imagePosition: "center",
      };
    }
    return {
      ...copy,
      id: workId(copy.displayTitle),
      href: project.href,
      image: project.image,
    };
  });
}

export function splitMarketingResults(work: MarketingResultWork[]): {
  featured: MarketingResultWork[];
  collection: MarketingResultWork[];
} {
  const featured = FEATURED_IDS.map((id) => work.find((item) => item.id === id)).filter(
    (item): item is MarketingResultWork => Boolean(item),
  );
  const chosen = featured.length > 0 ? featured : work.slice(0, 3);
  const chosenIds = new Set(chosen.map((item) => item.id));
  const rank = new Map(BROWSE_ORDER.map((id, index) => [id, index]));
  const collection = work
    .filter((item) => !chosenIds.has(item.id))
    .sort((a, b) => (rank.get(a.id) ?? 100) - (rank.get(b.id) ?? 100));
  return { featured: chosen, collection };
}

export type WorkFrame = "wide" | "narrow";

/** Wide card, then narrow card, repeating. A final odd card stays in the wide column. */
export function arrangeMarketingResults(
  items: MarketingResultWork[],
): Array<{ item: MarketingResultWork; frame: WorkFrame }> {
  return items.map((item, index) => ({
    item,
    frame: index % 2 === 0 ? "wide" : "narrow",
  }));
}
