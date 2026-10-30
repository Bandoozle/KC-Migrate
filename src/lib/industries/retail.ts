import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const RETAIL: Industry = {
  id: "retail",
  name: "Retail Marketing",
  noun: "retail",
  path: "/services/retail-marketing/",
  offersIntro: {
    label: "What we offer",
    title: "Three services for retail and fashion brands.",
    lead: "Outdoor, brand and digital, built to work as one campaign. Each service has its own page.",
  },
  cta: {
    title: "Let's put your brand on the street.",
    description: "Tell us about your brand, your stores and your next launch. We'll plan the campaign around it.",
  },
  landing: {
    seo: {
      title: "Retail & Fashion Marketing | Kosick Communications",
      description:
        "Retail and fashion marketing: billboard and outdoor advertising, branding and digital and social campaigns for apparel, lifestyle and retail brands.",
    },
    hero: {
      label: "Retail & fashion marketing",
      title: "Retail Marketing",
      lead: "Marketing for apparel, lifestyle and retail brands: outdoor campaigns that own the street, branding that holds up on the shelf, and digital and social marketing that turns attention into sales.",
      image: { src: `${UP}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "A Veilance poster of a woman in a dark coat in a downtown transit shelter", position: "center 35%" },
    },
    intro: {
      title: "Retail is won on attention.",
      paragraphs: [
        "Retail brands compete for a few seconds of attention: a glance at a transit shelter, a thumb pausing on a post, a package picked up from a shelf. The brands that win those seconds are clear, consistent and impossible to confuse with anyone else.",
        "We build that clarity into the brand, then carry it into the channels where retail is decided: the street, the store and the feed. Every campaign is planned so outdoor, digital and in-store work together around a launch, a season or a sale.",
      ],
    },
    reasons: [
      {
        title: "Brand first",
        body: "Strong identity and packaging make every ad dollar work harder, so we start there.",
      },
      {
        title: "Seasons and drops",
        body: "Campaigns are built around collections, launches and the retail calendar, from back-to-school to Black Friday.",
      },
      {
        title: "Street to screen",
        body: "Outdoor builds fame in your markets; digital and social convert it into visits and online orders.",
      },
      {
        title: "Measured, not guessed",
        body: "Digital campaigns are tracked to sales, and outdoor is planned against the audiences you need.",
      },
    ],
    gallery: [
      { src: `${UP}/2023/06/packaging.jpg`, alt: "A row of naked underwear boxes with model photography" },
      { src: `${UP}/2026/06/billboard-2.jpg`, alt: "A Veilance transit shelter poster on a tree-lined street" },
      { src: `${UP}/2025/11/black-friday-advertising.jpg`, alt: "A Black Friday sale sign with red sale tags and a clock" },
    ],
    reading: [
      { label: "Outdoor advertising for local impact", href: "/outdoor-advertising-maximize-local-impact/" },
      { label: "Our marketing results", href: "/marketing-results/" },
    ],
  },
  services: [
    {
      slug: "billboard-outdoor-advertising",
      title: "Billboard & Outdoor Advertising",
      summary: "Transit shelters, billboards and digital boards that put your brand at street level in the markets you sell.",
      seo: {
        title: "Retail Billboard & Outdoor Advertising | Kosick Communications",
        description:
          "Billboard, transit shelter and digital outdoor advertising for retail and fashion brands, planned, designed and booked by Kosick Communications.",
      },
      hero: {
        label: "Retail billboard & outdoor advertising",
        title: "Own the street outside the store.",
        lead: "Outdoor advertising puts your brand where people walk, drive and shop. We plan billboard, transit and digital out-of-home campaigns for retail brands and design creative that reads in a glance.",
        image: { src: `${UP}/2026/06/billboard-2.jpg`, alt: "A Veilance transit shelter poster on a tree-lined downtown street" },
      },
      card: { src: `${UP}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "A Veilance poster of a woman in a dark coat in a downtown transit shelter", position: "center 35%" },
      intro: {
        title: "Fame in the places that matter.",
        paragraphs: [
          "For a retail brand, outdoor does something digital can't: it makes you famous in a city. A well-placed shelter or board near your stores is seen hundreds of times by the same neighbourhood, and it lends a brand the presence of a much bigger company.",
          "We choose locations by audience and proximity to your stores, design creative built for distance and speed, and coordinate the campaign with your launches and digital media.",
        ],
      },
      offers: [
        {
          title: "Billboards",
          body: "Static and large-format boards on the routes into your trading areas, booked for the length of a launch or season.",
        },
        {
          title: "Transit & street furniture",
          body: "Transit shelters, bus and station placements near your stores and in the neighbourhoods your customers live and shop.",
        },
        {
          title: "Digital out-of-home",
          body: "Digital boards and screens with flexible scheduling, so creative can change with the day, the weather or the stage of a sale.",
        },
      ],
      deliverables: [
        "Market and location planning",
        "Media negotiation and booking",
        "Outdoor creative for every format",
        "Production and installation coordination",
        "Proof of posting and photography",
        "Campaign reporting",
      ],
      benefits: [
        {
          title: "Presence at city scale",
          body: "Outdoor gives a retail brand big-brand visibility in its markets.",
        },
        {
          title: "Close to the till",
          body: "Placements near stores reach people minutes from a purchase.",
        },
        {
          title: "Lifts every other channel",
          body: "A name people have seen on the street is easier to recognize in search results and feeds.",
        },
      ],
      applications: [
        "Launching a new store or flagship",
        "A seasonal collection campaign",
        "Holiday and Black Friday sales",
        "Entering a new city",
      ],
      approach: [
        { title: "Map", body: "Stores, customers and the routes between them." },
        { title: "Plan & book", body: "Formats and locations negotiated to budget." },
        { title: "Design", body: "Creative made for distance, speed and the setting." },
        { title: "Post & report", body: "Installation checked, photographed and reported." },
      ],
      gallery: [
        { src: `${UP}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "A Veilance poster of a woman in a dark coat in a downtown transit shelter" },
        { src: `${UP}/2024/03/digital-superboard.webp`, alt: "A Pattison digital superboard beside a highway" },
        { src: `${UP}/2026/01/outdoor-billboard-advertising.jpg`, alt: "A cyclist passing a blank billboard under a bridge" },
      ],
      related: [
        { label: "Outdoor advertising", href: "/services/outdoor-advertising/" },
        { label: "Canadian billboard dimensions", href: "/services/outdoor-advertising/billboard-dimensions/" },
      ],
    },
    {
      slug: "branding",
      title: "Branding & Creative Development",
      summary: "Identity, packaging and campaign creative that make your brand unmistakable on the shelf and on the street.",
      seo: {
        title: "Retail & Fashion Branding and Packaging Design | Kosick Communications",
        description:
          "Branding, packaging and creative development for retail and fashion brands: identity, packaging design, photography and campaign creative.",
      },
      hero: {
        label: "Retail branding & creative development",
        title: "Unmistakable on the shelf.",
        lead: "In retail, the brand is part of the product. We create identities, packaging and campaign creative that make your products instantly recognizable, whether they're on a shelf, in a shelter or in a feed.",
        image: { src: `${UP}/2023/06/packaging.jpg`, alt: "A row of naked underwear boxes with model photography" },
      },
      intro: {
        title: "The brand is what people buy twice.",
        paragraphs: [
          "Shoppers make many retail decisions in seconds. A distinctive identity and packaging do the selling before anyone reads a word, and they're what a happy customer looks for the next time.",
          "We develop retail brands from strategy to shelf: the name, the identity, the packaging system and the campaign look that carries the brand into stores, outdoor and social media.",
        ],
      },
      offers: [
        {
          title: "Brand identity",
          body: "Positioning, logo, colour, type and tone of voice, with guidelines that keep stores, packaging and campaigns consistent.",
        },
        {
          title: "Packaging design",
          body: "Packaging systems that stand out on shelf, work across a product range and photograph well for e-commerce and social media.",
        },
        {
          title: "Campaign creative",
          body: "Key visuals, photography direction and artwork for launches and seasons, built to work outdoor, in store and online.",
        },
      ],
      deliverables: [
        "Brand strategy and positioning",
        "Identity system and guidelines",
        "Packaging design across the range",
        "Photography and art direction",
        "In-store signage and displays",
        "Campaign key visuals",
        "Social and digital templates",
      ],
      benefits: [
        {
          title: "Recognized at a glance",
          body: "A clear system makes every product and ad instantly yours.",
        },
        {
          title: "Packaging that sells",
          body: "Shelf impact and unboxing appeal drive both trial and repeat purchase.",
        },
        {
          title: "Faster campaigns",
          body: "With the system in place, each new campaign starts from a strong base.",
        },
      ],
      applications: [
        "Launching a new apparel or lifestyle brand",
        "Redesigning packaging for a product range",
        "A seasonal collection campaign look",
        "Store signage for a new location",
      ],
      approach: [
        { title: "Discover", body: "Customers, competitors and what the brand stands for." },
        { title: "Define", body: "Positioning and creative direction." },
        { title: "Design", body: "Identity, packaging and the first campaign." },
        { title: "Roll out", body: "Guidelines and assets delivered for every channel." },
      ],
      gallery: [
        { src: `${UP}/2023/06/product-packaging.jpg`, alt: "A black naked product box on a white background" },
        { src: `${UP}/2025/07/branding-agency.webp`, alt: "An orange brand identity card on a desk beside a keyboard" },
      ],
      related: [
        { label: "Corporate branding", href: "/services/corporate-branding/" },
        { label: "Creative & production", href: "/services/creative/" },
      ],
    },
    {
      slug: "digital-social-media",
      title: "Digital & Social Media Marketing",
      summary: "Social, influencer and paid digital campaigns that turn attention into store visits and online orders.",
      seo: {
        title: "Retail Digital & Social Media Marketing | Kosick Communications",
        description:
          "Digital and social media marketing for retail and fashion brands: social content, influencer campaigns and paid digital that drive store visits and e-commerce sales.",
      },
      hero: {
        label: "Retail digital & social media marketing",
        title: "From scroll to checkout.",
        lead: "Retail is discovered in the feed. We run social content, influencer partnerships and paid digital campaigns that introduce your products to the right people and send them to your stores and online shop.",
        image: { src: `${UP}/2026/06/social-media-advertising.jpg`, alt: "A brand's Instagram profile on a phone resting on a laptop" },
      },
      intro: {
        title: "Where retail is discovered now.",
        paragraphs: [
          "Most shoppers first meet a new retail brand on a screen: a creator's post, a targeted ad, a friend's share. The brands that grow are the ones present in those moments with content that feels native, not like an interruption.",
          "We plan and produce social content, manage creator partnerships and run paid campaigns across Meta, TikTok, Google and YouTube, all tracked to store visits and e-commerce sales.",
        ],
      },
      offers: [
        {
          title: "Social media content",
          body: "Product, lifestyle and behind-the-scenes content for Instagram, TikTok and Facebook, planned around drops and seasons.",
        },
        {
          title: "Influencer campaigns",
          body: "Creator selection, briefs, contracts and content rights for partnerships that reach the audiences your brand wants.",
        },
        {
          title: "Paid digital & e-commerce campaigns",
          body: "Meta, TikTok, Google Shopping and YouTube campaigns with catalogue ads, retargeting and tracking through to the sale.",
        },
      ],
      deliverables: [
        "Digital and social strategy",
        "Content calendar and production",
        "Influencer sourcing and management",
        "Paid social and shopping campaigns",
        "Retargeting and catalogue ads",
        "Conversion and sales tracking",
        "Monthly reporting",
      ],
      benefits: [
        {
          title: "Found by new customers",
          body: "Targeting and creators put your products in front of people who don't know you yet.",
        },
        {
          title: "Every dollar tracked",
          body: "Campaigns report on sales and store visits, not only clicks.",
        },
        {
          title: "Content that feels native",
          body: "Posts and ads made for each platform perform better and cost less.",
        },
      ],
      applications: [
        "A collection launch with creators",
        "Black Friday and holiday sales campaigns",
        "Driving traffic to a new store",
        "Retargeting online shoppers who didn't check out",
      ],
      approach: [
        { title: "Strategy", body: "Audiences, platforms and goals for each campaign." },
        { title: "Create", body: "Content and creator partnerships produced to brief." },
        { title: "Launch", body: "Paid campaigns live, tested and tracked." },
        { title: "Optimize", body: "Budgets moved to the content and audiences that sell." },
      ],
      gallery: [
        { src: `${UP}/2025/11/black-friday-advertising.jpg`, alt: "A Black Friday sale sign with red sale tags and a clock" },
        { src: `${UP}/2025/07/mobile-marketing.webp`, alt: "A hand holding a phone with social media icons rising from the screen" },
      ],
      related: [
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "Digital marketing", href: "/services/digital-marketing/" },
        { label: "Website development & e-commerce", href: "/services/website-development/" },
      ],
    },
  ],
};
