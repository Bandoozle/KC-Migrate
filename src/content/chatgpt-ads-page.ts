/**
 * ChatGPT Ads Management (/services/chatgpt-ads-management/), added from Bretton's audit (Nov 2026).
 *
 * Accuracy rules for this page:
 * - Facts about the product come from OpenAI's published help centre and announcements
 *   (checked November 2026): ads appear below answers for logged-in adult users on the Free
 *   and Go plans, are labelled as sponsored, run separately from the answers, and advertisers
 *   receive aggregated reporting only. Availability varies by country.
 * - Kosick is not described as an OpenAI partner, and direct campaign management is not
 *   claimed: the service is positioned as planning, readiness and testing support.
 * - No pricing, bid levels, benchmarks or launch dates are stated, because they change
 *   and third-party reports of them disagree.
 */
import type { FaqItem } from "@/lib/wordpress/digital-marketing";

export const CHATGPT_ADS_PATH = "/services/chatgpt-ads-management/";

export const CHATGPT_ADS_SEO = {
  title: "ChatGPT Ads Management | Kosick Communications",
  description:
    "Plan for advertising in ChatGPT: how sponsored placements work, when they fit, and how to prepare creative, landing pages and tracking.",
};

export const CHATGPT_ADS_HERO = {
  eyebrow: "Conversational advertising • Planning • Readiness",
  displayTitle: "Strategic",
  title: "ChatGPT Ads Management",
  lead: "People now research purchases by asking an AI assistant. We help you decide whether sponsored placements in ChatGPT fit your business, prepare the creative and landing pages they need, and plan how they work alongside Google Ads and the rest of your marketing.",
  primary: { label: "Book a planning session", href: "/contact/" },
  secondary: { label: "Call 604.925.5800", href: "tel:+16049255800" },
};

/** The fictional conversation in the hero illustration. */
export const CONVERSATION = {
  question: "What should I look for in a heat pump installer in Calgary?",
  answer: [
    "Check that they are licensed and carry insurance.",
    "Ask whether they size the system with a heat-loss calculation.",
    "Compare warranties, and ask about rebates you may qualify for.",
  ],
  sponsor: {
    name: "Northridge Heating & Cooling",
    domain: "northridgeheating.ca",
    line: "Heat pump installs across Calgary. Free in-home sizing and rebate guidance.",
    action: "Book a free assessment",
  },
  page: { title: "Heat pumps, sized for your home.", result: "Assessment booked" },
};

export const HOW_IT_WORKS = {
  label: "What ChatGPT advertising is",
  title: "Sponsored placements, kept apart from the answer.",
  lead: "OpenAI has introduced ads in ChatGPT. A relevant sponsored placement can appear below a response, clearly labelled, so a business can be present while someone is researching a decision.",
  facts: [
    {
      title: "Where ads appear",
      body: "Below ChatGPT’s response, marked as sponsored. People can hide an ad or report it.",
    },
    {
      title: "Who sees them",
      body: "OpenAI shows ads to adult users on its Free and Go plans. Plus, Pro, Business, Enterprise and Edu accounts are ad-free.",
    },
    {
      title: "Answers stay independent",
      body: "OpenAI states that ads run on separate systems and that advertisers cannot influence what ChatGPT says.",
    },
    {
      title: "Privacy",
      body: "Advertisers do not receive people’s conversations or personal details. Reporting is aggregated, such as views and clicks.",
    },
  ],
  availability:
    "Advertising in ChatGPT is new and rolling out by country, and formats and targeting options are still changing. We check what is available in Canada and your other markets before recommending a test.",
};

export const COMPARISON = {
  label: "Keywords and conversations",
  title: "A different moment in the same decision.",
  columns: [
    {
      id: "search",
      name: "Keyword advertising",
      lines: [
        ["Starts with", "A few words typed into a search box"],
        ["Relevance from", "Keywords you choose and bid on"],
        ["Placement", "Search results, above and below organic listings"],
        ["Best moment", "When someone knows what they want and is ready to act"],
      ],
    },
    {
      id: "conversation",
      name: "Conversational advertising",
      lines: [
        ["Starts with", "A question in full sentences, often with follow-ups"],
        ["Relevance from", "The topic of the conversation, matched by the platform"],
        ["Placement", "Below the assistant’s answer, labelled as sponsored"],
        ["Best moment", "While someone is still working out what to buy and from whom"],
      ],
    },
  ],
};

/** Interactive “two ways people find businesses” studio. */
export const FIND_WAYS = {
  label: "Search and conversations",
  title: "Two ways people find businesses.",
  lead: "Keyword search captures people ready to act. AI conversations reach them earlier, while they are still deciding what they need.",
  points: [
    {
      id: "search" as const,
      title: "Traditional search",
      body: "People search using specific keywords and compare results from different businesses.",
    },
    {
      id: "conversation" as const,
      title: "AI conversations",
      body: "People describe their needs, ask follow-up questions, and explore recommendations.",
    },
  ],
  modes: [
    {
      id: "search" as const,
      tab: "Traditional search",
      query: "dentist near me vancouver",
      results: [
        {
          sponsored: true,
          name: "Sparkle Dental Spa",
          url: "https://www.sparkledental.ca › vancouver",
          line: "New-patient exams and whitening. Same-week appointments. Book online today.",
        },
        {
          sponsored: false,
          name: "Harbour Family Dentistry",
          url: "https://www.harbourfamilydentistry.ca",
          line: "General and cosmetic dentistry in downtown Vancouver. Evening hours available.",
        },
        {
          sponsored: false,
          name: "West End Dental Clinic",
          url: "https://www.westenddental.ca",
          line: "Cleanings, check-ups and whitening for families across the West End.",
        },
      ],
    },
    {
      id: "conversation" as const,
      tab: "AI conversations",
      question: "Who is a good dentist near me in Vancouver for a cleaning and whitening?",
      answer: [
        "Look for a practice that lists hygiene and whitening clearly on its site.",
        "Check reviews that mention wait times and how new patients are booked.",
        "Ask whether they offer a new-patient exam before cosmetic work.",
      ],
      sponsor: {
        name: "Sparkle Dental Spa",
        line: "New-patient exams and professional whitening in Vancouver.",
        action: "Book an exam",
      },
    },
  ],
};

/** Industry examples for the “see how it can work” studio. */
export const INDUSTRY_EXAMPLES = {
  label: "Examples",
  title: "See how it can work for your business.",
  lead: "The same pattern fits many categories: a real question, a useful answer, then a clearly labelled sponsored placement.",
  industries: [
    {
      id: "hvac" as const,
      tab: "HVAC services",
      question: "What furnace options make sense for a Vancouver home?",
      answer: [
        "Start with a heat-loss calculation so the system is sized for your house.",
        "Compare high-efficiency gas furnaces with cold-climate heat pumps.",
        "Ask about rebates, warranties and what the install includes.",
      ],
      sponsor: {
        name: "Class A Heating",
        line: "Furnace and heat pump installs across Metro Vancouver. Free in-home estimates.",
        action: "Book an estimate",
        image: "/images/google-ads/product-heat-pump.jpg",
      },
    },
    {
      id: "dental" as const,
      tab: "Dental services",
      question: "How do I choose a dentist for whitening in Vancouver?",
      answer: [
        "Prefer a practice that explains whitening options and aftercare clearly.",
        "Read recent reviews that mention hygiene visits and new-patient booking.",
        "Ask what is included before you book a cosmetic appointment.",
      ],
      sponsor: {
        name: "Sparkle Dental Spa",
        line: "Whitening and new-patient exams with online booking.",
        action: "Book an exam",
        image: "/wp-content/uploads/2026/06/outdoor-advertising.jpg",
      },
    },
    {
      id: "retail" as const,
      tab: "Retail products",
      question: "What should I look for in everyday jeans that last?",
      answer: [
        "Check the fabric weight and whether the fit is designed for regular wear.",
        "Look for clear sizing guidance and a straightforward returns policy.",
        "Compare care instructions if you wash denim often.",
      ],
      sponsor: {
        name: "Mavi",
        line: "Jeans makers since 1991. Fits built for everyday wear.",
        action: "Shop jeans",
        image: "/images/home/out-of-home-mavi-canada-place.jpg",
      },
    },
  ],
};

/** Question → customer journey band. */
export const JOURNEY = {
  label: "The path",
  title: "From question to customer.",
  lead: "A sponsored placement is one step in a short path: discovery, presence, the click, then the conversion you can measure.",
  steps: [
    {
      name: "AI discovery",
      body: "Someone asks a full question while researching a decision.",
    },
    {
      name: "Sponsored placement",
      body: "A labelled offer appears below the answer, without changing it.",
    },
    {
      name: "Landing page",
      body: "The click opens a page that continues the same conversation.",
    },
    {
      name: "Conversion",
      body: "A call, form or booking you can track back to the placement.",
    },
  ],
};

export const PREPARATION = {
  label: "Creative and landing pages",
  title: "Be the obvious next step after a good answer.",
  lead: "Someone who has just read a thoughtful answer expects the same quality when they click. Sponsored placements work best when the offer is specific and the page they lead to continues the conversation.",
  items: [
    {
      title: "Specific offers",
      body: "A clear reason to click that matches the question: a free assessment, a sizing guide, a consultation.",
    },
    {
      title: "Pages that answer follow-up questions",
      body: "Pricing context, process, credentials and reviews on the landing page, so the visit does not end in a search for more information.",
    },
    {
      title: "Tracking from the first click",
      body: "Conversion tracking on calls, forms and bookings, so a test can be judged on leads and sales rather than clicks.",
    },
  ],
};

export const KOSICK_ROLE = {
  label: "How we help",
  title: "A clear process from strategy to launch.",
  lead: "Planning and readiness now. Testing when advertising in ChatGPT is open to your business and fits the plan.",
  steps: [
    {
      name: "Assess",
      body: "Whether your customers research in AI assistants, which questions lead to your services, and what is available in your markets.",
      checks: ["Business goals", "Target customers", "Questions they ask", "Markets and availability"],
    },
    {
      name: "Prepare",
      body: "Offers, creative, landing pages and conversion tracking built to the standard a sponsored placement needs.",
      checks: ["Specific offer", "Landing page", "Creative assets", "Conversion tracking"],
    },
    {
      name: "Plan the test",
      body: "Budget, success measures and how a test fits with Google Ads, social and your other channels.",
      checks: ["Test budget", "Success measures", "Channel fit", "Launch checklist"],
    },
    {
      name: "Review",
      body: "Read the aggregated reporting alongside your own lead and sales data, and decide what to do next.",
      checks: ["Views and clicks", "Leads and sales", "Cost to acquire", "Next decision"],
    },
  ],
  note: "We are not an OpenAI partner and do not claim special access to ChatGPT Ads. Where self-serve advertising is open to your business, we help you plan, prepare and evaluate it.",
};

export const COMPLEMENT = {
  title: "Part of the plan, not a replacement for it.",
  body: "ChatGPT advertising reaches people earlier in their research. Google Ads still captures the moment they search for a provider, and SEO, social, TV and outdoor build the familiarity that makes your name the one they recognize. We plan them together, so each channel is judged on its own role.",
  points: [
    "Each channel covers a different moment in the decision.",
    "Results are judged against the job that channel is meant to do.",
    "Creative and tracking stay consistent across the plan.",
  ],
  channels: [
    {
      id: "chatgpt" as const,
      name: "ChatGPT Ads",
      role: "Exploration and consideration",
      detail: "Present while someone is still working out what they need and who to trust.",
    },
    {
      id: "google" as const,
      name: "Google Ads",
      role: "High-intent capture",
      detail: "Reach people searching for a provider when they are ready to act.",
    },
    {
      id: "seo" as const,
      name: "SEO",
      role: "Ongoing discovery",
      detail: "Compound organic visibility for the questions customers ask repeatedly.",
    },
    {
      id: "social" as const,
      name: "Social & display",
      role: "Familiarity",
      detail: "Keep the brand present between research sessions and visits.",
    },
    {
      id: "media" as const,
      name: "TV & outdoor",
      role: "Reach and recognition",
      detail: "Build the name recognition that makes later clicks convert.",
    },
  ],
};

export const CHATGPT_ADS_FAQS: FaqItem[] = [
  {
    question: "Can we advertise in ChatGPT today?",
    answer:
      "OpenAI offers advertising in ChatGPT in a growing list of countries, through a self-serve ads manager. Availability, formats and eligibility are changing quickly, so we check what is open to your business in Canada and your other markets before planning a test.",
  },
  {
    question: "Can advertisers change or influence ChatGPT’s answers?",
    answer:
      "No. OpenAI states that ads run on systems separate from ChatGPT’s answers and that advertisers cannot influence what it says. A sponsored placement appears below the response and is labelled as sponsored.",
  },
  {
    question: "Do advertisers see what people type into ChatGPT?",
    answer:
      "No. According to OpenAI, advertisers do not receive people’s conversations or personal information. Reporting is aggregated, such as how many people saw or clicked an ad.",
  },
  {
    question: "Is Kosick an OpenAI partner?",
    answer:
      "No. We do not claim any partnership with OpenAI or special access to its advertising products. Our role is planning, preparation and evaluation, using the tools OpenAI makes available to advertisers.",
  },
  {
    question: "How is this different from Google Ads?",
    answer:
      "Google Ads is built around keywords people type into search. ChatGPT placements appear in a conversation, matched to its topic, often earlier in the decision. They can work together: one builds consideration while the other captures people ready to act.",
  },
  {
    question: "What should we prepare before testing?",
    answer:
      "A specific offer, a landing page that answers the follow-up questions people ask, and conversion tracking on calls, forms or sales. Those also improve the results of your search and social campaigns.",
  },
  {
    question: "Which businesses is it likely to suit?",
    answer:
      "Businesses whose customers research before they buy: home services, clinics, professional services, travel and considered retail purchases. Some categories may be restricted, and we check the current advertising policies for your industry.",
  },
];

export const CHATGPT_ADS_CTA = {
  title: "Plan your first step into AI advertising.",
  description:
    "Tell us about your customers and how they research. We will look at whether ChatGPT advertising fits, what you would need to prepare and how it would work with the marketing you already run.",
  primary: { label: "Book a planning session", href: "/contact/" },
  phone: { label: "604.925.5800", href: "tel:+16049255800" },
};
