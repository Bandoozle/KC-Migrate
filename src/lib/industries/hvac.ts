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
    wideImage: { src: `${UP}/2026/03/hvac-marketing-strategies.jpg`, alt: "A heat pump on a stand beside a modern house in the trees", position: "50% 70%" },
  },
  offersIntro: {
    label: "What we offer",
    title: "Five ways to bring in more HVAC enquiries.",
    lead: "From HVAC website development and Google Ads to television, billboards and co-op programs. Each service has its own page with the detail: what we build, how it runs and where it fits in a dealer's year.",
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
      card: { src: `${UP}/2026/03/hvac-web-development.png`, alt: "The Neels Heating & Cooling website open on a laptop", position: "50% 70%" },
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
          title: "Built to turn traffic into calls",
          body: "Clear paths to call or book make it easier for existing visitors to request service.",
          visual: "calls",
        },
        {
          title: "Campaigns that land somewhere",
          body: "Search, social and co-op campaigns point to pages built for that offer, not a generic home page.",
          visual: "campaigns",
        },
        {
          title: "A site your team can update",
          body: "Change offers, seasonal promotions and rebates yourself, without waiting on a developer.",
          visual: "editor",
        },
      ],
      applications: [
        { title: "Rebuild for mobile", body: "Replacing an outdated dealer site that doesn't work on phones", icon: "phone" },
        { title: "Rebate & tune-up pages", body: "Launching landing pages for heat pump rebates or seasonal tune-ups", icon: "rebate" },
        { title: "Book maintenance online", body: "Adding online booking for maintenance plans", icon: "calendar" },
        { title: "Pages for new areas", body: "Building location pages as you expand into new service areas", icon: "pin" },
      ],
      approach: [
        { title: "Discover", body: "Your services, margins, service areas and the jobs you want more of." },
        { title: "Plan", body: "Sitemap, page content and the conversion path for each service." },
        { title: "Design & build", body: "A custom site, tested on the phones and browsers your customers use." },
        { title: "Launch & improve", body: "Tracking from day one, then refinements based on calls and bookings." },
      ],
      gallery: [
        { src: "/images/hvac-marketing/feature-strategies.jpg", alt: "The Cool Comfort Solutions website on a laptop" },
        { src: `${UP}/2023/09/hvac-website-development.png`, alt: "The DirectBuy Furnace website hero with flame and snowflake icons" },
      ],
      related: [
        { label: "HVAC Website Development Guide", href: "/blog-hvac-website-development/", kind: "guide", body: "What an HVAC site needs to educate homeowners and generate leads." },
        { label: "Search Engine Optimization", href: "/services/search-engine-optimization/", kind: "service", body: "Organic rankings that bring qualified leads to the pages you build." },
        { label: "Website Development & E-commerce", href: "/services/website-development/", kind: "service", body: "Custom WordPress and e-commerce builds, with design and ongoing support." },
      ],
    },
    {
      slug: "digital-advertising",
      title: "Digital Advertising",
      summary: "Google Ads, Local Service Ads and paid social, targeted to homeowners in your service area and built to generate HVAC leads.",
      seo: {
        title: "HVAC Google Ads & Digital Advertising | Kosick Communications",
        description:
          "Google Ads, Local Service Ads and paid social for HVAC dealers. Kosick builds digital advertising that turns homeowner searches into calls and service enquiries.",
      },
      hero: {
        label: "HVAC digital advertising & lead generation",
        title: "Be the first result when the furnace quits.",
        lead: "Homeowners with no heat search, compare for a minute and call. We put your company at the top of that search with Google Ads and Local Service Ads, reach the rest of your market with paid social, and track every call and form back to the campaign.",
        image: { src: `${UP}/2026/06/hvac-social-media-marketing-1.jpg`, alt: "HVAC social media ads on a phone beside a printed card" },
      },
      card: { src: `${UP}/2026/06/hvac-lead-generation-1.jpg`, alt: "An HVAC energy efficiency ad on a phone beside a printed flyer" },
      intro: {
        title: "Turn high-intent searches into service enquiries.",
        paragraphs: [
          "Most HVAC jobs start with a search: furnace repair near me, heat pump installers, AC not cooling. Paid search and Local Service Ads put your company in front of homeowners at that moment, in the areas you serve and the hours you can answer.",
          "Paid social does the longer work. Facebook, Instagram and YouTube keep your offers and rebates in front of homeowners before they need you, and retarget the ones who visited your site. Content and automated follow-up support both, so an enquiry made at 10 p.m. still reaches your team.",
        ],
      },
      offers: [
        {
          title: "Google Ads & Local Service Ads",
          body: "Search campaigns for the jobs you want more of, from emergency repair to heat pump installs, with call extensions, service-area targeting and ad schedules that follow your hours.",
        },
        {
          title: "Paid social & audience targeting",
          body: "Facebook, Instagram and YouTube campaigns targeted by location, home ownership and season, with retargeting for homeowners who have already visited your site.",
        },
        {
          title: "Lead capture & follow-up",
          body: "Landing pages, call tracking, AI chat on your website and automated email follow-up, so every call and form is captured and attributed to the campaign that produced it.",
        },
      ],
      deliverables: [
        "Keyword and service-area plan",
        "Google Ads and Local Service Ads set-up and management",
        "Paid social campaigns with service-area targeting",
        "Retargeting audiences",
        "Landing pages for seasonal offers and rebates",
        "Call tracking and form tracking",
        "Website AI chat assistant and automated follow-up",
        "Monthly reporting on calls, forms and cost per lead",
      ],
      benefits: [
        {
          title: "Found at the moment of need",
          body: "Search ads put your number in front of homeowners who are ready to call.",
        },
        {
          title: "Know which campaigns bring in leads",
          body: "Calls and forms are tracked by campaign, so budget follows what works.",
        },
        {
          title: "Present between emergencies",
          body: "Paid social and content keep your name familiar through the quiet months.",
        },
      ],
      applications: [
        "Emergency furnace and AC repair campaigns",
        "Heat pump installation and rebate promotions",
        "Pre-season tune-up and maintenance plan offers",
        "Launching ads in a new service area",
      ],
      approach: [
        { title: "Research", body: "The jobs you want, your service area and what homeowners search for." },
        { title: "Build", body: "Campaigns, landing pages and call and form tracking." },
        { title: "Launch", body: "Search and social live, timed to the heating and cooling seasons." },
        { title: "Optimize", body: "Budget moved to the keywords and audiences that produce enquiries." },
      ],
      gallery: [
        { src: `${UP}/2026/06/hvac-lead-generation-1.jpg`, alt: "An HVAC energy efficiency ad on a phone beside a printed flyer" },
        { src: "/images/hvac-marketing/tab-facebook.jpg", alt: "Facebook ads for an HVAC dealer" },
        { src: `${UP}/2026/02/hvac-digital-marketing.webp`, alt: "A Daikin heat pump on a patio beside a fire table" },
      ],
      related: [
        { label: "HVAC Digital Marketing", href: "/hvac-digital-marketing/", kind: "guide", body: "Google Ads, Meta, connected TV and the funnels that turn them into leads." },
        { label: "Digital Marketing", href: "/services/digital-marketing/", kind: "service", body: "Google Ads, paid social and pre-roll, measured against results." },
        { label: "Social Media Marketing", href: "/services/social-media-marketing/", kind: "service", body: "Content, platform management and paid social across every channel." },
      ],
    },
    {
      slug: "video-tv-advertising",
      title: "Television & Streaming Advertising",
      summary: "Broadcast TV, connected TV and streaming commercials, produced and placed so homeowners know your name before they need you.",
      seo: {
        title: "HVAC Television & Streaming Advertising | Kosick Communications",
        description:
          "TV, connected TV and streaming commercials for HVAC dealers. Kosick produces the spots and buys the media, so homeowners know you before they need a new system.",
      },
      hero: {
        label: "HVAC television & streaming advertising",
        title: "Earn trust on the biggest screen in the house.",
        lead: "Television and streaming show your people, your trucks and your work. We produce HVAC commercials and place them on broadcast TV, connected TV and streaming services so homeowners know you before they need you.",
        image: { src: `${UP}/2026/01/media-buying.jpg`, alt: "A Trane commercial on a wall-mounted TV in a living room" },
      },
      card: { src: `${UP}/2026/01/media-buying.jpg`, alt: "A Trane commercial on a wall-mounted TV in a living room" },
      intro: {
        title: "Reach the homeowners who aren't searching yet.",
        paragraphs: [
          "A search ad catches the homeowner who is already looking. Television and streaming reach the much larger group who will need a new system in the next year or two, and they show the people behind the company.",
          "We handle the whole campaign: the idea, the shoot, the edit and the media plan across broadcast TV, connected TV and streaming, with versions sized for every placement and connected TV targeted to the postal codes you serve.",
        ],
      },
      offers: [
        {
          title: "Broadcast television",
          body: "Local and regional TV plans built around your service area and season, negotiated and booked by our media team, with reporting on delivery.",
        },
        {
          title: "Connected TV & streaming",
          body: "Streaming commercials targeted to homeowners by region and postal code, with reporting on completed views and website visits.",
        },
        {
          title: "Commercial production",
          body: "Scripts, shoots and edits that feature your technicians, trucks and customers, with :30, :15 and :06 versions and cut-downs for YouTube and social.",
        },
      ],
      deliverables: [
        "Campaign concept and scripts",
        "Production: crew, casting, locations and shoot",
        "Editing, colour, sound and voice-over",
        ":30, :15 and :06 versions for TV and streaming",
        "Broadcast and connected TV media plans",
        "Negotiated media placements",
        "YouTube and social video cut-downs",
        "Delivery and response reporting",
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
          body: "A single production supplies TV spots, streaming ads and social clips.",
        },
      ],
      applications: [
        "A brand campaign introducing a family-owned dealer to a growing market",
        "Pre-season heating and cooling spots",
        "Connected TV targeted to homeowners in your postal codes",
        "Manufacturer co-op commercials where eligible",
      ],
      approach: [
        { title: "Concept", body: "The message, the audience and how the campaign will look." },
        { title: "Produce", body: "Script, shoot and edit, with your team on camera where it helps." },
        { title: "Place", body: "Broadcast, connected TV and streaming booked to your plan." },
        { title: "Report", body: "Delivery, reach and response tracked through the campaign." },
      ],
      gallery: [
        { src: "/images/hvac-marketing/video-poster.jpg", alt: "The Belyea Bros. Heating & Cooling logo on red, from the This is Belyea campaign" },
        { src: "/images/television/trane-poster.png", alt: "A Trane air conditioner lit in green on a dark stage, from a Trane commercial" },
        { src: "/images/hvac-marketing/tab-youtube.jpg", alt: "A Daikin heat pump with a YouTube play button" },
      ],
      related: [
        { label: "Television Advertising", href: "/services/television-advertising/", kind: "service", body: "Broadcast TV campaigns, planned and bought by our media team." },
        { label: "Digital & Connected TV", href: "/services/digital-connected-tv/", kind: "service", body: "Streaming and connected TV with targeted reach and measurable delivery." },
        { label: "Media Buying: TV, Streaming & Radio", href: "/blog-media-buying-canada-tv-streaming-radio/", kind: "guide", body: "How broadcast, streaming and radio inventory is bought in key Canadian markets." },
      ],
    },
    {
      slug: "outdoor-advertising",
      title: "Outdoor Advertising & Billboards",
      summary: "Billboards and outdoor placements on the routes homeowners drive, building local awareness across your service area.",
      seo: {
        title: "HVAC Billboard & Outdoor Advertising | Kosick Communications",
        description:
          "Billboard and outdoor advertising for HVAC dealers: placements across your service area, brand-consistent creative and media funded by manufacturer co-op programs.",
      },
      hero: {
        label: "HVAC outdoor advertising & billboards",
        title: "Be the name homeowners already know.",
        lead: "When a furnace fails, homeowners call the company they remember. We put your name on the routes they drive every day, with billboards and outdoor placements across your service area, and fund more of the media with co-op.",
        image: { src: `${UP}/2023/07/hvac.jpg`, alt: "An Ayotte Plumbing & Heating billboard for a Comfortmaker furnace" },
      },
      card: { src: `${UP}/2023/07/hvac.jpg`, alt: "An Ayotte Plumbing & Heating billboard for a Comfortmaker furnace" },
      intro: {
        title: "Recognition is decided before the emergency.",
        paragraphs: [
          "Heating and cooling is a category homeowners rarely think about until they need it. The dealers who get the call are the ones whose name, colours and promise were already familiar.",
          "Billboards build that familiarity across a whole service area. We choose placements on the commuter routes and main roads your customers use, design creative that reads in a few seconds and stays consistent with your trucks and website, and use manufacturer and utility co-op programs to pay for more of it.",
        ],
      },
      offers: [
        {
          title: "Billboard advertising",
          body: "Static and digital boards chosen for traffic through your service area, with creative designed to be read in a few seconds from the road.",
        },
        {
          title: "Outdoor placements across your markets",
          body: "Transit shelters, street-level posters and superboards planned around the neighbourhoods you serve and the markets you want to grow into.",
        },
        {
          title: "Brand creative & co-op",
          body: "Creative that carries your brand from the truck to the billboard, built to manufacturer and utility co-op rules so more of the media is reimbursed.",
        },
      ],
      deliverables: [
        "Service-area and route planning",
        "Billboard and outdoor media planning and booking",
        "Billboard, transit and poster creative",
        "Brand guidelines for trucks, uniforms and signage",
        "Co-op eligible creative for your brands",
        "Co-op claim documentation and proof of performance",
        "Installation photos and campaign reporting",
      ],
      benefits: [
        {
          title: "Remembered when it counts",
          body: "Repeated exposure on daily routes puts your name first when the system breaks down.",
        },
        {
          title: "Media budgets that go further",
          body: "Co-op programs can reimburse part of qualifying advertising for the brands you carry.",
        },
        {
          title: "One look everywhere",
          body: "Boards, trucks, the website and your ads read as the same company.",
        },
      ],
      applications: [
        "Billboards on the commuter routes into a new service area",
        "Pre-season awareness before the first cold snap",
        "Manufacturer co-op campaigns for Trane, Daikin, Comfortmaker and other brands",
        "Refreshing a family business brand on the road",
      ],
      approach: [
        { title: "Map", body: "Your service area, the routes homeowners drive and the co-op programs you qualify for." },
        { title: "Plan & book", body: "Locations and formats negotiated to your budget." },
        { title: "Design", body: "Creative made for distance, speed and your brand." },
        { title: "Post & claim", body: "Boards in market, photographed and reported, with co-op documentation prepared." },
      ],
      gallery: [
        { src: `${UP}/2026/06/hvac-billboard-advertising.jpg`, alt: "A Belyea Bros. heat pump billboard above a Toronto street corner" },
        { src: `${UP}/2023/07/home-services-billboards.jpg`, alt: "A GE residential HVAC billboard against a blue sky" },
        { src: `${UP}/2023/07/outdoor-advertising-1-scaled.jpg`, alt: "A Trane We Run Together billboard between office towers" },
      ],
      related: [
        { label: "FortisBC Co-op Advertising for HVAC", href: "/hvac-marketing-fortisbc-co-op-advertising/", kind: "guide", body: "Using FortisBC co-op funding to pay for more of your media." },
        { label: "Outdoor Advertising", href: "/services/outdoor-advertising/", kind: "service", body: "Billboard, transit and digital out-of-home, planned and bought across Canada." },
        { label: "Corporate Branding", href: "/services/corporate-branding/", kind: "service", body: "Brand strategy and identity systems, built to last." },
      ],
    },
    {
      slug: "business-growth",
      title: "HVAC Growth Solutions",
      summary: "Manufacturer co-op programs, dealer growth strategy, business development and incentive travel for long-term growth.",
      seo: {
        title: "HVAC Business Growth & Co-op Programs | Kosick Communications",
        description:
          "Co-op funding, incentive travel programs and business growth strategy for HVAC dealers and manufacturers, from Kosick Communications.",
      },
      hero: {
        label: "HVAC growth solutions",
        title: "Grow the business, not only the leads.",
        lead: "Beyond campaigns, we help HVAC dealers and manufacturers find the money, motivation and plan to grow: manufacturer co-op programs, business development, incentive travel that rewards top performers, and a long-term marketing strategy for the next stage.",
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
        { label: "HVAC Dealer Marketing Guide", href: "/hvac-marketing-strategies-guide/", kind: "guide", body: "Cost-efficient lead generation for dealers, manufacturers and distributors." },
        { label: "Corporate Events & Incentive Travel", href: "/corporate-events/", kind: "service", body: "Events, conferences and group incentive trips, planned end to end." },
        { label: "Business Development", href: "/services/business-development/", kind: "service", body: "Growth strategy, sales training and acquisition support." },
      ],
    },
  ],
};
