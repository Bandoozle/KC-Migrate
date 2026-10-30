import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const MEDICAL_DENTAL: Industry = {
  id: "medical-dental",
  name: "Medical & Dental Marketing",
  noun: "medical and dental",
  path: "/services/dental-marketing/",
  offersIntro: {
    label: "What we offer",
    title: "Four services for growing practices.",
    lead: "For dental offices, medical clinics and aesthetic practices. Open a service to see what we build and how it brings in new patients.",
  },
  cta: {
    title: "Let's grow your patient list.",
    description: "Tell us about your practice, the treatments you want to grow and the patients you want to reach.",
  },
  services: [
    {
      slug: "website-design",
      title: "Website Design & Development",
      summary: "Calm, credible practice websites with online booking that patients trust on the first visit.",
      seo: {
        title: "Medical & Dental Website Design | Kosick Communications",
        description:
          "Website design and development for dental offices and medical clinics: trustworthy, accessible practice websites with online booking, built by Kosick Communications.",
      },
      hero: {
        label: "Medical & dental website design",
        title: "The first visit happens on your website.",
        lead: "Patients judge a practice by its website before they ever see the waiting room. We build medical and dental websites that feel calm and credible, explain treatments clearly and make booking easy.",
        image: { src: `${UP}/2026/07/Dental-Web-Development.jpg`, alt: "A dental clinic website on a laptop resting on a grey sofa" },
      },
      intro: {
        title: "Trust is built before the appointment.",
        paragraphs: [
          "Choosing a dentist or a clinic is personal. New patients look for signs they'll be in good hands: real photos of the team and space, clear explanations of treatments, and an easy way to book or ask a question.",
          "We design practice websites around that decision. Each treatment gets a page that answers the questions patients actually ask, the booking path is never more than a tap away, and the site is fast, accessible and easy for your team to keep current.",
        ],
      },
      offers: [
        {
          title: "Practice websites",
          body: "Custom websites for dental offices, medical clinics and aesthetic practices, designed around your brand, your team and the patients you want to attract.",
        },
        {
          title: "Treatment & service pages",
          body: "Clear, plain-language pages for each treatment, written to answer patient questions and to rank for the searches people make in your area.",
        },
        {
          title: "Online booking & patient forms",
          body: "Booking, new-patient and enquiry forms connected to your practice systems, with click-to-call and directions on every mobile page.",
        },
      ],
      deliverables: [
        "Site plan for treatments, team and locations",
        "Custom design for desktop, tablet and phone",
        "Treatment page copy in plain language",
        "Online booking and new-patient forms",
        "Team, technology and office photography direction",
        "Accessibility and page speed checks",
        "Google Business Profile and analytics set-up",
      ],
      benefits: [
        {
          title: "A credible first impression",
          body: "A modern, considered site signals the same care patients can expect in the chair.",
        },
        {
          title: "Fewer phone calls for basics",
          body: "Hours, insurance, directions and booking are answered on the page.",
        },
        {
          title: "More of the right patients",
          body: "Treatment pages attract people searching for the services you want to grow.",
        },
      ],
      applications: [
        "Replacing a dated site before opening a second location",
        "Launching pages for implants, Invisalign or cosmetic treatments",
        "Adding online booking for hygiene appointments",
        "A new clinic that needs a site before its first day",
      ],
      approach: [
        { title: "Discover", body: "Your practice, your patients and the treatments you want to grow." },
        { title: "Plan", body: "Site structure, treatment pages and the booking path." },
        { title: "Design & build", body: "A calm, accessible site, tested on every device." },
        { title: "Launch & support", body: "Analytics in place, then updates as the practice grows." },
      ],
      gallery: [
        { src: `${UP}/2026/06/dental-clinic-branding.jpg`, alt: "A dental practice home page reading Luxury Dental Care in South Surrey" },
        { src: `${UP}/2026/07/Dental-Vancouver.jpg`, alt: "A dental spa reception with a gold tooth sculpture on the counter" },
      ],
      related: [
        { label: "Website development & e-commerce", href: "/services/website-development/" },
        { label: "Dental marketing article", href: "/blog-dental-marketing/" },
      ],
    },
    {
      slug: "google-ads-seo",
      title: "Google Ads & SEO",
      summary: "Show up when local patients search for a dentist or clinic, in paid results, the map and organic search.",
      seo: {
        title: "Google Ads & SEO for Dental and Medical Practices | Kosick Communications",
        description:
          "Google Ads, local SEO and Google Business Profile management for dental offices and medical clinics. Kosick helps practices appear when nearby patients search.",
      },
      hero: {
        label: "Google Ads & SEO for practices",
        title: "Be the practice patients find first.",
        lead: "When someone searches for a dentist near them or a clinic for a specific treatment, the practices at the top get the call. We put yours there with Google Ads, local SEO and a well-run Google Business Profile.",
        image: { src: `${UP}/2026/07/Dental-Marketing.jpg`, alt: "A Google search ad for a dental clinic on a phone, with map and review panels" },
      },
      intro: {
        title: "Search is where new patients start.",
        paragraphs: [
          "New residents, people with a toothache and patients researching a treatment all begin in the same place: a search on their phone. The practices that appear in the ads, the map pack and the first organic results win most of those calls.",
          "We manage all three together. Google Ads bring immediate visibility for the treatments you want to grow, local SEO builds rankings that last, and your Google Business Profile turns searches into calls, directions and booked visits.",
        ],
      },
      offers: [
        {
          title: "Google Ads",
          body: "Search campaigns by treatment and location, with ad copy written to your regulatory college's advertising standards and call and booking tracking.",
        },
        {
          title: "Local SEO",
          body: "Technical fixes, treatment and location pages, and local citations that help your practice rank in the map pack and organic results.",
        },
        {
          title: "Google Business Profile & reviews",
          body: "Profile set-up and upkeep, photos, posts and a simple process for asking happy patients for reviews.",
        },
      ],
      deliverables: [
        "Search and competitor audit",
        "Keyword plan by treatment and location",
        "Google Ads set-up, management and budgets",
        "Landing pages for key treatments",
        "On-page and technical SEO",
        "Google Business Profile optimization",
        "Review request process",
        "Monthly reporting on calls, bookings and cost",
      ],
      benefits: [
        {
          title: "Visible right away",
          body: "Ads put you on the first screen while SEO builds longer-term rankings.",
        },
        {
          title: "Spend where it counts",
          body: "Budgets follow the treatments and locations that bring in valuable patients.",
        },
        {
          title: "Reputation that helps you rank",
          body: "A steady flow of genuine reviews supports both trust and map visibility.",
        },
      ],
      applications: [
        "Filling hygiene schedules at a newly opened office",
        "Growing implant, orthodontic or cosmetic cases",
        "Ranking a second location in a nearby city",
        "Promoting a medical aesthetics clinic's signature treatments",
      ],
      approach: [
        { title: "Audit", body: "Your search presence, competitors and current campaigns." },
        { title: "Plan", body: "Treatments, locations and budgets ranked by value." },
        { title: "Launch", body: "Ads, landing pages and SEO work rolled out together." },
        { title: "Optimize", body: "Calls and bookings reviewed monthly; budgets shifted to what works." },
      ],
      gallery: [
        { src: `${UP}/2026/07/Dental-Lead-Generation.jpg`, alt: "A hygienist with a patient in a modern dental operatory" },
        { src: `${UP}/2026/06/dental-marketing.jpg`, alt: "A dental hygienist preparing to treat a patient" },
      ],
      related: [
        { label: "Search engine optimization", href: "/services/search-engine-optimization/" },
        { label: "Digital marketing", href: "/services/digital-marketing/" },
        { label: "Medical marketing in Vancouver", href: "/medical-marketing-vancouver/" },
      ],
    },
    {
      slug: "social-media-content",
      title: "Social Media, Content & AI Marketing",
      summary: "Social channels, patient-friendly content and AI tools that keep your practice familiar and easy to reach.",
      seo: {
        title: "Social Media, Content & AI Marketing for Practices | Kosick Communications",
        description:
          "Social media management, patient education content and AI marketing tools for dental offices and medical clinics, from Kosick Communications.",
      },
      hero: {
        label: "Social media, content & AI marketing",
        title: "Familiar faces before the first appointment.",
        lead: "Patients choose people they feel they know. We help practices share their team, their space and their expertise on social media, publish content that educates, and use AI tools to answer questions around the clock.",
        image: { src: `${UP}/2026/07/Social-Media-Dental.jpg`, alt: "A collage of dental spa social posts: the reception, a gold tooth and a toothbrush" },
      },
      intro: {
        title: "Social proof for a personal decision.",
        paragraphs: [
          "Most people feel some nerves about a medical or dental visit. Seeing the team, the office and real explanations of treatments makes the decision easier, and it keeps existing patients connected between visits.",
          "We plan and produce the content, run the channels and add AI tools where they genuinely help, such as a website assistant that answers common questions and routes booking requests to your front desk.",
        ],
      },
      offers: [
        {
          title: "Social media management",
          body: "Content calendars, photography and video of your team and space, posting and community management on Instagram, Facebook and TikTok.",
        },
        {
          title: "Patient education content",
          body: "Articles, treatment explainers and short videos that answer common questions in plain language, written to your profession's advertising standards.",
        },
        {
          title: "AI marketing tools",
          body: "Website chat assistants that answer hours, services and booking questions, plus AI-assisted content workflows reviewed by your team before anything is published.",
        },
      ],
      deliverables: [
        "Social strategy and monthly content calendar",
        "Photo and video shoots at the practice",
        "Post design, captions and scheduling",
        "Paid social campaigns for key treatments",
        "Blog articles and treatment explainers",
        "Website AI assistant set-up and tuning",
        "Monthly reporting",
      ],
      benefits: [
        {
          title: "Less anxiety, more bookings",
          body: "Patients who have seen your team and space feel more comfortable booking.",
        },
        {
          title: "Expertise on display",
          body: "Educational content positions your clinicians as trusted local experts.",
        },
        {
          title: "Answers at any hour",
          body: "AI assistants handle common questions so your front desk can focus on patients in the room.",
        },
      ],
      applications: [
        "Introducing a new associate or hygienist",
        "Explaining a treatment such as clear aligners or skin rejuvenation",
        "Promoting a referral or new-patient offer",
        "Answering after-hours questions on the website",
      ],
      approach: [
        { title: "Get to know you", body: "Your team, your patients and what makes the practice different." },
        { title: "Plan", body: "Themes, formats and a calendar that fits your schedule." },
        { title: "Create", body: "On-site shoots, posts, articles and AI tools, reviewed by you." },
        { title: "Grow", body: "Engagement and enquiries measured, and the plan refined." },
      ],
      gallery: [
        { src: `${UP}/2026/02/aesthetic-clinic-marketing.jpg`, alt: "SkinCeuticals serums lined up with a dropper above them" },
        { src: `${UP}/2026/02/medical-skincare-marketing.jpg`, alt: "A skincare bottle resting on rippled blue water" },
      ],
      related: [
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "Email marketing", href: "/services/email-marketing/" },
      ],
    },
    {
      slug: "video-tv-billboard-advertising",
      title: "Video, TV & Billboard Advertising",
      summary: "Video, television and outdoor campaigns that make your practice a familiar name across the community.",
      seo: {
        title: "Video, TV & Billboard Advertising for Clinics | Kosick Communications",
        description:
          "Video production, television and billboard advertising for dental offices and medical clinics. Kosick builds local visibility for practices across Canada.",
      },
      hero: {
        label: "Video, TV & billboard advertising",
        title: "Make your practice a local landmark.",
        lead: "Search captures patients who are already looking. Video, television and outdoor advertising make your practice the name the whole community knows, so you're the first choice when they are ready.",
        image: { src: `${UP}/2026/06/outdoor-advertising.jpg`, alt: "A Sparkle Dental Spa poster with a bright smile in a transit shelter" },
      },
      intro: {
        title: "Visibility beyond the search results.",
        paragraphs: [
          "Practices that grow fastest are often the ones people recognize from the bus shelter, a local TV segment or a video in their feed. Familiarity lowers the barrier to that first booking.",
          "We produce practice videos and commercials, plan television and streaming placements, and place outdoor ads near your office and along the routes your patients travel.",
        ],
      },
      offers: [
        {
          title: "Practice video production",
          body: "Team introductions, office tours, treatment explainers and patient stories, shot professionally and edited for your website, social channels and ads.",
        },
        {
          title: "Television & streaming",
          body: "Local broadcast, connected TV and streaming placements targeted to the neighbourhoods around your practice.",
        },
        {
          title: "Billboard & transit advertising",
          body: "Transit shelters, billboards and digital boards near your office, with creative that's simple, warm and readable in a glance.",
        },
      ],
      deliverables: [
        "Campaign concept and scripts",
        "On-site video production and editing",
        "TV spots and streaming versions",
        "Broadcast and connected TV media plans",
        "Billboard and transit creative",
        "Outdoor media planning and booking",
        "Campaign reporting",
      ],
      benefits: [
        {
          title: "Recognized in the neighbourhood",
          body: "Repeated local exposure makes your practice the familiar choice.",
        },
        {
          title: "Warmth that photos can't show",
          body: "Video lets patients meet your team and see your space before they arrive.",
        },
        {
          title: "Every channel supports search",
          body: "A familiar name stands out in search results when patients are ready to book.",
        },
      ],
      applications: [
        "Announcing a new or relocated practice",
        "Transit shelter ads within a few blocks of the office",
        "A team introduction video for the website and social media",
        "Connected TV campaigns for a cosmetic or aesthetic treatment",
      ],
      approach: [
        { title: "Concept", body: "One clear idea and message for the campaign." },
        { title: "Produce", body: "Video shoots and outdoor creative made in your brand." },
        { title: "Place", body: "TV, streaming and outdoor booked around your location." },
        { title: "Measure", body: "Reach, branded searches and new patient trends tracked." },
      ],
      gallery: [
        { src: `${UP}/2026/02/ctv-morning-live.jpg`, alt: "Two people talking on the set of a Vancouver morning television show" },
        { src: `${UP}/2023/09/medical-aesthetics.png`, alt: "A Skinfolio ad with SkinCeuticals bottles in black and white" },
        { src: `${UP}/2026/07/Vancouver-Dental-Marketing.jpg`, alt: "A dental instrument tray with protective glasses" },
      ],
      related: [
        { label: "Television advertising", href: "/services/television-advertising/" },
        { label: "Outdoor advertising", href: "/services/outdoor-advertising/" },
        { label: "Creative & production", href: "/services/creative/" },
      ],
    },
  ],
};
