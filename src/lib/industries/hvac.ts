import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const HVAC: Industry = {
  id: "hvac",
  name: "HVAC Marketing",
  noun: "HVAC",
  path: "/services/hvac-marketing/",
  directory: {
    line: "Omni-channel programs that keep a dealer’s schedule full, year-round.",
    image: { src: `${UP}/2026/06/hvac-billboard-advertising.jpg`, alt: "A Belyea Bros. heat pump billboard above a Toronto street corner", position: "center 30%" },
  },
  offersIntro: {
    label: "What we offer",
    title: "Five ways we grow HVAC businesses.",
    lead: "Each service has its own page with the detail: what we build, how it runs and where it fits in a dealer's year.",
  },
  cta: {
    title: "Let's fill your schedule.",
    description: "Tell us about your service area, your brands and your busy seasons. We'll show you where the next jobs come from.",
  },
  services: [
    {
      slug: "website-design",
      title: "Website Design & Development",
      summary: "Fast, conversion-focused HVAC websites with online booking and lead capture built in.",
      seo: {
        title: "HVAC Website Design & Development | Kosick Communications",
        description:
          "Conversion-focused HVAC websites with online booking, quote forms and call tracking, built for heating and cooling dealers by Kosick Communications.",
      },
      hero: {
        label: "HVAC website design & development",
        title: "A website that books the service call.",
        lead: "We design and build HVAC websites around the moment a homeowner needs help: clear services, a phone number that's always in reach, and booking that takes less than a minute.",
        image: { src: `${UP}/2026/03/hvac-web-development.png`, alt: "The Neels Heating & Cooling website open on a laptop" },
      },
      card: { src: `${UP}/2025/07/home-services-website-design.webp`, alt: "An HVAC dealer website on a laptop beside a plant" },
      intro: {
        title: "Built for the homeowner with no heat.",
        paragraphs: [
          "Most HVAC website visits happen on a phone, often when something has stopped working. The site has to answer three questions fast: do you service my area, can you fix this, and how do I reach you now.",
          "We plan every page around those answers. Service pages are written for the jobs you want more of, from furnace replacement to heat pump installs, and every page leads to a call, a booking or a quote request you can track.",
        ],
      },
      offers: [
        {
          title: "HVAC website development",
          body: "Custom WordPress sites built for heating and cooling dealers, with pages for each service, brand and service area, and a structure search engines can read.",
        },
        {
          title: "Conversion-focused design",
          body: "Layouts that put the phone number, offers and financing where homeowners look, with trust signals such as reviews, certifications and the brands you carry.",
        },
        {
          title: "Online booking & lead capture",
          body: "Booking and quote forms connected to your inbox or CRM, click-to-call on mobile and tracking that shows which pages and campaigns produce the jobs.",
        },
      ],
      deliverables: [
        "Sitemap and page plan for your services and service areas",
        "Custom design for desktop, tablet and phone",
        "Service, brand and location page copy",
        "Booking, quote and service request forms",
        "Click-to-call and call tracking",
        "Google Analytics 4 and conversion tracking",
        "On-page SEO and fast page loads",
        "Training and ongoing support",
      ],
      benefits: [
        {
          title: "More calls from the same traffic",
          body: "Clear paths to call or book turn more of your existing visitors into service requests.",
        },
        {
          title: "Campaigns that land somewhere",
          body: "Search, social and co-op campaigns point to pages built for that offer, not a generic home page.",
        },
        {
          title: "A site your team can update",
          body: "Change offers, seasonal promotions and rebates yourself, without waiting on a developer.",
        },
      ],
      applications: [
        "Replacing an outdated dealer site that doesn't work on phones",
        "Launching landing pages for heat pump rebates or seasonal tune-ups",
        "Adding online booking for maintenance plans",
        "Building location pages as you expand into new service areas",
      ],
      approach: [
        { title: "Discover", body: "Your services, margins, service areas and the jobs you want more of." },
        { title: "Plan", body: "Sitemap, page content and the conversion path for each service." },
        { title: "Design & build", body: "A custom site, tested on the phones and browsers your customers use." },
        { title: "Launch & improve", body: "Tracking from day one, then refinements based on calls and bookings." },
      ],
      gallery: [
        { src: `${UP}/2025/07/home-services-website-design.webp`, alt: "A home comfort dealer website on a laptop on a desk" },
        { src: `${UP}/2023/09/hvac-website-development.png`, alt: "The DirectBuy Furnace website hero with flame and snowflake icons" },
      ],
      related: [
        { label: "Website development & e-commerce", href: "/services/website-development/" },
        { label: "Search engine optimization", href: "/services/search-engine-optimization/" },
        { label: "HVAC website development guide", href: "/blog-hvac-website-development/" },
      ],
    },
    {
      slug: "branding-advertising",
      title: "Branding & Traditional Advertising",
      summary: "A brand homeowners remember, carried onto billboards and co-op campaigns funded by your manufacturers.",
      seo: {
        title: "HVAC Branding, Billboard & Co-op Advertising | Kosick Communications",
        description:
          "Branding, billboard advertising and co-op advertising for HVAC dealers. Kosick builds the brand and places it where homeowners see it, using manufacturer co-op funds.",
      },
      hero: {
        label: "HVAC branding & traditional advertising",
        title: "Be the name homeowners already know.",
        lead: "When a furnace fails, homeowners call the company they remember. We build HVAC brands that stand out from the truck to the billboard, and fund more of the media with co-op.",
        image: { src: `${UP}/2026/06/hvac-billboard-advertising.jpg`, alt: "A Belyea Bros. heat pump billboard above a Toronto street corner", position: "center 30%" },
      },
      card: { src: `${UP}/2023/07/hvac.jpg`, alt: "An Ayotte Plumbing & Heating billboard for a Comfortmaker furnace" },
      intro: {
        title: "Recognition is decided before the emergency.",
        paragraphs: [
          "Heating and cooling is a category homeowners rarely think about until they need it. The dealers who get the call are the ones whose name, colours and promise were already familiar.",
          "We build that familiarity in two steps. First, a brand system that works on trucks, uniforms, yard signs and the web. Then traditional media, from billboards to print, placed in the neighbourhoods you serve and paid for in part by manufacturer co-op programs.",
        ],
      },
      offers: [
        {
          title: "Branding",
          body: "Logo refinement, colour, type and a clear brand promise, with guidelines that keep every truck wrap, invoice and ad consistent.",
        },
        {
          title: "Billboard advertising",
          body: "Static and digital boards chosen for traffic through your service area, with creative designed to be read in a few seconds from the road.",
        },
        {
          title: "Co-op advertising",
          body: "Campaigns built to manufacturer and utility co-op rules, from brand-compliant creative to proof of performance, so more of your media is reimbursed.",
        },
      ],
      deliverables: [
        "Brand audit and positioning",
        "Logo, colour and typography system",
        "Brand guidelines for trucks, uniforms and signage",
        "Billboard and transit creative",
        "Outdoor media planning and booking",
        "Co-op eligible creative for your brands",
        "Co-op claim documentation and proof of performance",
        "Print, direct mail and door hanger design",
      ],
      benefits: [
        {
          title: "Remembered when it counts",
          body: "Consistent branding and outdoor presence put your name first when the system breaks down.",
        },
        {
          title: "Media budgets that go further",
          body: "Co-op programs can reimburse part of qualifying advertising for the brands you carry.",
        },
        {
          title: "One look everywhere",
          body: "Trucks, boards, the website and social posts read as the same company.",
        },
      ],
      applications: [
        "Refreshing a family business brand for the next generation",
        "Billboards on the commuter routes into a new service area",
        "Manufacturer co-op campaigns for Trane, Daikin, Comfortmaker and other brands",
        "Pre-season awareness before the first cold snap",
      ],
      approach: [
        { title: "Audit", body: "Your current brand, competitors and the co-op programs you qualify for." },
        { title: "Build the brand", body: "Identity, messaging and guidelines your team can use." },
        { title: "Plan the media", body: "Billboard locations and traditional placements mapped to your service area." },
        { title: "Run & claim", body: "Campaigns in market, with co-op documentation prepared for submission." },
      ],
      gallery: [
        { src: `${UP}/2023/07/hvac.jpg`, alt: "An Ayotte Plumbing & Heating billboard promoting a Comfortmaker furnace" },
        { src: `${UP}/2023/07/home-services-billboards.jpg`, alt: "A GE residential HVAC billboard against a blue sky" },
        { src: `${UP}/2023/07/outdoor-advertising-1-scaled.jpg`, alt: "A Trane We Run Together billboard between office towers" },
      ],
      related: [
        { label: "Corporate branding", href: "/services/corporate-branding/" },
        { label: "Outdoor advertising", href: "/services/outdoor-advertising/" },
        { label: "FortisBC co-op advertising for HVAC", href: "/hvac-marketing-fortisbc-co-op-advertising/" },
      ],
    },
    {
      slug: "digital-marketing",
      title: "Digital Marketing & Lead Generation",
      summary: "Social media, content and AI tools that keep your company in front of homeowners between service calls.",
      seo: {
        title: "HVAC Digital Marketing: Social, Content & AI | Kosick Communications",
        description:
          "Social media marketing, content development and AI marketing tools for HVAC dealers. Kosick keeps your brand visible and turns interest into service requests.",
      },
      hero: {
        label: "HVAC digital marketing & lead generation",
        title: "Stay in the feed between service calls.",
        lead: "Homeowners scroll long before they search. We keep your company in front of them with social media, useful content and AI tools that answer questions and capture leads at any hour.",
        image: { src: `${UP}/2026/06/hvac-social-media-marketing-1.jpg`, alt: "HVAC social media posts on a phone and a printed card" },
      },
      intro: {
        title: "Demand starts long before the search.",
        paragraphs: [
          "A homeowner who sees your posts all year, reads your advice on heat pumps and gets a quick answer at 10 p.m. is far more likely to call you than a name in a list of ads.",
          "This service covers the always-on side of HVAC marketing: social media, content and AI tools. Paid search and Local Service Ads are covered in our HVAC lead generation guide, and the two work best together.",
        ],
      },
      offers: [
        {
          title: "Social media marketing",
          body: "Organic posting and paid campaigns on Facebook, Instagram, YouTube and TikTok, timed to the heating and cooling seasons and targeted to your service area.",
        },
        {
          title: "Content development",
          body: "Articles, guides, short videos and graphics that answer the questions homeowners ask, from rebates to replacement costs, and give your social channels something worth sharing.",
        },
        {
          title: "AI marketing tools",
          body: "AI chat assistants for your website, AI-assisted content production and automated follow-up, set up so a homeowner gets a useful answer and your team gets the lead.",
        },
      ],
      deliverables: [
        "Social media strategy and content calendar",
        "Post design, copy and short-form video",
        "Paid social campaigns with service-area targeting",
        "Blog articles and homeowner guides",
        "Website AI chat assistant set-up",
        "Automated lead follow-up by email",
        "Monthly reporting on reach, leads and cost per lead",
      ],
      benefits: [
        {
          title: "Visible all year",
          body: "Seasonal content keeps your brand present in the quiet months, not only during the rush.",
        },
        {
          title: "Leads after hours",
          body: "AI assistants and forms capture questions and requests while the office is closed.",
        },
        {
          title: "Content that does double duty",
          body: "One guide becomes posts, an email and a search-friendly page.",
        },
      ],
      applications: [
        "Promoting heat pump rebates as programs change",
        "Pre-season tune-up and maintenance plan campaigns",
        "Answering common questions on the website through an AI assistant",
        "Recruiting technicians through social channels",
      ],
      approach: [
        { title: "Listen", body: "What your customers ask, which jobs you want and where they spend time online." },
        { title: "Plan", body: "A content calendar matched to the heating and cooling seasons." },
        { title: "Create & launch", body: "Posts, articles, video and AI tools, built in your brand." },
        { title: "Measure", body: "Reach, engagement and leads reviewed monthly, then adjusted." },
      ],
      gallery: [
        { src: `${UP}/2026/06/hvac-lead-generation-1.jpg`, alt: "An HVAC energy efficiency ad on a phone beside a printed flyer" },
        { src: `${UP}/2026/02/hvac-digital-marketing.webp`, alt: "A Daikin heat pump on a patio beside a fire table" },
      ],
      related: [
        { label: "How HVAC lead generation works", href: "/services/hvac-marketing/hvac-lead-generation/" },
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "HVAC digital marketing article", href: "/hvac-digital-marketing/" },
      ],
    },
    {
      slug: "video-tv-advertising",
      title: "Video & Television Advertising",
      summary: "TV spots, streaming and video production that put your company on the screens homeowners watch.",
      seo: {
        title: "HVAC TV Advertising & Video Production | Kosick Communications",
        description:
          "Television advertising, connected TV and video production for HVAC dealers. Kosick plans, produces and places commercial campaigns that build trust at scale.",
      },
      hero: {
        label: "HVAC video & television advertising",
        title: "Earn trust on the biggest screen in the house.",
        lead: "Television and video show your people, your trucks and your work. We produce HVAC commercials and place them on broadcast, streaming and YouTube so homeowners know you before they need you.",
        image: { src: "/images/television/trane-poster.png", alt: "A Trane air conditioner lit in green on a dark stage" },
      },
      card: { src: "/images/television/trane-poster.png", alt: "A Trane air conditioner lit in green on a dark stage" },
      intro: {
        title: "Video does what a search ad can't.",
        paragraphs: [
          "A search ad catches the homeowner who is already looking. Television and video reach the much larger group who will need a new system in the next year or two, and they show the people behind the company.",
          "We handle the whole campaign: the idea, the shoot, the edit and the media plan across broadcast TV, connected TV and online video, with versions sized for every placement.",
        ],
      },
      offers: [
        {
          title: "TV advertising",
          body: "Broadcast and connected TV plans built around your service area and season, negotiated and booked by our media team, with reporting on delivery.",
        },
        {
          title: "Video production",
          body: "Scripts, shoots and edits that feature your technicians, trucks and customers, with cut-downs for social, YouTube and your website.",
        },
        {
          title: "Commercial campaigns",
          body: "Seasonal and brand campaigns that run across TV, streaming and online video together, including manufacturer co-op versions where eligible.",
        },
      ],
      deliverables: [
        "Campaign concept and scripts",
        "Production: crew, casting, locations and shoot",
        "Editing, colour, sound and voice-over",
        ":30, :15 and :06 versions for TV and online",
        "Broadcast and connected TV media plans",
        "YouTube and social video campaigns",
        "Delivery and performance reporting",
      ],
      benefits: [
        {
          title: "Trust before the call",
          body: "Homeowners see your people and your work before they ever pick up the phone.",
        },
        {
          title: "Reach at scale",
          body: "TV and streaming reach whole markets in a way search alone cannot.",
        },
        {
          title: "One shoot, many uses",
          body: "A single production supplies TV spots, social clips and website video.",
        },
      ],
      applications: [
        "A brand campaign introducing a family-owned dealer to a growing market",
        "Pre-season heating and cooling spots",
        "Connected TV targeted to homeowners in your postal codes",
        "Customer story videos for the website and social media",
      ],
      approach: [
        { title: "Concept", body: "The message, the audience and how the campaign will look." },
        { title: "Produce", body: "Script, shoot and edit, with your team on camera where it helps." },
        { title: "Place", body: "Broadcast, streaming and online video booked to your plan." },
        { title: "Report", body: "Delivery, reach and response tracked through the campaign." },
      ],
      gallery: [
        { src: "/images/hvac-marketing/video-poster.jpg", alt: "The Belyea Bros. Heating & Cooling logo on red, from the This is Belyea campaign" },
        { src: "/images/hvac-marketing/tab-youtube.jpg", alt: "A Daikin heat pump with a YouTube play button" },
        { src: `${UP}/2025/12/trane-hvac-advertising.jpeg`, alt: "Two RunTru air conditioners beside a brick home" },
      ],
      related: [
        { label: "Television advertising", href: "/services/television-advertising/" },
        { label: "Digital & connected TV", href: "/services/digital-connected-tv/" },
        { label: "Creative & production", href: "/services/creative/" },
      ],
    },
    {
      slug: "business-growth",
      title: "HVAC Business Growth Solutions",
      summary: "Co-op funding, incentive travel and growth strategy for dealers and manufacturers planning their next stage.",
      seo: {
        title: "HVAC Business Growth: Co-op Funding & Incentive Travel | Kosick Communications",
        description:
          "Co-op funding, incentive travel programs and business growth strategy for HVAC dealers and manufacturers, from Kosick Communications.",
      },
      hero: {
        label: "HVAC business growth solutions",
        title: "Grow the business, not only the leads.",
        lead: "Beyond campaigns, we help HVAC dealers and manufacturers find the money, motivation and plan to grow: co-op funding, incentive travel that rewards top performers, and strategy for the next stage.",
        image: { src: `${UP}/2026/03/hvac-marketing-strategies.jpg`, alt: "A heat pump beside a modern home with tall trees behind" },
      },
      intro: {
        title: "Growth needs more than another campaign.",
        paragraphs: [
          "Dealers grow when marketing budgets stretch further, when the best people are rewarded and when there's a clear plan for where the business is going. Manufacturers grow when their dealer network does.",
          "This is the part of our HVAC work that sits above individual campaigns. We bring co-op funding, incentive travel and business strategy together so each one supports the others.",
        ],
      },
      offers: [
        {
          title: "Co-op funding",
          body: "We identify the manufacturer and utility co-op programs you qualify for, build compliant campaigns and prepare the claims, so you use the funds available to you.",
        },
        {
          title: "Incentive travel",
          body: "Incentive trips and rewards programs for dealers, sales teams and technicians, planned and run by our corporate events team from destination to on-site hosting.",
        },
        {
          title: "HVAC business growth strategies",
          body: "Market and competitor reviews, growth planning for new service areas or product lines, and marketing plans that match the growth targets you set.",
        },
      ],
      deliverables: [
        "Co-op program review and annual co-op plan",
        "Co-op compliant campaigns and claim preparation",
        "Incentive program design and qualification rules",
        "Destination sourcing, travel and on-site management",
        "Market and competitor analysis",
        "Growth and marketing plan with budgets",
        "Quarterly reviews against targets",
      ],
      benefits: [
        {
          title: "Money left on the table, found",
          body: "Co-op funds that would otherwise go unclaimed go back into your marketing.",
        },
        {
          title: "Performance worth rewarding",
          body: "Incentive travel gives dealers and teams a clear goal and a memorable reward.",
        },
        {
          title: "A plan the whole team can see",
          body: "Growth targets, budgets and marketing tied together in one plan.",
        },
      ],
      applications: [
        "Planning a year of co-op funded advertising for a multi-brand dealer",
        "A manufacturer's dealer incentive trip for top-selling partners",
        "Expanding into a new city or adding a new product line",
        "Aligning marketing spend with revenue goals before the busy season",
      ],
      approach: [
        { title: "Review", body: "Current marketing, co-op programs and growth goals." },
        { title: "Plan", body: "Co-op, incentives and strategy combined in one annual plan." },
        { title: "Run", body: "Campaigns, claims and incentive programs managed for you." },
        { title: "Review again", body: "Results measured each quarter and the plan updated." },
      ],
      gallery: [
        { src: `${UP}/2026/04/hotel-riu-vallarta-1.jpg`, alt: "A beachfront resort pool lined with palm trees" },
        { src: `${UP}/2024/07/conference-mexico.webp`, alt: "Two cocktails on the edge of a resort pool" },
        { src: `${UP}/2026/02/fortisbc-coop-hvac-marketing.jpg`, alt: "A ductless heat pump head mounted on a white wall" },
      ],
      related: [
        { label: "Corporate events & incentive travel", href: "/corporate-events/" },
        { label: "Business development", href: "/services/business-development/" },
        { label: "HVAC marketing strategies guide", href: "/hvac-marketing-strategies-guide/" },
      ],
    },
  ],
};
