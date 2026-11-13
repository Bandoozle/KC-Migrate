/**
 * Google Ads Management (/services/google-ads-management/), added from Bretton's audit (Nov 2026).
 * Original Kosick copy. No pricing, awards, case results or partner status is claimed.
 * Every ad, store and landing page shown is an illustration with a fictional business
 * (Northridge Heating & Cooling); the photography is Kosick's own HVAC library.
 * AI Overviews wording stays qualified: ad formats there are still rolling out.
 */
import type { FaqItem } from "@/lib/wordpress/digital-marketing";

export const GOOGLE_ADS_PATH = "/services/google-ads-management/";

export const GOOGLE_ADS_SEO = {
  title: "Google Ads Management | Kosick Communications",
  description:
    "Google Ads management for Canadian businesses: Search, Display, Shopping, YouTube and Performance Max campaigns planned, tracked and improved by Kosick.",
};

const IMG = "/images/google-ads";

export const GOOGLE_ADS_HERO = {
  displayTitle: "Strategic",
  title: "Google Ads Management",
  lead: "Show up at the moment people search for what you sell. We plan, build and manage Google Ads that turn searches into calls, inquiries and sales, and show you what every dollar of your investment returned.",
  primary: { label: "Book a Google Ads review", href: "/contact/" },
  secondary: { label: "604.925.5800", href: "tel:+16049255800" },
  formats: ["Search", "Display", "Shopping", "YouTube", "Performance Max"],
};

/** The fictional advertiser used in every illustration on the page. */
export const SAMPLE_AD = {
  query: "furnace installer vancouver",
  business: "Northridge Heating & Cooling",
  domain: "northridgeheating.ca",
  headline: "Furnace Installation in Vancouver | Free In-Home Estimates",
  description: "Licensed technicians, upfront quotes and same-week installs. Ask about current rebates.",
  sitelinks: ["Book an estimate", "Rebates", "Financing", "Service areas"],
  pageTitle: "Warm all winter. Installed this week.",
  pageImage: { src: `${IMG}/ductless-living-room.jpg`, alt: "A bright living room with a ductless heat pump mounted high on the wall" },
  inquiry: "New estimate request · North Vancouver",
};

export const HERO_PHOTO = {
  src: "/wp-content/uploads/2026/06/digital-marketing-services-1.jpg",
  alt: "A hand holding a phone with a search for furnace installers in Vancouver",
};

export const WHY_GOOGLE_ADS = {
  title: "The customers are already searching. The question is who they find.",
  lead: "Google Ads puts your business in front of people looking for what you sell, watching related videos or comparing products. Management is the work that makes that spend productive: where you appear, what the ad says, where it leads and what happens next.",
  points: [
    { title: "High purchase intent", body: "Someone typing “furnace installer” has a problem to solve this week, not someday." },
    { title: "Spend you control", body: "Budgets, locations and schedules are yours to set, and change as results come in." },
    { title: "Results you can trace", body: "Calls, forms and sales tied back to the campaign and search that produced them." },
  ],
  photo: {
    src: "/images/google-ads/product-heat-pump.jpg",
    alt: "A cold-climate heat pump on a stand beside a modern home, both fan vents fully visible",
  },
};

export const CAMPAIGN_TYPES = [
  {
    id: "search",
    name: "Search",
    line: "Text ads on search results",
    title: "Answer the search with your offer.",
    body: "Ads that appear above the results when someone searches for what you do, with your location, your offer and a clear next step. The core of most lead-generation accounts.",
    bestFor: "Service businesses, clinics and professional services.",
    manage: ["Keyword research and match types", "Ad copy and assets", "Negative keywords", "Bids and budgets"],
  },
  {
    id: "display",
    name: "Display",
    line: "Image ads across websites",
    title: "Stay in view while they research.",
    body: "Visual ads on the news, lifestyle and how-to sites your customers read, used to build awareness and to bring back people who visited but did not call.",
    bestFor: "Remarketing and considered purchases with a long decision.",
    manage: ["Audience and placement selection", "Responsive display creative", "Frequency and exclusions", "Remarketing lists"],
  },
  {
    id: "shopping",
    name: "Shopping",
    line: "Product listings with price",
    title: "Show the product before the click.",
    body: "Product ads drawn from your catalogue, with the photo, price and store visible right in the results.",
    bestFor: "Retailers with an online catalogue and a Merchant Center account.",
    manage: ["Merchant Center and feed health", "Product titles and attributes", "Product groups and bids", "Promotions"],
  },
  {
    id: "video",
    name: "YouTube",
    line: "Video ads before and during videos",
    title: "Tell the story with sound and motion.",
    body: "Short video ads before or during videos people chose to watch, targeted by audience, topic or the channels they follow.",
    bestFor: "Brands with video creative, and anyone also running TV or Connected TV.",
    manage: ["Format and length planning", "Audience and topic targeting", "View and engagement reporting", "Creative testing"],
  },
  {
    id: "pmax",
    name: "Performance Max",
    line: "One campaign, every Google channel",
    title: "One set of goals, every Google surface.",
    body: "Google’s automated campaign type places your ads across Search, YouTube, Display, Gmail, Maps and Discover from one set of goals, budgets and creative assets.",
    bestFor: "Accounts with reliable conversion tracking and enough data to learn from.",
    manage: ["Asset groups and creative", "Audience signals", "Conversion goals", "Search term and placement review"],
  },
] as const;

/** Fictional listings for the Shopping illustration; photos are Kosick's HVAC library. */
export const SHOPPING_PRODUCTS = [
  { title: "Ductless mini-split heat pump, 12,000 BTU", price: "$2,349", store: "Coastline Comfort Supply", image: `${IMG}/product-ductless-head.jpg` },
  { title: "Cold-climate air-source heat pump", price: "$6,890", store: "Northridge Heating", image: `${IMG}/product-heat-pump.jpg` },
  { title: "High-efficiency central air conditioner", price: "$3,475", store: "Harbour HVAC Outlet", image: `${IMG}/product-ac-unit.jpg` },
  { title: "Central air condenser, 2.5 ton", price: "$2,990", store: "Westside Home Systems", image: `${IMG}/product-condenser.jpg` },
] as const;

export const TARGETING = {
  title: "Find the searches worth paying for.",
  lead: "Good targeting is mostly about what to leave out. We research the words your customers use, sort them by intent, and set where and when your ads can run.",
  workspace: {
    title: "Campaign targeting",
    subtitle: "HVAC · Metro Vancouver · Search",
    geo: {
      title: "Locations",
      summary: "Serve ads where you can do the work. Include the cities you cover; leave out areas that drain budget.",
      radiusLabel: "Service radius · 25 km",
      included: [
        { id: "vancouver", name: "Vancouver", detail: "Downtown · Kitsilano · East Van" },
        { id: "burnaby", name: "Burnaby", detail: "Metrotown · Brentwood" },
        { id: "north-van", name: "North Vancouver", detail: "Lower Lonsdale · Capilano" },
      ],
      excluded: [{ id: "abbotsford", name: "Abbotsford", detail: "Outside service area" }],
    },
    intent: {
      title: "Search terms",
      groups: [
        {
          id: "ready" as const,
          label: "High purchase intent",
          blurb: "People ready to book an install or repair. These searches usually deserve the strongest bids.",
          terms: ["furnace installer near me", "same day furnace repair", "furnace replacement quote", "emergency furnace repair vancouver"],
        },
        {
          id: "compare" as const,
          label: "Comparison searches",
          blurb: "Shoppers weighing options. Useful for consideration, with tighter messaging and often lower bids.",
          terms: ["best furnace brands 2026", "heat pump vs furnace cost", "furnace install cost vancouver"],
        },
        {
          id: "research" as const,
          label: "Early research",
          blurb: "Problem-aware searches. Keep light coverage, or send them to helpful content instead of a hard sell.",
          terms: ["why is my furnace blowing cold air", "furnace making loud noise", "how long do furnaces last"],
        },
        {
          id: "excluded" as const,
          label: "Excluded keywords",
          blurb: "Searches that look related but waste spend: jobs, DIY, and free advice with no install intent.",
          terms: ["furnace repair jobs", "diy furnace repair", "furnace repair salary", "how to fix furnace yourself"],
        },
      ],
    },
    audiences: ["Past visitors and customer lists", "In-market for home heating", "Custom segments from customer search language"],
  },
};

export const MEASUREMENT = {
  title: "Every click followed through to the sale.",
  lead: "Tracking is set up before launch, so reporting shows cost per lead and return, not just clicks.",
  steps: [
    { name: "Click", detail: "Ad, keyword and search term recorded" },
    { name: "Visit", detail: "What people do on the page, in Google Analytics 4" },
    { name: "Inquiry", detail: "Calls, forms and bookings counted as conversions" },
    { name: "Sale", detail: "Qualified leads and sales imported back, where your systems allow" },
  ],
  photos: {
    visit: { src: "/wp-content/uploads/2025/10/website-development.jpg", alt: "A business website open on a laptop on a wooden desk" },
    sale: { src: "/wp-content/uploads/2026/03/hvac-marketing-strategies.jpg", alt: "A heat pump installed beside a modern home" },
  },
};

export const MANAGEMENT = {
  title: "Improved every week, reported every month.",
  lead: "We watch the account like a dashboard, not a set-and-forget campaign: what people searched, what it cost, and where the budget should go next.",
  rhythm: [
    {
      label: "Search terms",
      what: "Weekly reviews of what people typed, with negatives added and bids shifted toward the words that lead to calls.",
      tone: "blue" as const,
      keep: ["furnace installer near me", "furnace replacement quote"],
      drop: ["diy furnace repair"],
    },
    {
      label: "Performance",
      what: "A plain-language monthly report: spend, leads, cost per conversion and the changes that come next.",
      tone: "green" as const,
      stats: [
        { label: "Spend", value: "$4,820" },
        { label: "Leads", value: "48" },
        { label: "Cost / lead", value: "$100" },
      ],
    },
    {
      label: "Budget",
      what: "Spend moved toward the campaigns, places and hours that bring leads at the cost you want.",
      tone: "yellow" as const,
      split: [
        { label: "Search", share: 58 },
        { label: "Display", share: 24 },
        { label: "YouTube", share: 18 },
      ],
    },
  ],
};

export const AI_SEARCH = {
  title: "Search is changing. The fundamentals still decide who shows up.",
  body: "Google now answers many searches with AI Overviews and is testing AI Mode. It has begun showing Search and Shopping ads within and around these experiences in some markets, and the formats are still evolving. Which ads appear is decided by Google’s systems; what you control is the quality of the signals they use.",
  practice: ["Landing pages that answer the questions behind a search", "Accurate product feeds for retailers", "Enough creative variety to match more contexts", "Conversion data that shows what a good customer looks like"],
  note: "Ads in AI Overviews and AI Mode vary by country and language. We confirm what is available in your market before recommending it.",
};

export const GOOGLE_ADS_PROCESS = [
  { name: "Plan", body: "Goals, budget, markets and the conversions that matter, starting with an audit of any existing account." },
  { name: "Build", body: "Campaigns, keywords, ads, landing page recommendations and tracking, reviewed with you before launch." },
  { name: "Launch", body: "Live with careful budgets while we confirm tracking and the first search terms." },
  { name: "Improve", body: "Weekly optimization and a monthly review of results, spend and next steps." },
];

export const GOOGLE_ADS_FAQS: FaqItem[] = [
  {
    question: "How much should we spend on Google Ads?",
    answer:
      "It depends on how competitive your searches are, the areas you serve and how many leads you need. We look at expected costs per click in your market and your sales goals, then recommend a starting budget that can produce enough data to learn from. You set the budget, and it can change month to month.",
  },
  {
    question: "How quickly will we see results?",
    answer:
      "Search campaigns can start bringing in clicks and leads as soon as they launch. Most accounts improve over the first few months as we remove wasted searches, refine bids and test ads, and automated bidding needs conversion data before it performs well.",
  },
  {
    question: "Do we own our Google Ads account?",
    answer:
      "Yes. The account and its data belong to you. We manage it with your permission, and you keep full access whether or not we continue working together.",
  },
  {
    question: "Can you take over an existing Google Ads account?",
    answer:
      "Yes. We start with an audit of the structure, tracking, search terms and spend, keep what is working and fix what is not, so performance is not reset to zero.",
  },
  {
    question: "Which campaign types will we need?",
    answer:
      "Most lead-generation businesses start with Search. Retailers usually add Shopping or Performance Max, and brands with video creative add YouTube. We recommend the mix based on your goals and budget rather than running every type at once.",
  },
  {
    question: "How do you track calls and leads?",
    answer:
      "We set up conversion tracking for calls from ads and your website, form submissions and bookings, using Google Ads and Google Analytics 4. Where your systems allow, we also bring qualified leads or sales back into Google Ads so bidding can favour the customers you actually want.",
  },
  {
    question: "Will our ads appear in Google’s AI Overviews?",
    answer:
      "Possibly. Google has started showing ads within and around AI Overviews in some markets, and the formats are still changing. Placement is decided by Google’s systems, so the practical work is strong landing pages, product feeds, creative assets and conversion data.",
  },
  {
    question: "How does Google Ads work with our other marketing?",
    answer:
      "Search captures demand that TV, radio, outdoor and social campaigns create. We look at branded search and website traffic alongside those campaigns, so each channel is judged on the role it plays.",
  },
];

export const GOOGLE_ADS_CTA = {
  title: "Let’s look at your Google Ads.",
  description:
    "Tell us about your goals, your markets and any account you already run. We will show you where the opportunities are and what we would change first.",
  primary: { label: "Book a Google Ads review", href: "/contact/" },
  phone: { label: "604.925.5800", href: "tel:+16049255800" },
};
