import type { FaqItem } from "@/lib/wordpress/digital-marketing";
import type { IndustryId } from "./types";

/**
 * FAQs for the industry pages that have no WordPress FAQ (Bretton's audit, Nov 2026).
 * Each set answers what that industry's buyers ask; answers describe how Kosick works
 * and stay away from prices, timelines or outcomes that would need confirming.
 */
export const INDUSTRY_FAQS: Partial<Record<IndustryId, FaqItem[]>> = {
  retail: [
    {
      question: "Should a retail brand start with outdoor or digital advertising?",
      answer:
        "It depends on where your customers decide. Billboards and transit near your stores build the familiarity that makes people choose you, and digital and social campaigns turn that familiarity into visits and online sales. Most retail plans use both, weighted to your locations, season and budget.",
    },
    {
      question: "Can you help with packaging and in-store branding as well as advertising?",
      answer:
        "Yes. Our branding and creative team develops identity, packaging and point-of-sale design, so the product on the shelf matches the campaign people saw on the street and in their feed.",
    },
    {
      question: "How do you measure whether retail advertising is working?",
      answer:
        "We set the measures with you before launch. Online, that means tracked sales, store-locator visits and conversions by campaign. For outdoor and broadcast, we look at changes in branded search, site traffic and store activity in the markets where the campaign runs.",
    },
    {
      question: "Do you work with fashion and apparel brands?",
      answer:
        "Yes. Retail and fashion share the same challenge: winning attention before the purchase. We plan creative, placements and social content around launches, seasons and drops.",
    },
  ],
  "specialty-retail": [
    {
      question: "We are an independent store. Can marketing help us compete with big-box retailers?",
      answer:
        "Yes, by leading with what big-box stores can’t offer: expertise, curated products and personal service. We build your website, social media and local advertising around that difference, so customers have a reason to come to you.",
    },
    {
      question: "Do we need an online store, or just a website?",
      answer:
        "That depends on what you sell and how your customers buy. Some specialty retailers need full e-commerce; others do better with a website that showcases products, shares expertise and drives store visits. We recommend the right fit after looking at your products and margins.",
    },
    {
      question: "Is radio still worth it for a local retailer?",
      answer:
        "Radio reaches shoppers on the drive to work and the weekend errand run, which suits stores that depend on a local trading area. We choose stations and times that match your customers and pair the spots with social and search, so interest has somewhere to go.",
    },
    {
      question: "Can you manage our social media day to day?",
      answer:
        "Yes. Our social media management covers planning, product photography and video, posting and community management, with regular reporting on what is working.",
    },
  ],
  "medical-aesthetics": [
    {
      question: "How do you market aesthetic treatments responsibly?",
      answer:
        "We keep claims accurate and explain treatments in plain language, so prospective clients understand what to expect. Your clinic reviews all copy and creative before anything goes live, and we work within the advertising rules that apply to your treatments and platforms.",
    },
    {
      question: "Can one website handle both treatment bookings and product sales?",
      answer:
        "Yes. We build clinic websites where treatment pages lead to booking and skincare products can be bought online, all within one brand system, so the two sides of the business support each other.",
    },
    {
      question: "Which channels work best for a medical aesthetics clinic?",
      answer:
        "Most clinics grow through a mix: Google Ads and SEO for people already searching for a treatment, social media and content to build familiarity, and, where it fits, video, TV or billboard advertising to raise the clinic’s profile in its local market.",
    },
    {
      question: "Do you create the photography and video for our clinic?",
      answer:
        "Yes. Our in-house team plans and produces clinic, treatment and product photography and video, so your website, social media and ads share one consistent look.",
    },
  ],
  travel: [
    {
      question: "What kinds of travel businesses do you work with?",
      answer:
        "Cruise lines, resorts, destinations, tour operators and travel agencies. Each sells something different, but all need to reach travellers early in their planning and turn interest into booking inquiries.",
    },
    {
      question: "How does TV advertising help a travel brand?",
      answer:
        "Travel is visual and emotional, which suits the big screen. Broadcast, sponsorship and streaming TV put a destination or sailing in front of a wide, qualified audience, and digital follow-up captures the people who want to learn more.",
    },
    {
      question: "How do you turn interest into bookings?",
      answer:
        "With lead generation built for travel: landing pages and inquiry forms that make it easy to ask, brochure and offer sign-ups, and email follow-up that keeps the conversation going until the traveller is ready to book with your team.",
    },
    {
      question: "Can you plan campaigns around booking seasons?",
      answer:
        "Yes. We plan the media calendar around when your customers research and when they book, so spend is concentrated where it can create the most opportunities for your sales and reservations team.",
    },
  ],
  construction: [
    {
      question: "How long does it take for construction marketing to bring in projects?",
      answer:
        "Construction clients research for weeks or months before they call, so marketing builds over time. A clear website and consistent project content start working early, and the pipeline grows as your portfolio and search visibility build.",
    },
    {
      question: "What should a builder’s or contractor’s website include?",
      answer:
        "A portfolio of finished projects, clear descriptions of the work you take on, service areas, credentials, and inquiry forms that capture the project type and budget range, so your team can follow up with the right people first.",
    },
    {
      question: "Is social media worth it for a construction company?",
      answer:
        "Yes, when it shows the work. Progress photos, finished projects and the people behind them build trust with homeowners and developers, and keep your company in mind for the next project.",
    },
    {
      question: "Can you write content for our website and articles?",
      answer:
        "Yes. Our content development covers project write-ups, service pages and articles that answer the questions clients ask before the first meeting, written to help your website show up in search.",
    },
  ],
};

/** The Marketing Programs index: how the industry programs work, not one industry. */
export const MARKETING_PROGRAMS_FAQS: FaqItem[] = [
  {
    question: "What is an industry marketing program?",
    answer:
      "A coordinated plan built for one industry, combining the strategy, creative, media and digital work that sector needs. Each program draws on what we have learned working with businesses in that field.",
  },
  {
    question: "Can we use only part of a program?",
    answer:
      "Yes. Some clients start with one service, such as a new website or a TV campaign, and add more as results come in. We recommend a starting point based on your goals and budget.",
  },
  {
    question: "Our industry is not listed. Can you still help?",
    answer:
      "Yes. The programs shown are where we have the most experience, but the same approach applies to other industries. Tell us about your business and we will recommend a mix that fits.",
  },
  {
    question: "Do you work with businesses outside British Columbia?",
    answer:
      "Yes. We work with clients across Canada and in the United States, with offices in Vancouver and Calgary.",
  },
];

/** FAQPage structured data for a set of on-page questions. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
