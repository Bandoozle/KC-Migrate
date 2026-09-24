import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import type { ServicePageContent, ServiceSummarySection } from "@/lib/wordpress/service-page-types";

const WHY_IT_WORKS: ServiceSummarySection = {
  eyebrow: "Why It Works",
  title: "A multi-channel approach built to generate HVAC leads",
  body: "Kosick combines digital advertising, traditional media, local market visibility, and conversion-focused follow-up to help HVAC companies reach homeowners at multiple stages of the buying journey.",
  cards: [
    {
      title: "Digital Demand",
      body: "Paid search, social campaigns, landing pages, and local SEO help capture high-intent homeowners actively searching for HVAC services.",
    },
    {
      title: "Local Visibility",
      body: "Outdoor, traditional media, and local-market campaigns build awareness and keep HVAC brands visible in the communities they serve.",
    },
    {
      title: "Conversion & Follow-Up",
      body: "Lead capture, calls, forms, retargeting, and automated follow-up help turn interest into booked appointments.",
    },
  ],
};

const FEATURE_COPY: Array<{
  match: RegExp;
  eyebrow: string;
  title: string;
  body: string;
}> = [
  {
    match: /digital/i,
    eyebrow: "Digital Advertising",
    title: "Search engine marketing that captures high-intent demand",
    body: "Search engine marketing, paid social, display ads, and geo-targeted landing pages help HVAC companies reach homeowners actively looking for heating, cooling, and indoor air quality solutions. Seasonal campaigns, emergency service, rebates, and financing can sit in that same program so interest becomes a booked call.",
  },
  {
    match: /outdoor/i,
    eyebrow: "Outdoor Advertising",
    title: "Stay visible in the markets you serve",
    body: "Billboards, transit placements, and other out-of-home media reinforce brand presence across high-traffic local areas and support digital campaigns with repeated visibility.",
  },
  {
    match: /local/i,
    eyebrow: "Local Opportunities",
    title: "Every market is different",
    body: "HVAC demand varies by region, season, neighbourhood, and service mix. Campaigns should reflect the realities of each local market rather than relying on one generic approach.",
  },
];

const APPROACH_NARRATIVE = {
  eyebrow: "Why the approach works",
  title: "Connected marketing creates better HVAC leads",
  intro:
    "Too many HVAC companies invest in isolated tactics that generate activity without building a consistent path to conversion. The strongest campaigns connect digital demand generation with brand visibility, local market presence, and follow-up.",
  cards: [
    {
      label: "Demand Capture",
      title: "Capture high-intent homeowners",
      body: "Paid search, social campaigns, local SEO, and targeted landing pages help HVAC companies reach homeowners who are actively searching for heating, cooling, and indoor air quality solutions.",
    },
    {
      label: "Brand Visibility",
      title: "Stay visible across the local market",
      body: "Outdoor, traditional, and awareness-building campaigns reinforce trust and recognition so your company remains familiar when homeowners are ready to act.",
    },
    {
      label: "Follow-Up & Conversion",
      title: "Turn interest into booked service calls",
      body: "Clear calls to action, lead handling, retargeting, and automated follow-up help move prospects from initial interest to real appointments.",
    },
  ],
  statement:
    "Stronger HVAC lead generation happens when demand capture, visibility, and follow-up work together.",
  columns: [
    {
      title: "Why a tailored approach matters",
      body: "A Google Ads campaign can bring traffic, but without brand reinforcement through channels like TV, outdoor, social, and local visibility, those leads can lose momentum. At the same time, awareness campaigns are more effective when they connect to a clear digital path that lets interested homeowners take action.",
    },
    {
      title: "What that approach delivers",
      body: "A coordinated multi-channel strategy helps create stronger brand recognition, more consistent lead flow, and a healthier sales pipeline by keeping the business visible throughout the customer journey.",
    },
  ],
};

function isClosingEssay(feature: FeatureSplitData) {
  return /tailored approach|results speak/i.test(`${feature.eyebrow || ""} ${feature.title}`);
}

function featureCopy(feature: FeatureSplitData) {
  const hay = `${feature.eyebrow || ""} ${feature.title}`;
  return FEATURE_COPY.find((item) => item.match.test(hay));
}

/**
 * Presentation copy and layout for HVAC Lead Generation.
 * Images stay from WordPress. The empty "Why It Works" banner and the
 * paragraph-as-heading channel blocks are replaced with shared section data.
 */
export function applyHvacLeadGenerationLayout(
  content: ServicePageContent,
): ServicePageContent {
  let imageCount = 0;

  const features = content.features.filter((feature) => !isClosingEssay(feature)).map((feature) => {
    const copy = featureCopy(feature);
    const next: FeatureSplitData = copy
      ? {
          ...feature,
          eyebrow: copy.eyebrow,
          title: copy.title,
          body: copy.body,
          image: feature.image
            ? { src: feature.image.src, alt: copy.title }
            : feature.image,
        }
      : {
          ...feature,
          body: feature.body?.replace(/\bTHVAC\b/g, "HVAC"),
        };

    if (next.image?.src) {
      next.mediaPosition = imageCount % 2 === 0 ? "right" : "left";
      next.motion = "reveal";
      imageCount += 1;
    }

    if (/local opportunities/i.test(next.eyebrow || "")) {
      next.cta = {
        label: "Connect With Us",
        href: content.cta?.primary?.href || "/contact/",
      };
    }

    return next;
  });

  return {
    ...content,
    summary: WHY_IT_WORKS,
    narrative: APPROACH_NARRATIVE,
    linkBanner: null,
    leadSection: null,
    leadSections: [],
    features,
    partnerLogos: content.partnerLogos
      ? {
          ...content.partnerLogos,
          title: "Leading HVAC brands trust Kosick",
          description:
            "Experience working alongside established manufacturers and dealer networks across North America.",
          variant: "trust",
        }
      : content.partnerLogos,
  };
}
