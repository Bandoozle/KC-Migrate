import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const TRAVEL: Industry = {
  id: "travel",
  name: "Travel Marketing",
  noun: "travel",
  path: "/services/travel-marketing/",
  directory: {
    line: "Television and lead generation that turn travellers into bookings.",
    image: { src: "/images/articles/travel-marketing-canada-cruise.jpg", alt: "A cruise ship anchored in a turquoise bay" },
  },
  offersIntro: {
    label: "What we offer",
    title: "Build demand. Capture the inquiry.",
    lead: "Travel advertising builds awareness for your brand; travel lead generation turns that interest into inquiries. Each service has its own page.",
  },
  cta: {
    title: "Let’s plan your next booking campaign.",
    description: "Tell us about your brand, the customers you want to reach and your booking season. We’ll plan a campaign around your goals.",
  },
  landing: {
    seo: {
      title: "Travel & Tourism Marketing | Kosick Communications",
      description:
        "Travel marketing for cruise lines, resorts, destinations and tour operators: TV, digital advertising and lead generation that create booking opportunities.",
    },
    hero: {
      label: "Travel & tourism marketing",
      title: "Travel Marketing",
      lead: "A travel marketing agency for cruise lines, resorts, destinations and tour operators. We combine television, streaming, search and social to reach the people most likely to book and encourage inquiries your team can convert.",
      image: { src: "/images/industries/travel/cabo-coastline-aerial.jpg", alt: "An aerial view of a resort coastline with a golden beach and turquoise sea" },
    },
    intro: {
      title: "Put your travel brand in front of the right people.",
      paragraphs: [
        "Travel is a considered purchase. Your future guests research for weeks or months, compare options and often decide as a household, so the brands they remember are the ones that stayed visible through that whole window.",
        "From cruise lines to resorts and tourism operators, we build coordinated advertising campaigns that put your brand in front of relevant audiences, generate inquiries and create more opportunities for bookings. Television and streaming build awareness at scale; search, social and landing pages capture the people who are ready to plan.",
      ],
    },
    reasonsLabel: "Travel advertising & lead generation",
    reasonsTitle: "Marketing designed to drive bookings.",
    reasons: [
      {
        title: "Reach the right audience",
        body: "Television builds broad awareness, and targeting by income, life stage, interests and travel history focuses the rest of the budget on people likely to book.",
      },
      {
        title: "Markets that can book",
        body: "Spend follows the Canadian cities with the flights, sailings and drive times that suit your product.",
      },
      {
        title: "Awareness to inquiry",
        body: "TV and streaming build the brand; search, social and landing pages turn that interest into booking inquiries.",
      },
      {
        title: "Timed to booking windows",
        body: "Campaigns run when your customers plan, such as wave season for cruise lines or early-booking periods for resorts.",
      },
    ],
    gallery: [
      { src: `${UP}/2026/02/resort-marketing.jpg`, alt: "A resort pool lined with palm trees and yellow loungers" },
      { src: `${UP}/2022/01/Motor-Court.webp`, alt: "A Mediterranean-style resort entrance framed by palm trees" },
      { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
    ],
  },
  services: [
    {
      slug: "lead-generation",
      title: "Lead Generation",
      summary: "Search, social and landing pages that turn interested audiences into qualified inquiries for your sales and reservations team.",
      seo: {
        title: "Travel & Tourism Lead Generation | Kosick Communications",
        description:
          "Lead generation for travel brands: search, social, landing pages and email nurture that capture qualified travellers and turn them into bookings.",
      },
      hero: {
        label: "Travel lead generation",
        title: "Capture the traveller who’s ready to plan.",
        lead: "When a trip moves from daydream to planning, travellers search, compare and ask for information. We put your offer in front of them and capture the lead, then nurture it through to a booking.",
        image: { src: "/images/industries/travel/expedia-cruises-laptop.jpg", alt: "An Expedia Cruises ad on a laptop as a traveller plans from the couch" },
      },
      card: { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
      intro: {
        title: "Turn interest into an itinerary.",
        paragraphs: [
          "Travel shoppers rarely book on the first visit. They request brochures, sign up for offers, compare departures and talk it over at home. Every one of those steps is a chance to capture a lead and stay in the conversation.",
          "We build campaigns that reach qualified travellers on search and social, landing pages that make inquiring easy, and email follow-up that keeps your destination on the shortlist until they book.",
        ],
      },
      offers: [
        {
          title: "Search & social campaigns",
          body: "Google, Meta and YouTube campaigns targeted to travellers by origin market, interests and life stage, timed to your booking windows.",
        },
        {
          title: "Landing pages & offers",
          body: "Destination and package landing pages with inquiry, brochure and offer sign-up forms that capture the details your sales team needs.",
        },
        {
          title: "Email nurture & follow-up",
          body: "Automated sequences that share itineraries, stories and offers and alert your team when a lead is ready to talk.",
        },
      ],
      deliverables: [
        "Audience and origin market plan",
        "Search and social campaigns",
        "Landing pages for destinations and packages",
        "Inquiry and brochure request forms",
        "Email nurture sequences",
        "CRM and booking system integration",
        "Lead and booking reporting",
      ],
      benefits: [
        {
          title: "Leads with intent",
          body: "Targeting by origin market and travel interest brings inquiries from people who can book.",
        },
        {
          title: "No lead left cold",
          body: "Nurture sequences keep your offer in front of travellers through a long decision.",
        },
        {
          title: "Know what books",
          body: "Tracking connects campaigns to inquiries and bookings.",
        },
      ],
      applications: [
        "Early-booking campaigns for a cruise season",
        "Resort package offers for Canadian winter getaways",
        "Group and incentive travel inquiries",
        "Brochure requests for escorted tours",
      ],
      approach: [
        { title: "Define", body: "Travellers, origin markets and booking windows." },
        { title: "Build", body: "Campaigns, landing pages and nurture sequences." },
        { title: "Launch", body: "Search and social live ahead of the booking season." },
        { title: "Optimize", body: "Budgets shifted to the audiences that inquire and book." },
      ],
      gallery: [
        { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
        { src: `${UP}/2026/06/social-media-engagement.jpg`, alt: "A resort website on a tablet with a pen beside it" },
        { src: `${UP}/2021/08/travel.jpg`, alt: "A tablet and phone showing social media apps" },
      ],
      related: [
        { label: "Travel Marketing in Canada", href: "/travel-marketing-canada/", kind: "guide", body: "Sponsorship, linear TV and digital working together to drive bookings." },
        { label: "Digital Marketing", href: "/services/digital-marketing/", kind: "service", body: "Google Ads, paid social and pre-roll, measured against results." },
        { label: "Email Marketing", href: "/services/email-marketing/", kind: "service", body: "Campaigns and automations that turn your list into bookings." },
      ],
    },
    {
      slug: "tv-advertising",
      title: "TV Advertising",
      summary: "Broadcast, connected TV and sponsorship that build awareness for your brand in the Canadian markets you sell to.",
      seo: {
        title: "Travel TV Advertising in Canada | Kosick Communications",
        description:
          "Television advertising for travel brands: broadcast, connected TV and sponsorships that reach qualified Canadian travellers, planned and placed by Kosick.",
      },
      hero: {
        label: "Travel TV advertising",
        title: "Start the trip on the screen.",
        lead: "Travel is sold on feeling, and nothing carries feeling like television. We plan and place broadcast, connected TV and sponsorships that put your destination in front of Canadian travellers with the means and intent to go.",
        image: { src: `${UP}/2026/09/Television-Advertising.jpg`, alt: "A family watching hockey on a large TV in a living room" },
      },
      intro: {
        title: "Television builds the dream and the trust.",
        paragraphs: [
          "A beach, a ship, a mountain view: travel is visual and emotional, and television shows it at its most persuasive. It also lends a destination or operator credibility that a banner ad can’t.",
          "We pair linear television and sponsorship, which build trust and scale, with connected TV, which adds precise targeting by household and region. The plan is built around your origin markets and the months when your travellers decide.",
        ],
      },
      offers: [
        {
          title: "Broadcast television",
          body: "National and regional TV plans on the programming qualified travellers watch, negotiated and booked by our media team.",
        },
        {
          title: "Connected TV & streaming",
          body: "Streaming placements targeted by household, region and interest, with reporting on completed views and website visits.",
        },
        {
          title: "Sponsorship & integration",
          body: "Program sponsorships and integrations that associate your destination with shows and events your audience already loves.",
        },
      ],
      deliverables: [
        "Audience and origin market research",
        "Broadcast and connected TV media plan",
        "Negotiated TV and streaming buys",
        "Sponsorship sourcing and negotiation",
        "Spot adaptation and trafficking",
        "Post-campaign reporting",
      ],
      benefits: [
        {
          title: "Inspiration at scale",
          body: "TV reaches whole markets of potential travellers at once.",
        },
        {
          title: "Credibility by association",
          body: "Appearing on trusted programming lends your brand confidence.",
        },
        {
          title: "Precision where it helps",
          body: "Connected TV narrows the reach to the households most likely to book.",
        },
      ],
      applications: [
        "A destination launching flights from a new Canadian city",
        "Cruise line wave-season campaigns",
        "Resort sponsorships on sports and lifestyle programming",
        "Connected TV targeted to high-income households",
      ],
      approach: [
        { title: "Research", body: "Travellers, origin markets and the programming they watch." },
        { title: "Plan", body: "Linear, streaming and sponsorship combined in one plan." },
        { title: "Buy", body: "Placements negotiated and trafficked to schedule." },
        { title: "Report", body: "Delivery and response measured through the season." },
      ],
      gallery: [
        { src: "/images/industries/travel/expedia-cruises-tv-spot.jpg", alt: "An Expedia Cruises television spot on a living-room TV" },
        { src: `${UP}/2026/02/ctv-morning-live.jpg`, alt: "Two people talking on the set of a Vancouver morning television show" },
        { src: `${UP}/2017/07/resort-marketing-scaled.jpg`, alt: "An aerial rendering of a beachfront resort beside a golf course" },
      ],
      related: [
        { label: "Media Buying: TV, Streaming & Radio", href: "/media-buying-canada/", kind: "guide", body: "How broadcast, streaming and radio inventory is bought in key Canadian markets." },
        { label: "Television Advertising", href: "/services/television-advertising/", kind: "service", body: "Broadcast TV campaigns, planned and bought by our media team." },
        { label: "Digital & Connected TV", href: "/services/digital-connected-tv/", kind: "service", body: "Streaming and connected TV with targeted reach and measurable delivery." },
      ],
    },
  ],
};
