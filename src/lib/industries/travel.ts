import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const TRAVEL: Industry = {
  id: "travel",
  name: "Travel Marketing",
  noun: "travel",
  path: "/services/travel-marketing/",
  offersIntro: {
    label: "What we offer",
    title: "Two ways we fill seats and rooms.",
    lead: "Television to inspire the trip, lead generation to capture the traveller who's ready to plan. Each has its own page.",
  },
  cta: {
    title: "Let's put your destination on the itinerary.",
    description: "Tell us about your destination, your travellers and your booking season. We'll plan the campaign around them.",
  },
  landing: {
    seo: {
      title: "Travel & Tourism Marketing | Kosick Communications",
      description:
        "Travel marketing for destinations, resorts, cruise lines and tour operators: TV advertising and lead generation that reach qualified Canadian travellers.",
    },
    hero: {
      label: "Travel & tourism marketing",
      title: "Travel Marketing",
      lead: "Marketing for destinations, resorts, cruise lines and tour operators: television that inspires the trip and lead generation that turns qualified travellers into bookings.",
      image: { src: "/images/articles/travel-marketing-canada-cruise.jpg", alt: "A cruise ship anchored in a turquoise bay beside a tropical island" },
    },
    intro: {
      title: "Travel is a long decision. Be there for all of it.",
      paragraphs: [
        "Travel is one of the most considered purchases a household makes. The planning window runs for weeks or months, several people weigh in, and the final choice is as emotional as it is practical.",
        "The brands winning share are present across that whole journey. Television builds the dream and the trust; lead generation captures the traveller who's ready to compare options and book. We plan both around the travellers you want, in the markets they travel from.",
      ],
    },
    reasons: [
      {
        title: "Qualified travellers, not mass reach",
        body: "Campaigns target people with the means, the interest and the intent to book, by income, life stage and travel history.",
      },
      {
        title: "Origin markets matter",
        body: "We focus spend on the Canadian cities with the flights, sailings and drive times that suit your product.",
      },
      {
        title: "Inspiration to booking",
        body: "TV and video start the conversation; digital lead generation carries it through to the booking.",
      },
      {
        title: "Booking windows, not calendar months",
        body: "Flighting follows when your travellers plan, which is often months before they travel.",
      },
    ],
    gallery: [
      { src: `${UP}/2026/02/resort-marketing.jpg`, alt: "A resort pool lined with palm trees and yellow loungers" },
      { src: `${UP}/2022/01/Motor-Court.webp`, alt: "A Mediterranean-style resort entrance framed by palm trees" },
      { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
    ],
    reading: [
      { label: "Travel marketing in Canada", href: "/travel-marketing-canada/" },
      { label: "Corporate events & incentive travel", href: "/corporate-events/" },
    ],
  },
  services: [
    {
      slug: "lead-generation",
      title: "Lead Generation",
      summary: "Search, social and landing pages that capture travellers who are ready to plan, and nurture them to a booking.",
      seo: {
        title: "Travel Lead Generation for Resorts, Cruises & Tours | Kosick Communications",
        description:
          "Lead generation for travel brands: search, social, landing pages and email nurture that capture qualified travellers and turn them into bookings.",
      },
      hero: {
        label: "Travel lead generation",
        title: "Capture the traveller who's ready to plan.",
        lead: "When a trip moves from daydream to planning, travellers search, compare and ask for information. We put your offer in front of them and capture the lead, then nurture it through to a booking.",
        image: { src: `${UP}/2026/06/social-media-marketing-2.jpg`, alt: "A resort website open on a tablet against a white wall" },
      },
      card: { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
      intro: {
        title: "Turn interest into an itinerary.",
        paragraphs: [
          "Travel shoppers rarely book on the first visit. They request brochures, sign up for offers, compare departures and talk it over at home. Every one of those steps is a chance to capture a lead and stay in the conversation.",
          "We build campaigns that reach qualified travellers on search and social, landing pages that make enquiring easy, and email follow-up that keeps your destination on the shortlist until they book.",
        ],
      },
      offers: [
        {
          title: "Search & social campaigns",
          body: "Google, Meta and YouTube campaigns targeted to travellers by origin market, interests and life stage, timed to your booking windows.",
        },
        {
          title: "Landing pages & offers",
          body: "Destination and package landing pages with enquiry, brochure and offer sign-up forms that capture the details your sales team needs.",
        },
        {
          title: "Email nurture & follow-up",
          body: "Automated sequences that share itineraries, stories and offers, and alert your team when a lead is ready to talk.",
        },
      ],
      deliverables: [
        "Audience and origin market plan",
        "Search and social campaigns",
        "Landing pages for destinations and packages",
        "Enquiry and brochure request forms",
        "Email nurture sequences",
        "CRM and booking system integration",
        "Lead and booking reporting",
      ],
      benefits: [
        {
          title: "Leads with intent",
          body: "Targeting by origin market and travel interest brings enquiries from people who can book.",
        },
        {
          title: "No lead left cold",
          body: "Nurture sequences keep your offer in front of travellers through a long decision.",
        },
        {
          title: "Know what books",
          body: "Tracking connects campaigns to enquiries and bookings.",
        },
      ],
      applications: [
        "Early-booking campaigns for a cruise season",
        "Resort package offers for Canadian winter getaways",
        "Group and incentive travel enquiries",
        "Brochure requests for escorted tours",
      ],
      approach: [
        { title: "Define", body: "Travellers, origin markets and booking windows." },
        { title: "Build", body: "Campaigns, landing pages and nurture sequences." },
        { title: "Launch", body: "Search and social live ahead of the booking season." },
        { title: "Optimize", body: "Budgets shifted to the audiences that enquire and book." },
      ],
      gallery: [
        { src: `${UP}/2026/06/social-media-marketing.jpg`, alt: "The Expedia Cruises Facebook page on desktop and mobile" },
        { src: `${UP}/2026/06/social-media-engagement.jpg`, alt: "A resort website on a tablet with a pen beside it" },
        { src: `${UP}/2021/08/travel.jpg`, alt: "A tablet and phone showing social media apps" },
      ],
      related: [
        { label: "Digital marketing", href: "/services/digital-marketing/" },
        { label: "Email marketing", href: "/services/email-marketing/" },
        { label: "Travel marketing in Canada", href: "/travel-marketing-canada/" },
      ],
    },
    {
      slug: "tv-advertising",
      title: "TV Advertising",
      summary: "Broadcast, connected TV and sponsorship that put your destination in Canadian living rooms.",
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
          "A beach, a ship, a mountain view: travel is visual and emotional, and television shows it at its most persuasive. It also lends a destination or operator credibility that a banner ad can't.",
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
        { src: `${UP}/2026/06/tv-streaming-advertising-1.jpg`, alt: "A streaming service home screen on a TV in a living room" },
        { src: `${UP}/2026/02/ctv-morning-live.jpg`, alt: "Two people talking on the set of a Vancouver morning television show" },
        { src: `${UP}/2017/07/resort-marketing-scaled.jpg`, alt: "An aerial rendering of a beachfront resort beside a golf course" },
      ],
      related: [
        { label: "Television advertising", href: "/services/television-advertising/" },
        { label: "Digital & connected TV", href: "/services/digital-connected-tv/" },
        { label: "Media buying in Canada", href: "/blog-media-buying-canada-tv-streaming-radio/" },
      ],
    },
  ],
};
