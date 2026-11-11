/**
 * Curated Television Advertising page content.
 * Messaging inspired by premium TV service narratives; claims stay within
 * verified Kosick capabilities (FAQ, production, network relationships).
 */

export const TV_HERO = {
  displayTitle: "Put your brand",
  titleSecondary: "where your customers are watching.",
  subtitle:
    "From traditional television to premium streaming platforms, we help businesses reach the right audiences with creative campaigns built to make an impact.",
  cta: { label: "Plan Your TV Campaign", href: "/contact/" },
  secondaryCta: { label: "Let's Talk", href: "tel:+16049255800", icon: "phone" as const },
};

export const TV_CAPABILITIES = {
  title: "Big-screen impact. Smarter audience targeting.",
  lead:
    "Television advertising still earns attention in the living room. We make it practical for businesses that need creative, media planning, and clear campaign direction in one place.",
  items: [
    {
      id: "creative",
      title: "Creative production",
      body: "Commercial concepts, messaging, and production from our in-house team — concept through post — so the spot matches the brand and the buy.",
      image: {
        src: "/images/creative/reel-spot.jpg",
        alt: "A cinematic frame from a television commercial produced by Kosick",
        position: "72% 40%",
      },
    },
    {
      id: "planning",
      title: "Media planning",
      body: "Channel, placement, and audience selection across broadcast, cable, and streaming, planned as one schedule rather than disconnected buys.",
      image: {
        src: "/images/television/media-planning-broadcast.jpg",
        alt: "A live tennis broadcast on a television screen",
        position: "45% 50%",
      },
    },
    {
      id: "optimize",
      title: "Campaign optimization",
      body: "Performance review against your objectives, with refinements to media strategy as reporting and market conditions come into view.",
      image: {
        src: "/wp-content/uploads/2026/06/social-media-content-marketing-1.jpg",
        alt: "Campaign reporting charts on a laptop screen",
        position: "55% 40%",
      },
    },
  ],
};

export const TV_MODES = {
  title: "Traditional TV and Connected TV, explained simply.",
  lead:
    "Both put your brand on the big screen. The difference is how the audience is reached, how precisely you can focus the buy, and how results are reported.",
  /** The rows every format is compared on */
  aspects: [
    { id: "placement", label: "Placement" },
    { id: "targeting", label: "Targeting" },
    { id: "measurement", label: "Measurement" },
    { id: "bestFor", label: "Best for" },
  ],
  modes: [
    {
      id: "broadcast",
      label: "Broadcast TV",
      headline: "Scheduled television, trusted programming.",
      image: {
        src: "/images/television/service-broadcast.jpg",
        alt: "A live morning show on a broadcast television set",
        position: "50% 40%",
      },
      rows: {
        placement: "Broadcast and cable placements on established networks",
        targeting: "Regional and national reach through familiar dayparts and shows",
        measurement: "Reach and frequency alongside modern signals such as site lift and search correlation",
        bestFor: "Brand awareness that benefits from the credibility of live television",
      },
    },
    {
      id: "ctv",
      label: "Connected TV",
      headline: "Streaming environments with sharper focus.",
      image: {
        src: "/images/television/ctv-living-room-tsn.jpg",
        alt: "A streaming sports channel on a smart TV in a living room",
        position: "55% 35%",
      },
      rows: {
        placement: "Advertising inside supported streaming and smart-TV environments",
        targeting: "More specific audience and geographic targeting where the platform allows",
        measurement: "Digital-style campaign reporting that varies by publisher and buy",
        bestFor: "Television impact with digital targeting",
      },
    },
  ],
} as const;

export const TV_REACH = {
  title: "Reach the right households, in the right markets.",
  lead:
    "Strong television plans start with where your customers live and watch. We focus budget on the markets, audiences, and placements that support your business goals — then measure what the buy can tell us.",
  pillars: [
    {
      id: "markets",
      title: "Target markets",
      body: "Local flights, multi-market plans, or national weight — sized to the geography you serve.",
    },
    {
      id: "audience",
      title: "Audience selection",
      body: "Programming, dayparts, and streaming environments chosen for the people most likely to need you.",
    },
    {
      id: "placement",
      title: "Media placement",
      body: "Network and platform relationships used to secure airtime that fits the plan, not leftover inventory.",
    },
    {
      id: "measure",
      title: "Campaign measurement",
      body: "Reach and frequency alongside modern signals such as site lift and search correlation, tied to your objectives.",
    },
  ],
  /**
   * How the plan changes with the geography served. Markets and placement
   * change with the scope; audience and measurement stay as above.
   */
  scopes: [
    {
      id: "local",
      label: "Local flight",
      markets: "One market, such as Metro Vancouver, sized to the area you serve.",
      placement: "Local broadcast, with Connected TV targeted to the postal codes you serve.",
    },
    {
      id: "multi",
      label: "Multi-market",
      markets: "Several markets, weighted by where you sell and where you want to grow.",
      placement: "Regional broadcast, with Connected TV to fine-tune the weight in each market.",
    },
    {
      id: "national",
      label: "National",
      markets: "National weight, with extra presence in the markets that matter most.",
      placement: "National networks and streaming platforms, planned as one schedule.",
    },
  ],
};

/** Networks and platforms on the page, as cleaned transparent marks (same files, white removed). */
export const TV_NETWORKS = [
  { name: "CTV", src: "/images/television/networks/ctv.png" },
  { name: "Global", src: "/images/television/networks/global.png" },
  { name: "CBC", src: "/images/television/networks/cbc.png" },
  { name: "Sportsnet", src: "/images/television/networks/sportsnet.png" },
  { name: "TSN", src: "/images/television/networks/tsn.png" },
  { name: "CP24", src: "/images/television/networks/cp24.png" },
  { name: "Crave", src: "/images/television/networks/crave.png" },
  { name: "Bell", src: "/images/television/networks/bell.png" },
  { name: "Rogers", src: "/images/television/networks/rogers.png" },
  { name: "Pattison", src: "/images/television/networks/pattison.png" },
  { name: "NBC", src: "/images/television/networks/nbc.png" },
  { name: "CBS", src: "/images/television/networks/cbs.png" },
  { name: "FOX", src: "/images/television/networks/fox.png" },
  { name: "CNN", src: "/images/television/networks/cnn.png" },
  { name: "ESPN", src: "/images/television/networks/espn.png" },
  { name: "The CW", src: "/images/television/networks/the-cw.png" },
  { name: "HGTV", src: "/images/television/networks/hgtv.png" },
  { name: "Food Network", src: "/images/television/networks/food-network.png" },
  { name: "Golf Channel", src: "/images/television/networks/golf-channel.png" },
  { name: "E!", src: "/images/television/networks/e.png" },
] as const;

export const TV_BENEFITS = {
  title: "Why television still moves brands.",
  items: [
    {
      id: "recognition",
      title: "Build brand recognition",
      body: "Sight, sound, and motion on a living-room screen create memory that short scrolls rarely match.",
      image: {
        src: "/images/television/service-broadcast.jpg",
        alt: "Television advertising on a broadcast screen",
      },
    },
    {
      id: "reach",
      title: "Reach beyond search and social",
      body: "Meet people who are not actively searching yet — and stay present when they are ready to choose.",
      image: {
        src: "/images/television/ctv-living-room-tsn.jpg",
        alt: "Living-room television with sports programming",
      },
    },
    {
      id: "credibility",
      title: "Establish credibility and familiarity",
      body: "Appearing in premium programming and trusted networks signals a brand that belongs in the conversation.",
      image: {
        src: "/images/television/service-streaming.jpg",
        alt: "Streaming television advertising environment",
      },
    },
    {
      id: "support",
      title: "Support the wider campaign",
      body: "Television lifts digital, outdoor, and retail efforts by making every other touchpoint feel familiar.",
      image: {
        src: "/images/home/television-expedia-cruises-tv.jpg",
        alt: "Expedia Cruises television creative on screen",
      },
    },
  ],
};

export const TV_JOURNEY = {
  title: "From concept to screen.",
  lead: "A clear path from the first conversation to a commercial that airs — and a plan that can improve as reporting arrives.",
  stages: [
    {
      id: "discover",
      label: "Discover",
      title: "Understand the business, goals, and audience",
      body: "We start with what you sell, who you serve, and what success looks like before a single placement is proposed.",
    },
    {
      id: "plan",
      label: "Plan",
      title: "Develop the media and creative strategy",
      body: "Broadcast, Connected TV, and supporting channels are planned together so creative and media work as one idea.",
    },
    {
      id: "create",
      label: "Create",
      title: "Produce or prepare the commercial",
      body: "In-house concept, script, production, and finish — or adaptation of existing assets for air and streaming.",
    },
    {
      id: "launch",
      label: "Launch",
      title: "Coordinate campaign placements",
      body: "Schedules, trafficking, and network coordination so the spot lands where the audience is already watching.",
    },
    {
      id: "refine",
      label: "Refine",
      title: "Review reporting and find the next move",
      body: "Available reporting is reviewed against objectives so the next flight can be sharper than the last.",
    },
  ],
};

export const TV_WORK = {
  title: "Work built for the screen.",
  lead:
    "One commercial from concept to air. The same discipline — creative, placement, and cross-channel follow-through — applies whether the brand is industrial, consumer, or service.",
  featured: {
    client: "Trane",
    line: "It’s Hard To Stop A Trane.",
    caption: "Television commercial · Example of our work",
    poster: "/images/television/trane-poster.png",
    frames: [
      { src: "/images/television/spot-interface.png", alt: "Touchscreen control from the Trane television commercial" },
      { src: "/images/television/spot-scene.png", alt: "Live-action scene from the Trane television commercial" },
      { src: "/images/television/spot-title.png", alt: "Title treatment from the Trane television commercial", super: "We run together" },
      { src: "/images/television/spot-end.png", alt: "End frame from the Trane television commercial", super: "It’s Hard To Stop A Trane." },
    ],
  },
};

export const TV_START = {
  title: "Your next campaign starts here.",
  lead:
    "A short consultation covers goals, markets, and creative needs. From there we shape a strategy, prepare the commercial, and set the first flight in motion.",
  steps: [
    { title: "Consultation", body: "Share the business challenge and the audiences you need to reach." },
    { title: "Strategy", body: "We outline media options, creative direction, and a realistic flight plan." },
    { title: "Preparation", body: "Production and placements move together so launch day is ready, not rushed." },
  ],
  cta: { label: "Plan Your TV Campaign", href: "/contact/" },
};
