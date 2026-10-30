import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const SPECIALTY_RETAIL: Industry = {
  id: "specialty-retail",
  name: "Specialty Retail Marketing",
  noun: "specialty retail",
  path: "/services/specialty-retail-marketing/",
  directory: {
    line: "E-commerce, social, radio and creative for independent stores.",
    image: { src: `${UP}/2023/06/hearth-advertising.jpg`, alt: "A pellet stove glowing in a living room with snow outside" },
  },
  offersIntro: {
    label: "What we offer",
    title: "Four services for independent retailers.",
    lead: "For garden centres, hearth and home stores, outfitters and other specialty shops that compete on knowledge and service. Open a service to see the detail.",
  },
  cta: {
    title: "Let's bring more people through the door.",
    description: "Tell us about your store, your seasons and your best customers. We'll plan the marketing around them.",
  },
  landing: {
    seo: {
      title: "Specialty Retail Marketing | Kosick Communications",
      description:
        "Marketing for specialty retailers: e-commerce websites, social media, radio advertising and creative campaigns that bring shoppers in store and online.",
    },
    hero: {
      label: "Specialty retail marketing",
      title: "Specialty Retail Marketing",
      lead: "Marketing for independent and specialty stores that win on expertise, selection and service: e-commerce, social media, radio and creative campaigns that bring shoppers in the door and to the online store.",
      image: { src: `${UP}/2026/07/Garden-Centre-Nursery-Marketing.jpg`, alt: "A garden centre website on a laptop beside a vase of olive branches" },
    },
    intro: {
      title: "Big-box prices can't buy your expertise.",
      paragraphs: [
        "Specialty retailers don't win on price. They win because their staff know the product, their selection is curated and the store is worth the visit. Marketing has to make that difference obvious before a shopper compares you with a national chain.",
        "We plan around the rhythm of your year, from spring planting to the first cold snap to the holiday rush, and use the channels that suit a local, loyal customer base: your website and online store, social media, radio and in-store creative.",
      ],
    },
    reasonsTitle: "Planned for a local, loyal customer.",
    reasons: [
      {
        title: "Seasonal by nature",
        body: "Plans follow your selling seasons, with campaigns in market before demand peaks and quieter months used to build the list.",
      },
      {
        title: "Local and loyal",
        body: "We target the neighbourhoods and drive times your shoppers come from, and keep regulars coming back.",
      },
      {
        title: "Knowledge is the product",
        body: "Content shows your team's expertise, the reason people choose a specialty store over a big box.",
      },
      {
        title: "Online and in store together",
        body: "Online stores, social and radio all point to the same offers, so a shopper can buy wherever suits them.",
      },
    ],
    gallery: [
      { src: `${UP}/2026/08/Social-Media.jpg`, alt: "Garden centre Instagram posts of flowers and a succulent planter" },
      { src: `${UP}/2023/06/hearth-advertising.jpg`, alt: "A pellet stove glowing in a living room with snow outside the window" },
      { src: `${UP}/2025/10/website-development.jpg`, alt: "An online tool store website on a laptop" },
    ],
  },
  services: [
    {
      slug: "ecommerce-websites",
      title: "E-commerce & Website Development",
      summary: "Online stores and websites that show your range, take orders and drive visits to the shop.",
      seo: {
        title: "E-commerce & Website Development for Specialty Retail | Kosick Communications",
        description:
          "E-commerce and website development for specialty retailers: online stores, product catalogues and click-and-collect, built by Kosick Communications.",
      },
      hero: {
        label: "Specialty retail e-commerce & websites",
        title: "Your store, open all night.",
        lead: "Shoppers browse before they visit, and many want to buy without visiting at all. We build websites and online stores that show your range, take orders and send people to the shop when that's the better choice.",
        image: { src: `${UP}/2025/10/website-development.jpg`, alt: "An online tool store website on a laptop in a bright room" },
      },
      card: { src: `${UP}/2026/07/Garden-Centre-Nursery-Marketing.jpg`, alt: "A garden centre website on a laptop beside a vase of olive branches" },
      intro: {
        title: "Online is the new front window.",
        paragraphs: [
          "Before a shopper makes the drive, they check what you carry, whether it's in stock and what it costs. If your website can't answer, they'll find someone else's that can.",
          "We build specialty retail websites around your catalogue and the way you sell: full online stores where it makes sense, click-and-collect and local delivery where it doesn't, and clear store information for people who want to come in and talk to an expert.",
        ],
      },
      offers: [
        {
          title: "Online stores",
          body: "Shopify and WooCommerce stores with product pages, variants, payments, shipping and local delivery rules set up for how you sell.",
        },
        {
          title: "Catalogue & inventory websites",
          body: "Browsable product ranges for stores that sell in person, with stock, pricing or quote requests where they help the shopper decide.",
        },
        {
          title: "Click-and-collect & store traffic",
          body: "Order-online, pick-up-in-store flows, store hours, directions and event pages that turn online browsing into visits.",
        },
      ],
      deliverables: [
        "Platform recommendation and site plan",
        "Custom design for desktop, tablet and phone",
        "Product catalogue set-up and import",
        "Payments, tax, shipping and pickup rules",
        "Product and category SEO",
        "Analytics and e-commerce tracking",
        "Staff training and ongoing support",
      ],
      benefits: [
        {
          title: "Sales after closing time",
          body: "An online store takes orders while the shop is closed.",
        },
        {
          title: "Better-prepared visitors",
          body: "Shoppers arrive knowing what they want and that you have it.",
        },
        {
          title: "Your range, found in search",
          body: "Product and category pages help shoppers find you for the items you carry.",
        },
      ],
      applications: [
        "Launching online ordering for seasonal stock",
        "Adding click-and-collect for busy weekends",
        "Moving a dated catalogue to Shopify or WooCommerce",
        "Selling gift cards and workshops online",
      ],
      approach: [
        { title: "Discover", body: "Your products, margins, systems and how customers buy." },
        { title: "Plan", body: "Platform, catalogue structure and fulfilment options." },
        { title: "Design & build", body: "A store that's easy to shop and easy for staff to run." },
        { title: "Launch & grow", body: "Tracking from day one, then improvements based on sales." },
      ],
      gallery: [
        { src: `${UP}/2026/07/Garden-Centre-Nursery-Marketing.jpg`, alt: "A garden centre website on a laptop beside a vase of olive branches" },
        { src: `${UP}/2025/08/mobile-responsive-website-design.jpeg`, alt: "A retailer's website open on a tablet in a stand" },
      ],
      related: [
        { label: "Website development & e-commerce", href: "/services/website-development/" },
        { label: "Search engine optimization", href: "/services/search-engine-optimization/" },
      ],
    },
    {
      slug: "social-media",
      title: "Social Media Management",
      summary: "Day-to-day social media that shows new arrivals, shares expert advice and builds a local following.",
      seo: {
        title: "Social Media Management for Specialty Retail | Kosick Communications",
        description:
          "Social media management for specialty retailers: content, posting, community management and paid social that bring local shoppers into the store.",
      },
      hero: {
        label: "Specialty retail social media",
        title: "Make the feed feel like the shop floor.",
        lead: "New arrivals, expert tips and the people behind the counter: specialty retail has the content social media rewards. We plan it, create it and run your channels so the posts keep coming even in your busiest week.",
        image: { src: `${UP}/2026/08/Garden-Centre-Social-Media.jpg`, alt: "A nursery summer sale post and garden centre feed on a phone" },
      },
      intro: {
        title: "Your regulars are already scrolling.",
        paragraphs: [
          "Local shoppers follow the stores they love. A steady feed of new stock, advice and events keeps you top of mind, and it's often the first place a new customer checks you out.",
          "The challenge is time. Your team is busy selling, so we take the planning, production and posting off your plate, while keeping the voice and knowledge that make the store yours.",
        ],
      },
      offers: [
        {
          title: "Content planning & creation",
          body: "Monthly calendars built around stock, seasons and events, with in-store photography, short video and graphics.",
        },
        {
          title: "Posting & community management",
          body: "Scheduling across Instagram, Facebook and TikTok, plus replies to comments and messages in your store's voice.",
        },
        {
          title: "Paid social campaigns",
          body: "Targeted campaigns for sales, events and new arrivals, reaching shoppers within driving distance of the store.",
        },
      ],
      deliverables: [
        "Social strategy and monthly content calendar",
        "In-store photo and video shoots",
        "Post design, captions and scheduling",
        "Community management",
        "Paid social campaigns and budgets",
        "Monthly reporting on reach, engagement and visits",
      ],
      benefits: [
        {
          title: "Consistent without the time",
          body: "Your channels stay active while your team stays on the floor.",
        },
        {
          title: "New arrivals sell faster",
          body: "Posting new stock gives shoppers a reason to visit this week.",
        },
        {
          title: "Expertise people share",
          body: "Practical advice is the content followers save and pass on.",
        },
      ],
      applications: [
        "Spring and holiday season campaigns",
        "Promoting workshops and in-store events",
        "Showing new arrivals the day they land",
        "Clearing seasonal stock with targeted offers",
      ],
      approach: [
        { title: "Get to know the store", body: "Your products, your people and your best customers." },
        { title: "Plan", body: "A calendar built on your seasons, stock and events." },
        { title: "Create & post", body: "Shoots, design and daily management of your channels." },
        { title: "Review", body: "Monthly results and adjustments for the next month." },
      ],
      gallery: [
        { src: `${UP}/2026/08/Social-Media.jpg`, alt: "Garden centre Instagram posts of flowers and a succulent planter" },
        { src: `${UP}/2026/06/social-media-advertising.jpg`, alt: "A retailer's Instagram profile on a phone resting on a laptop" },
      ],
      related: [
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "Email marketing", href: "/services/email-marketing/" },
      ],
    },
    {
      slug: "radio-advertising",
      title: "Radio Advertising",
      summary: "Local radio and streaming audio that reach drivers on the way to the store, with spots that stick.",
      seo: {
        title: "Radio Advertising for Specialty Retailers | Kosick Communications",
        description:
          "Radio and streaming audio advertising for specialty retailers: media planning, buying and spot production that drive local store traffic.",
      },
      hero: {
        label: "Specialty retail radio advertising",
        title: "Reach shoppers on the drive in.",
        lead: "Radio reaches people in the car, often on the way to shop. We plan and buy local radio and streaming audio for specialty retailers, and write and produce spots people remember.",
        image: { src: `${UP}/2024/03/radio-1.webp`, alt: "A smiling man adjusting the radio while driving" },
      },
      intro: {
        title: "Still the local shopper's channel.",
        paragraphs: [
          "For a store with a defined trading area, radio is one of the most efficient ways to reach a lot of local people, many of them in the car and close to a purchase.",
          "We choose stations and dayparts that match your customers, negotiate the buy, and produce spots with a clear offer and a reason to visit this week. Streaming audio adds precise targeting on top.",
        ],
      },
      offers: [
        {
          title: "Radio media planning & buying",
          body: "Station and daypart selection for your trading area, negotiated rates and flighting around your sales and seasons.",
        },
        {
          title: "Spot writing & production",
          body: "Scripts, voice talent, music and studio production for :30 and :15 spots, with versions for each station and season.",
        },
        {
          title: "Streaming audio",
          body: "Spotify, streaming radio and podcast placements targeted by location and interest.",
        },
      ],
      deliverables: [
        "Audience and station research",
        "Media plan, flighting and budget",
        "Negotiated radio buys",
        "Scripts and copywriting",
        "Studio production and voice talent",
        "Streaming audio campaigns",
        "Post-campaign reporting",
      ],
      benefits: [
        {
          title: "Local reach, efficiently",
          body: "Radio covers your trading area at a cost that suits independent retail.",
        },
        {
          title: "Close to the purchase",
          body: "Many listeners hear your spot in the car, on the way to shop.",
        },
        {
          title: "Frequency that builds memory",
          body: "Repeated spots make your offer and store name stick.",
        },
      ],
      applications: [
        "Weekend sale and event announcements",
        "Seasonal openings, such as spring planting or hearth season",
        "Store anniversaries and grand openings",
        "Back-to-school, holiday and long-weekend promotions",
      ],
      approach: [
        { title: "Target", body: "Who your customers are and what they listen to." },
        { title: "Plan & buy", body: "Stations, dayparts and streaming negotiated to budget." },
        { title: "Produce", body: "Spots written and recorded with a clear offer." },
        { title: "Report", body: "Delivery confirmed and results reviewed with you." },
      ],
      gallery: [
        { src: `${UP}/2026/06/radio-streaming-advertising.jpg`, alt: "A driver surrounded by logos of Canadian radio stations and streaming services" },
        { src: `${UP}/2021/07/audio-recording.jpg`, alt: "A studio microphone in a recording booth" },
      ],
      related: [
        { label: "Radio advertising", href: "/services/radio-advertising/" },
        { label: "Media buying in Canada", href: "/blog-media-buying-canada-tv-streaming-radio/" },
      ],
    },
    {
      slug: "content-creative",
      title: "Content Development & Creative Campaigns",
      summary: "Photography, video and campaign creative that show off your products and make every promotion look its best.",
      seo: {
        title: "Content Development & Creative Campaigns for Retail | Kosick Communications",
        description:
          "Content development and creative campaigns for specialty retailers: product photography, video, flyers, signage and seasonal campaign creative.",
      },
      hero: {
        label: "Content development & creative campaigns",
        title: "Show the product the way you see it.",
        lead: "Specialty products deserve better than a supplier photo. We create photography, video and campaign creative that show off your range and give every promotion a look worth stopping for.",
        image: { src: `${UP}/2023/06/hearth-advertising.jpg`, alt: "A pellet stove glowing in a living room with snow outside the window" },
      },
      intro: {
        title: "Great products, shown in their best light.",
        paragraphs: [
          "Shoppers buy what they can picture in their own home, garden or garage. Lifestyle photography and short video do that far better than a catalogue shot on white.",
          "We produce that content and build seasonal campaigns around it, so the same look runs on your website, social channels, flyers, in-store signage and ads.",
        ],
      },
      offers: [
        {
          title: "Product & lifestyle photography",
          body: "In-store, studio and on-location shoots that show your products in use and your store at its best.",
        },
        {
          title: "Video & short-form content",
          body: "How-to videos, product demos and short clips for social media, the website and in-store screens.",
        },
        {
          title: "Seasonal campaign creative",
          body: "Campaign concepts with flyers, signage, email, social and ad artwork that all carry the same idea.",
        },
      ],
      deliverables: [
        "Content plan by season",
        "Product and lifestyle photo shoots",
        "How-to and demo videos",
        "Campaign concept and key visual",
        "Flyers, signage and in-store displays",
        "Email and social creative",
        "A content library for your team",
      ],
      benefits: [
        {
          title: "Products that sell themselves",
          body: "Better imagery lifts online sales and in-store interest.",
        },
        {
          title: "One look across channels",
          body: "Every touchpoint in a campaign looks and sounds the same.",
        },
        {
          title: "Content ready when you need it",
          body: "A library of photos and video saves time every week.",
        },
      ],
      applications: [
        "A spring or holiday campaign from flyer to Instagram",
        "Lifestyle photography for a new product line",
        "How-to videos for the website and social media",
        "In-store signage for an anniversary sale",
      ],
      approach: [
        { title: "Brief", body: "Products, season and the result each campaign needs." },
        { title: "Concept", body: "One idea that works in store and online." },
        { title: "Produce", body: "Shoots, design and video in one production plan." },
        { title: "Roll out", body: "Assets delivered for every channel, sized and ready." },
      ],
      gallery: [
        { src: `${UP}/2023/06/print-ads.jpg`, alt: "A printed magazine layout open on a table" },
        { src: `${UP}/2023/06/MBYMockupcards2.jpeg`, alt: "MBY Interiors business cards fanned on a wooden surface" },
      ],
      related: [
        { label: "Creative & production", href: "/services/creative/" },
        { label: "Corporate branding", href: "/services/corporate-branding/" },
      ],
    },
  ],
};
