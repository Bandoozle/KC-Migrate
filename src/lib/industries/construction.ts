import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const CONSTRUCTION: Industry = {
  id: "construction",
  name: "Construction Marketing",
  noun: "construction",
  path: "/services/construction-marketing/",
  offersIntro: {
    label: "What we offer",
    title: "Three services for builders and contractors.",
    lead: "A website that wins the shortlist, social media that shows the work, and content that proves you know the trade.",
  },
  cta: {
    title: "Let's build your pipeline.",
    description: "Tell us about the projects you want more of. We'll plan the marketing to bring them in.",
  },
  landing: {
    seo: {
      title: "Construction Marketing for Builders & Contractors | Kosick Communications",
      description:
        "Construction marketing for home builders, renovators and contractors: website design, social media and content development that win better projects.",
    },
    hero: {
      label: "Construction marketing",
      title: "Construction Marketing",
      lead: "Marketing for home builders, renovators and contractors: websites that make the shortlist, social media that shows the work in progress, and content that proves you know the trade.",
      image: { src: `${UP}/2023/06/services.jpg`, alt: "A rendering of a modern timber and stone home in tall grass" },
    },
    intro: {
      title: "Your work is the best sales tool you have.",
      paragraphs: [
        "Construction clients are making one of the largest purchases of their lives. Before they call, they look at your past projects, check your reviews and decide whether you seem organized, skilled and trustworthy.",
        "Our job is to make that judgment easy. We show your finished work and your process, explain your services clearly and make it simple to request a consultation, so the enquiries you get are for the projects you actually want.",
      ],
    },
    reasons: [
      {
        title: "Long, considered decisions",
        body: "Clients research for months, so your website and content have to answer questions before the first meeting.",
      },
      {
        title: "Proof over promises",
        body: "Project galleries, progress updates and process content show quality better than any claim.",
      },
      {
        title: "The right projects",
        body: "We target the work you want more of, whether that's custom homes, renovations or commercial builds.",
      },
      {
        title: "Built for busy crews",
        body: "We collect photos and stories from site so marketing keeps going while your team builds.",
      },
    ],
    gallery: [
      { src: `${UP}/2023/09/construction-marketing.png`, alt: "A finished bedroom with built-in bunk beds and the Padwood Construction logo" },
      { src: `${UP}/2023/06/real-estate-design-1.jpg`, alt: "A modern home with a glass balcony above a pool" },
      { src: `${UP}/2026/02/home-services-marketing.jpg`, alt: "A modern two-storey home with a glass garage door" },
    ],
    reading: [
      { label: "Website development & e-commerce", href: "/services/website-development/" },
      { label: "Our marketing results", href: "/marketing-results/" },
    ],
  },
  services: [
    {
      slug: "website-design",
      title: "Website Design & Development",
      summary: "Portfolio-led websites that show your best projects and turn visitors into consultation requests.",
      seo: {
        title: "Construction Website Design for Builders & Contractors | Kosick Communications",
        description:
          "Website design and development for home builders, renovators and contractors: project portfolios, service pages and consultation requests, by Kosick Communications.",
      },
      hero: {
        label: "Construction website design",
        title: "Let the finished work make the pitch.",
        lead: "Homeowners and developers shortlist builders online. We design construction websites around your best projects, explain your services and process clearly, and make requesting a consultation the obvious next step.",
        image: { src: `${UP}/2024/03/padwood-construction.webp`, alt: "The Padwood Construction website open on a laptop beside a plant" },
      },
      intro: {
        title: "Built to make the shortlist.",
        paragraphs: [
          "A prospective client may visit your website several times over weeks or months, often comparing you with two or three other builders. Each visit has to reinforce the same impression: quality work, a clear process and a team that's easy to work with.",
          "We build construction websites around project portfolios with real photography, service pages for each type of work and a consultation form that asks the right questions, so you can qualify leads before the first site visit.",
        ],
      },
      offers: [
        {
          title: "Project portfolios",
          body: "Project pages with photography, scope and before-and-after views, organized by type so visitors find the work most like theirs.",
        },
        {
          title: "Service & process pages",
          body: "Clear pages for custom homes, renovations, additions or commercial work, and an explanation of how a project runs from first meeting to handover.",
        },
        {
          title: "Consultation requests",
          body: "Enquiry forms that capture project type, budget range, location and timing, delivered to your inbox or CRM with tracking.",
        },
      ],
      deliverables: [
        "Site plan for services, projects and service areas",
        "Custom design for desktop, tablet and phone",
        "Project portfolio pages",
        "Service and process page copy",
        "Consultation and quote request forms",
        "Local SEO for the areas you build in",
        "Analytics and lead tracking",
      ],
      benefits: [
        {
          title: "Better-qualified leads",
          body: "Detailed forms and clear information filter out projects that don't fit.",
        },
        {
          title: "A portfolio that keeps growing",
          body: "Add new projects yourself as each job is finished.",
        },
        {
          title: "Credibility before the call",
          body: "Prospects arrive already confident in your work.",
        },
      ],
      applications: [
        "A renovation company replacing a dated site",
        "A custom home builder showcasing completed homes",
        "Adding service area pages for a new region",
        "Separating residential and commercial divisions",
      ],
      approach: [
        { title: "Discover", body: "The projects you want, the clients you serve and how you sell." },
        { title: "Plan", body: "Portfolio structure, service pages and lead qualification." },
        { title: "Design & build", body: "A site led by your photography and your process." },
        { title: "Launch & grow", body: "Tracking in place; new projects added as they finish." },
      ],
      gallery: [
        { src: `${UP}/2023/09/construction-marketing.png`, alt: "A finished bedroom with built-in bunk beds and the Padwood Construction logo" },
        { src: `${UP}/2023/06/real-estate.jpeg`, alt: "A bright living room opening onto a view of the ocean" },
      ],
      related: [
        { label: "Website development & e-commerce", href: "/services/website-development/" },
        { label: "Search engine optimization", href: "/services/search-engine-optimization/" },
      ],
    },
    {
      slug: "social-media",
      title: "Social Media Marketing",
      summary: "Progress photos, finished reveals and the people on site, shared where future clients are watching.",
      seo: {
        title: "Social Media Marketing for Construction Companies | Kosick Communications",
        description:
          "Social media marketing for builders, renovators and contractors: project content, community management and paid social that generate construction leads.",
      },
      hero: {
        label: "Construction social media marketing",
        title: "Every project is a story worth posting.",
        lead: "Groundbreaking, framing, the final walk-through: construction is made for social media. We turn your projects into content that builds a following and paid campaigns that reach people planning to build or renovate.",
        image: { src: `${UP}/2026/02/home-services-marketing.jpg`, alt: "A modern two-storey home with a glass garage door and stone steps" },
      },
      intro: {
        title: "Show the work while it happens.",
        paragraphs: [
          "Future clients want to see how you work, not only the finished photo. Progress updates, site walkthroughs and before-and-after reveals show your craftsmanship and your organization in a way a portfolio can't.",
          "We plan the content with you, gather photos and video from site without slowing the crew, and run targeted campaigns that reach homeowners and developers in the areas you build.",
        ],
      },
      offers: [
        {
          title: "Project content",
          body: "Progress posts, reveals and short videos from site, planned around your project schedule.",
        },
        {
          title: "Channel management",
          body: "Posting and community management on Instagram, Facebook, LinkedIn and YouTube, in your company's voice.",
        },
        {
          title: "Paid social campaigns",
          body: "Campaigns targeted by location, homeownership and interests to reach people planning a build or renovation.",
        },
      ],
      deliverables: [
        "Social strategy and content calendar",
        "On-site photo and video capture",
        "Post design, captions and scheduling",
        "Community management",
        "Paid social campaigns",
        "Lead forms and tracking",
        "Monthly reporting",
      ],
      benefits: [
        {
          title: "Proof of quality",
          body: "Real projects show craftsmanship better than any claim.",
        },
        {
          title: "Top of mind for referrals",
          body: "Past clients and partners see your work and pass your name on.",
        },
        {
          title: "Leads from the right areas",
          body: "Paid campaigns reach homeowners where you want to build.",
        },
      ],
      applications: [
        "Sharing a custom home build from foundation to handover",
        "Before-and-after renovation reveals",
        "Recruiting trades and site staff",
        "Promoting a show home or open house",
      ],
      approach: [
        { title: "Plan", body: "Projects to feature and the story of each one." },
        { title: "Capture", body: "Photos and video from site, on your schedule." },
        { title: "Publish & promote", body: "Organic posts and paid campaigns working together." },
        { title: "Report", body: "Reach, engagement and enquiries reviewed monthly." },
      ],
      gallery: [
        { src: `${UP}/2023/06/real-estate-design-1.jpg`, alt: "A modern home with a glass balcony above a pool" },
        { src: `${UP}/2026/06/social-media-content-marketing-1.jpg`, alt: "A social media analytics dashboard on a laptop" },
      ],
      related: [
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "Digital marketing", href: "/services/digital-marketing/" },
      ],
    },
    {
      slug: "content-development",
      title: "Content Development",
      summary: "Project case studies, guides and video that answer client questions and prove your expertise.",
      seo: {
        title: "Content Development for Construction Companies | Kosick Communications",
        description:
          "Content development for builders and contractors: project case studies, planning guides, photography and video that build trust and search visibility.",
      },
      hero: {
        label: "Construction content development",
        title: "Answer the questions before they're asked.",
        lead: "How long will it take? What will it cost? How do you handle permits? We create case studies, guides, photography and video that answer the questions construction clients ask, and show why you're the builder to trust.",
        image: { src: `${UP}/2023/06/KOSICK-MODEL-LOWER-LEVEL-MARCH-17-2023-ROUGH-2-1-e1686846929767.jpg`, alt: "An architectural rendering of a concrete home on a rocky hillside" },
      },
      intro: {
        title: "Expertise people can read, watch and share.",
        paragraphs: [
          "Construction clients research heavily before they commit. Content that explains the process, costs and choices honestly positions you as the expert and builds trust long before a contract is signed.",
          "We develop that content with you: project case studies, planning guides, renderings and video. It powers your website, your search visibility, your social channels and the materials your sales team hands to prospects.",
        ],
      },
      offers: [
        {
          title: "Case studies & project stories",
          body: "Write-ups of finished projects covering the brief, the challenges and the result, with photography and client quotes.",
        },
        {
          title: "Guides & articles",
          body: "Planning guides and articles on timelines, budgets, materials and permits that rank in search and help clients prepare.",
        },
        {
          title: "Photography, video & renderings",
          body: "Professional project photography, walkthrough video and presentation renderings for pre-sales and proposals.",
        },
      ],
      deliverables: [
        "Content strategy and topic plan",
        "Project case studies",
        "Planning guides and blog articles",
        "Project photography and video",
        "Renderings and presentation boards",
        "Proposal and sales materials",
        "Content for social and email",
      ],
      benefits: [
        {
          title: "Trust before the meeting",
          body: "Prospects arrive informed and confident in your expertise.",
        },
        {
          title: "Found in search",
          body: "Helpful articles bring in people researching their project.",
        },
        {
          title: "Sales materials that close",
          body: "Case studies and renderings support proposals and pre-sales.",
        },
      ],
      applications: [
        "Case studies for a builder's best projects",
        "A renovation planning guide for the website",
        "Pre-sale renderings for a new development",
        "Walkthrough videos of completed homes",
      ],
      approach: [
        { title: "Interview", body: "Your team's knowledge and your clients' common questions." },
        { title: "Plan", body: "Topics, formats and where each piece will be used." },
        { title: "Produce", body: "Writing, photography, video and renderings." },
        { title: "Distribute", body: "Published on the site, shared on social and used in sales." },
      ],
      gallery: [
        { src: `${UP}/2023/06/services.jpg`, alt: "A rendering of a modern timber and stone home in tall grass" },
        { src: `${UP}/2023/06/real-estate.jpeg`, alt: "A bright living room opening onto a view of the ocean" },
      ],
      related: [
        { label: "Creative & production", href: "/services/creative/" },
        { label: "Search engine optimization", href: "/services/search-engine-optimization/" },
      ],
    },
  ],
};
