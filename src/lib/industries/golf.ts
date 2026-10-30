import type { Industry } from "./types";

const UP = "/wp-content/uploads";

export const GOLF: Industry = {
  id: "golf",
  name: "Golf Marketing",
  noun: "golf",
  path: "/services/golf-marketing/",
  directory: {
    line: "Rounds, memberships and tournaments for courses and clubs.",
    image: { src: `${UP}/2026/03/golf-course-branding.jpg`, alt: "A golfer walking a sunlit fairway with his bag" },
  },
  offersIntro: {
    label: "What we offer",
    title: "Four services, one full season.",
    lead: "Websites, brand, broadcast and social for clubs, courses and resorts. Each one has its own page.",
  },
  cta: {
    title: "Let's fill the tee sheet.",
    description: "Tell us about your course, your members and your season. We'll plan the marketing around it.",
  },
  services: [
    {
      slug: "website-design",
      title: "Website Design & Development",
      summary: "Course websites that sell the experience and make booking a tee time, event or membership easy.",
      seo: {
        title: "Golf Course Website Design & Development | Kosick Communications",
        description:
          "Website design and development for golf courses, clubs and resorts, with tee time booking, membership, event and dining pages, by Kosick Communications.",
      },
      hero: {
        label: "Golf course website design",
        title: "Your course, one click from the first tee.",
        lead: "A golf website has to sell the experience and handle the logistics. We build course and club websites that show the layout at its best and make tee times, memberships, events and dining easy to book.",
        image: { src: `${UP}/2026/03/website-development-e-commerce.jpg`, alt: "A golf course website with a fairway hero image on a laptop" },
      },
      card: { src: `${UP}/2026/02/arizona-golf-course-marketing.jpg`, alt: "An aerial view of a desert golf course below a mountain ridge" },
      intro: {
        title: "Built for golfers, members and planners.",
        paragraphs: [
          "Your website serves very different visitors. Daily-fee golfers want a tee time, members want the calendar, and event planners want to know if you can host their tournament or wedding.",
          "We design for each of them: a clear path to booking, a course tour that does the layout justice, and pages for memberships, events, lessons and the restaurant that answer questions before the phone rings.",
        ],
      },
      offers: [
        {
          title: "Course & club websites",
          body: "Custom websites with course tours, hole-by-hole pages, photography and video that capture what makes your course worth the drive.",
        },
        {
          title: "Tee time & booking integration",
          body: "Your tee sheet, lesson and event booking systems connected cleanly to the site, with booking buttons where golfers expect them.",
        },
        {
          title: "Membership, event & dining pages",
          body: "Pages and enquiry forms for memberships, tournaments, weddings, corporate days and the clubhouse restaurant.",
        },
      ],
      deliverables: [
        "Site plan for golf, membership, events and dining",
        "Custom design for desktop, tablet and phone",
        "Course tour and hole-by-hole pages",
        "Tee time and booking system integration",
        "Event and membership enquiry forms",
        "Photography and aerial video direction",
        "SEO, analytics and conversion tracking",
      ],
      benefits: [
        {
          title: "More direct bookings",
          body: "Golfers book with you instead of through third-party sites.",
        },
        {
          title: "Better event enquiries",
          body: "Planners arrive with the details they need, ready to talk dates.",
        },
        {
          title: "A course that sells itself",
          body: "Strong visuals and clear information do the work of a tour.",
        },
      ],
      applications: [
        "Launching a new website before opening day",
        "Promoting stay-and-play packages at a resort course",
        "Adding tournament and corporate event pages",
        "Connecting a new tee sheet system",
      ],
      approach: [
        { title: "Walk the course", body: "Your audiences, your layout and what sets the club apart." },
        { title: "Plan", body: "Site structure and booking paths for each type of visitor." },
        { title: "Design & build", body: "A fast, visual site with booking tools connected." },
        { title: "Launch & support", body: "Tracking in place and updates through the season." },
      ],
      gallery: [
        { src: `${UP}/2026/02/arizona-golf-course-marketing.jpg`, alt: "An aerial view of a desert golf course below a mountain ridge" },
        { src: `${UP}/2025/05/golf-1.webp`, alt: "A clubhouse dining room with tall windows and set tables" },
      ],
      related: [
        { label: "Website development & e-commerce", href: "/services/website-development/" },
        { label: "Golf marketing strategies", href: "/blog-golf-marketing-strategies/" },
      ],
    },
    {
      slug: "branding",
      title: "Branding & Creative Development",
      summary: "A club identity and creative that carry from the crest on the flag to every ad, scorecard and post.",
      seo: {
        title: "Golf Course Branding & Creative Development | Kosick Communications",
        description:
          "Branding and creative development for golf courses and clubs: identity, crests, signage, photography and campaign creative, from Kosick Communications.",
      },
      hero: {
        label: "Golf branding & creative development",
        title: "A club identity worth wearing.",
        lead: "Golfers wear the logo, keep the scorecard and post the photos. We build golf brands that look right on a flag, a hat and a billboard, and creative that captures the feeling of a great round.",
        image: { src: `${UP}/2026/07/Chillwack-Golf-Club.jpg`, alt: "A 1958 club crest over a groundskeeper watering the course at sunrise", position: "85% center" },
      },
      intro: {
        title: "Every club has a story. The brand tells it.",
        paragraphs: [
          "Some clubs have decades of history; others are a new resort course with a view nobody has seen. Either way, golfers choose where to play and where to belong partly on how the club looks and feels.",
          "We develop identities, from crests and logos to colour and type, then the creative that brings them to life: photography, signage, merchandise and campaign artwork that all feel like the same place.",
        ],
      },
      offers: [
        {
          title: "Club identity",
          body: "Logos, crests, colour palettes and typography, with guidelines that cover everything from tee markers to the pro shop.",
        },
        {
          title: "Photography & visual content",
          body: "Course, clubhouse and lifestyle photography and aerial footage that show the property at the right light and season.",
        },
        {
          title: "Campaign & print creative",
          body: "Artwork for ads, rate cards, scorecards, signage, membership kits and event materials, all on brand.",
        },
      ],
      deliverables: [
        "Brand review and positioning",
        "Logo, crest and identity system",
        "Brand guidelines",
        "Signage and on-course wayfinding design",
        "Merchandise and pro shop artwork",
        "Photography and aerial shoots",
        "Campaign, print and digital creative",
      ],
      benefits: [
        {
          title: "Instantly recognizable",
          body: "A consistent identity makes every touchpoint feel like your club.",
        },
        {
          title: "Merchandise people want",
          body: "A strong mark sells in the pro shop and travels on every hat and bag.",
        },
        {
          title: "Creative that's ready to use",
          body: "A library of on-brand photos and artwork speeds up every campaign.",
        },
      ],
      applications: [
        "Refreshing a heritage club's crest for its anniversary",
        "Branding a new course or resort before launch",
        "Seasonal photography for the website and social media",
        "Membership drive materials",
      ],
      approach: [
        { title: "Discover", body: "Club history, members and the experience you offer." },
        { title: "Define", body: "Positioning and the visual direction for the brand." },
        { title: "Design", body: "Identity, guidelines and the first set of creative." },
        { title: "Roll out", body: "Signage, merchandise, print and digital updated in order." },
      ],
      gallery: [
        { src: `${UP}/2026/03/golf-course-branding.jpg`, alt: "A golfer walking a sunlit fairway with his bag" },
        { src: `${UP}/2026/07/Golf-Marketing-e1784584580271.jpg`, alt: "A smiling golfer leaning on a carved 16th hole par 3 sign" },
        { src: `${UP}/2026/06/golf-course-branding-marketing.jpg`, alt: "A golfer finishing her swing on a fairway lined with evergreens" },
      ],
      related: [
        { label: "Corporate branding", href: "/services/corporate-branding/" },
        { label: "Creative & production", href: "/services/creative/" },
      ],
    },
    {
      slug: "tv-video-advertising",
      title: "TV & Video Advertising",
      summary: "Broadcast spots, streaming and course video that bring golfers from the couch to the first tee.",
      seo: {
        title: "Golf TV Advertising & Video Production | Kosick Communications",
        description:
          "Television advertising, streaming and video production for golf courses, golf trails and resorts. Kosick plans, produces and places golf campaigns.",
      },
      hero: {
        label: "Golf TV & video advertising",
        title: "Put the course on the broadcast.",
        lead: "Golfers watch golf. We produce course and destination video, then place it where golfers are already watching: sports broadcasts, streaming and online video.",
        image: { src: "/images/golf-sportsnet-poster.jpg", alt: "A Golf Paradise spot for the Mt. Baker Golf Trail with aerial and on-course shots" },
      },
      card: { src: `${UP}/2026/04/canadian-golf-course-marketing.jpg`, alt: "A golfer blasting a ball out of a greenside bunker" },
      intro: {
        title: "The best way to sell a course is to show it.",
        paragraphs: [
          "A course is a visual experience: the view from the tee, the shape of a green, the light at the end of the day. Video carries that better than any other format, and sports television puts it in front of the right audience.",
          "We have produced golf destination spots for broadcast and plan media across sports networks, streaming services and YouTube, with shorter edits for social media and the website.",
        ],
      },
      offers: [
        {
          title: "Golf TV advertising",
          body: "Placements on sports and golf programming across broadcast and specialty networks, planned around the season and the markets your golfers come from.",
        },
        {
          title: "Course & destination video",
          body: "Aerial and on-course footage, clubhouse and lifestyle scenes, edited into commercials, course tours and social clips.",
        },
        {
          title: "Streaming & online video",
          body: "Connected TV, YouTube and online video campaigns targeted by interest and location, with reporting on views and visits.",
        },
      ],
      deliverables: [
        "Campaign concept and scripts",
        "Aerial and ground production",
        "TV spots and online cut-downs",
        "Sports and golf media planning and booking",
        "Connected TV and YouTube campaigns",
        "Course tour video for the website",
        "Campaign reporting",
      ],
      benefits: [
        {
          title: "The right audience",
          body: "Sports programming reaches golfers in the moment they're thinking about the game.",
        },
        {
          title: "Destination appeal",
          body: "Video gives travelling golfers a reason to plan a trip around your course.",
        },
        {
          title: "Footage for the whole year",
          body: "One production supplies TV, the website and a season of social content.",
        },
      ],
      applications: [
        "A golf trail or region promoting itself to visiting players",
        "Spring launch spots before the season opens",
        "Resort stay-and-play packages on connected TV",
        "Course tour video for the website and YouTube",
      ],
      approach: [
        { title: "Concept", body: "The story of the course and who it's for." },
        { title: "Shoot", body: "Aerial and on-course production at the right time of day and year." },
        { title: "Place", body: "Sports TV, streaming and online video booked to plan." },
        { title: "Report", body: "Delivery, views and website visits tracked." },
      ],
      gallery: [
        { src: `${UP}/2026/04/canadian-golf-course-marketing.jpg`, alt: "A golfer blasting a ball out of a greenside bunker" },
        { src: `${UP}/2026/02/golf-marketing.jpg`, alt: "A golf ball at the edge of the cup beside the flagstick" },
      ],
      related: [
        { label: "Television advertising", href: "/services/television-advertising/" },
        { label: "Digital & connected TV", href: "/services/digital-connected-tv/" },
        { label: "Golf marketing in Vancouver", href: "/golf-marketing-digital-marketing-vancouver/" },
      ],
    },
    {
      slug: "social-media-lead-generation",
      title: "Social Media & Lead Generation",
      summary: "Social content and targeted campaigns that turn followers into rounds, members and event bookings.",
      seo: {
        title: "Golf Social Media Marketing & Lead Generation | Kosick Communications",
        description:
          "Social media marketing and lead generation for golf courses: content, paid social and search campaigns that drive tee times, memberships and events.",
      },
      hero: {
        label: "Golf social media & lead generation",
        title: "From the feed to the first tee.",
        lead: "Golf is made for social media: perfect light, full greens, good food on the patio. We turn that into content golfers follow and campaigns that fill tee times, memberships and event dates.",
        image: { src: `${UP}/2026/03/golf-marketing.jpg`, alt: "A golfer's legs and bag on a sunny fairway" },
      },
      intro: {
        title: "Content that gets people out to play.",
        paragraphs: [
          "Social media keeps your course in mind between rounds and introduces it to golfers who have never played it. Paid campaigns then reach the specific people you need: local players for a quiet Tuesday, groups for a tournament, families for a membership.",
          "We plan both together, capture content on the course, and track results through to bookings and enquiries so you know what each campaign returned.",
        ],
      },
      offers: [
        {
          title: "Social media management",
          body: "Content planning, on-course photography and video, posting and community management on Instagram, Facebook and TikTok.",
        },
        {
          title: "Paid social & search campaigns",
          body: "Meta and Google campaigns targeted by location and interest for tee times, memberships, lessons and events.",
        },
        {
          title: "Lead capture & nurturing",
          body: "Landing pages, enquiry forms and email follow-up that turn interest into membership tours, tournament bookings and repeat rounds.",
        },
      ],
      deliverables: [
        "Social strategy and monthly content calendar",
        "On-course photo and video content",
        "Post design, captions and scheduling",
        "Meta and Google Ads campaigns",
        "Landing pages and enquiry forms",
        "Email follow-up sequences",
        "Monthly reporting on bookings and leads",
      ],
      benefits: [
        {
          title: "Quiet tee times filled",
          body: "Targeted offers reach local golfers when you have space to sell.",
        },
        {
          title: "A pipeline for events",
          body: "Tournament and corporate enquiries arrive through tracked forms.",
        },
        {
          title: "A community, not only followers",
          body: "Regular content keeps members engaged and proud of their club.",
        },
      ],
      applications: [
        "Selling twilight and weekday rates",
        "Membership drives before the season",
        "Promoting the patio and restaurant to non-golfers",
        "Filling tournament and corporate event dates",
      ],
      approach: [
        { title: "Plan the season", body: "Goals for rounds, members and events, month by month." },
        { title: "Capture", body: "On-course shoots for a library of fresh content." },
        { title: "Launch", body: "Organic posting and paid campaigns working together." },
        { title: "Track", body: "Bookings and enquiries tied back to each campaign." },
      ],
      gallery: [
        { src: `${UP}/2026/06/golf-social-media-marketing.jpg`, alt: "Pink blossoms framing a fairway and mountains" },
        { src: `${UP}/2026/06/golf-course-marketing-food-beverage.jpg`, alt: "Tacos, salads and a spritz on a clubhouse patio table" },
        { src: `${UP}/2024/05/tournament-1.webp`, alt: "Two cocktails beside a bottle of tequila" },
      ],
      related: [
        { label: "Social media marketing", href: "/services/social-media-marketing/" },
        { label: "How to fill tee times", href: "/how-to-fill-tee-times-golf-marketing/" },
        { label: "Increase golf course revenue", href: "/increase-golf-course-revenue/" },
      ],
    },
  ],
};
