import {
  decodeRenderedText,
  getPageBySlug,
  getWordPressUrl,
} from "@/lib/wordpress";
import { absUrl } from "@/lib/wordpress/shared";
import type { WordPressPage } from "@/types/wordpress";

export type MicrositeSlide = {
  src: string;
  alt: string;
};

export type MicrositeRelatedTile = {
  title: string;
  href: string | null;
  image: { src: string; alt: string };
  overlayOpacity: number;
};

function media(path: string, origin = getWordPressUrl()): string {
  return absUrl(path.startsWith("/") ? path : `/wp-content/uploads/${path}`, origin) || path;
}

async function fetchPage(slug: string): Promise<WordPressPage | null> {
  try {
    return await getPageBySlug(slug);
  } catch {
    return null;
  }
}

export type ComfortmakerContent = {
  title: string;
  metaTitle: string;
  description: string | null;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slides: MicrositeSlide[];
  };
  dateLine: string;
  neeLogo: { src: string; alt: string };
  leadGenTitle: string;
  related: MicrositeRelatedTile[];
};

export async function getComfortmakerContent(): Promise<ComfortmakerContent> {
  const page = await fetchPage("comfortmaker");
  const origin = getWordPressUrl();

  return {
    title: page ? decodeRenderedText(page.title.rendered) : "Travel Registration Mexico",
    metaTitle: "NEE Conference Registration - Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : null,
    hero: {
      eyebrow: "Mexico 2026",
      title: "Conference",
      subtitle: "Conference Registration",
      slides: [
        {
          src: media(
            "2026/01/empty-deck-chair-lounge-with-umbrella-around-beach-sea-ocean-blue-sky-leisure-travel-vacation.jpg",
            origin,
          ),
          alt: "Beach lounge chairs overlooking the ocean",
        },
        {
          src: media("2024/07/pexels-ben-mack-5707680.webp", origin),
          alt: "Resort pool and palms",
        },
        {
          src: media("2024/07/iStock-1145651678.webp", origin),
          alt: "Tropical beach destination",
        },
      ],
    },
    dateLine: "April 18-25, 2026",
    neeLogo: {
      src: media("2023/06/nee-logo-750x86.jpg", origin),
      alt: "National Energy Equipment",
    },
    leadGenTitle: "Comfortmaker Exclusive Lead Generation",
    related: relatedServicesBand(origin),
  };
}

export type UncorkedContent = {
  title: string;
  metaTitle: string;
  description: string | null;
  hero: {
    logo: { src: string; alt: string };
    slides: MicrositeSlide[];
  };
  stats: Array<{ icon: string; title: string; body: string }>;
  venue: {
    date: string;
    name: string;
    cardImage: string;
    formatImage: string;
    formatTitle: string;
    formatBody: string;
    fees: string;
    portraitImage: string;
  };
  prizes: Array<{ place: string; lines: string[]; featured?: boolean }>;
  accommodations: {
    title: string;
    body: string;
    discountLabel: string;
    discountCode: string;
    cta: { label: string; href: string };
    images: string[];
  };
  sponsors: {
    title: string;
    items: Array<{ src: string; alt: string; href: string | null }>;
  };
  kpSponsorTitle: string;
  performance: {
    title: string;
    paragraphs: string[];
    prizes: string[];
    images: Array<{ src: string; alt: string }>;
    mailto: string;
  };
  logoInterstitial: { src: string; alt: string };
  closingTitle: string;
  mosaic: Array<{ src: string; overlay: string }>;
};

export async function getUncorkedContent(): Promise<UncorkedContent> {
  const page = await fetchPage("uncorked");
  const origin = getWordPressUrl();

  return {
    title: page ? decodeRenderedText(page.title.rendered) : "Uncorked 2025",
    metaTitle: "Uncorked Invitational - Registration",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : "The 2025 Uncorked Invitational",
    hero: {
      logo: {
        src: media(
          "2024/05/Copy-of-Copy-of-Copy-of-Copy-of-INVITATIONAL-2.webp",
          origin,
        ),
        alt: "golf tournament",
      },
      slides: [
        {
          src: media("slider16/pexels-tyler-hendy-9620-54123-scaled.jpeg", origin),
          alt: "Golf course fairway",
        },
        {
          src: media("2025/05/IMG_6248-scaled-e1748557572784.jpg", origin),
          alt: "Uncorked invitational golfers",
        },
        {
          src: media(
            "2024/05/Golf-ball-sitting-on-a-green-with-the-flagstick-nearby-178961372_4368x2912.webp",
            origin,
          ),
          alt: "Golf ball on the green",
        },
        {
          src: media("2024/05/MySymbol-Family-Lifestyle-Horizontal.webp", origin),
          alt: "Golf lifestyle",
        },
        {
          src: media("2024/05/BubbaWhips-1-1.webp-copy.webp", origin),
          alt: "Golfer swinging",
        },
        {
          src: media("2024/05/robert-ruggiero-LUqej0W6BSI-unsplash.webp", origin),
          alt: "Golf course landscape",
        },
      ],
    },
    stats: [
      {
        icon: media("2024/05/golf-1.webp", origin),
        title: "2 Rounds",
        body: "August 9/10@ Chilliwack Golf Club",
      },
      {
        icon: media("2024/05/golf-ads-750x744.webp", origin),
        title: "2 Players",
        body: "Team Net Scoring",
      },
      {
        icon: media("2024/05/golf-events.webp", origin),
        title: "Corked Bottle",
        body: "Bring a $50+ Wine or Spirit",
      },
      {
        icon: media("2024/05/golf-ads-1.webp", origin),
        title: "Win Big",
        body: "Top 3 Teams Rewarded + KP's",
      },
    ],
    venue: {
      date: "August 9/10, 2025",
      name: "Chilliwack Golf Club",
      cardImage: media("slider16/titleist-scaled.jpeg", origin),
      formatImage: media("2025/05/golf-2-750x750.webp", origin),
      formatTitle: "Format:",
      formatBody:
        "Two-player teams will use net scoring to ensure fair play. The net score submitted on the scorecard for each hole will be the lowest of the two players' net scores. The team with the lowest total net score at the end of the two rounds wins. Team uniforms are welcomed! We will all go upstairs for dinner following the Sunday round.",
      fees:
        "Chilliwack Green Fees are $70 due at the Pro-Shop. $25 Group Advanced Booking Fee due at time of Registration via e-transfer.",
      portraitImage: media("2025/05/golf-3-750x750.webp", origin),
    },
    prizes: [
      { place: "2nd Place", lines: ["WIN", "THREE BOTTLES"] },
      { place: "1st Place", lines: ["TAKES HOME", "THE REST!"], featured: true },
      { place: "3rd Place", lines: ["WIN", "YOUR BOTTLE"] },
    ],
    accommodations: {
      title: "Accommodations:",
      body: "We've secured a block of rooms at the Coast Chilliwack Hotel by APA, conveniently located near the course, restaurants, and bars. The hotel features amenities such as a pool and sauna. Each room includes two beds and can accommodate 2 to 4 guests. Rates are under $80 per person based on 4-person occupancy.",
      discountLabel: "Group Booking Discount Code:",
      discountCode: "CHIGOL",
      cta: {
        label: "Book A room",
        href: "https://www.coasthotels.com/coast-chilliwack-hotel-by-apa/",
      },
      images: [
        media(
          "2025/05/coast-chilliwack-hotel-by-apa-comfort-room-double-double-1_square.webp",
          origin,
        ),
        media("2025/05/golf-750x422.webp", origin),
        media("2025/05/coast-chilliwack-hotel-by-apa-indoor-pool-1.webp", origin),
        media("2025/05/golf-1.webp", origin),
      ],
    },
    sponsors: {
      title: "Event Sponsors",
      items: [
        {
          src: media("2025/05/Screenshot-2025-05-31-at-12.55.43 PM.webp", origin),
          alt: "Event sponsor",
          href: null,
        },
        {
          src: media("2025/05/Screenshot-2025-05-31-at-12.57.02 PM.webp", origin),
          alt: "Event sponsor",
          href: null,
        },
        {
          src: media("2024/05/kosick-communications-750x422.webp", origin),
          alt: "Kosick",
          href: "mailto:bretton@kosick.com",
        },
        {
          src: media("2025/05/Screenshot-2025-05-31-at-12.57.35 PM.webp", origin),
          alt: "Event sponsor",
          href: "mailto:ahuxtable@dbmlaw.ca",
        },
      ],
    },
    kpSponsorTitle: "KP/Long Drive Sponsor",
    performance: {
      title: "Performance Creation",
      paragraphs: [
        "Golf Specific movement assessment through the use of VALD Force Plates and the TPI movement screen. Discover any imbalances or movement flaws to improve your golf.",
        "PJ Meany, owner of Performance Creation, offers personalized training to help you build strength, mobility and on-course performance.",
      ],
      prizes: [
        "• KP – Full 2 Hour Complete Assessment ($250 Value)",
        "• Long Drive – 1 Hour Assessment ($150 Value)",
      ],
      images: [
        {
          src: media(
            "2025/06/E2E8F713-E265-4C3E-9FB2-744549416EC3.webp",
            origin,
          ),
          alt: "Performance Creation",
        },
        {
          src: media("2025/06/golf-marketing-750x501.webp", origin),
          alt: "Golf performance training",
        },
      ],
      mailto: "mailto:pjperformancecreation@gmail.com",
    },
    logoInterstitial: {
      src: media("2024/05/golf-event-750x422.webp", origin),
      alt: "Uncorked golf event",
    },
    closingTitle: "'25 Uncorked Invitational",
    mosaic: [
      {
        src: media("2024/05/tournament-1.webp", origin),
        overlay: "rgba(45, 55, 72, 0.45)",
      },
      {
        src: media("2024/05/golf-event-1.webp", origin),
        overlay: "rgba(26, 32, 44, 0.45)",
      },
      {
        src: media("2024/05/tournament.webp", origin),
        overlay: "rgba(45, 55, 72, 0.08)",
      },
      {
        src: media("2024/05/golf-balls.webp", origin),
        overlay: "rgba(45, 55, 72, 0.21)",
      },
    ],
  };
}

export type MexicoItineraryContent = {
  title: string;
  metaTitle: string;
  description: string | null;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    slides: MicrositeSlide[];
  };
  dateLine: string;
  introTitle: string;
  introBody: string;
  infoBoxes: Array<{
    title: string;
    body: string;
    icon: "luggage" | "passport" | "hotel";
  }>;
  scheduleTitle: string;
  scheduleDays: Array<{
    day: string;
    icon: "hotel" | "table";
    items: string[];
  }>;
  scheduleImage: { src: string; alt: string };
  scheduleClosing: string;
  enjoyTitle: string;
  related: MicrositeRelatedTile[];
};

export async function getMexicoItineraryContent(): Promise<MexicoItineraryContent> {
  const page = await fetchPage("mexico-2026-welcome-itinerary");
  const origin = getWordPressUrl();

  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "Mexico 2026 Welcome Itinerary",
    metaTitle: "NEE Conference Itinerary - Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : null,
    hero: {
      eyebrow: "Mexico 2026",
      title: "Conference",
      subtitle: "Welcome to Nuevo Vallarta",
      slides: [
        {
          src: media(
            "2026/01/empty-deck-chair-lounge-with-umbrella-around-beach-sea-ocean-blue-sky-leisure-travel-vacation.jpg",
            origin,
          ),
          alt: "Beach lounge chairs overlooking the ocean",
        },
        {
          src: media("2024/07/pexels-ben-mack-5707680.webp", origin),
          alt: "Resort pool and palms",
        },
        {
          src: media("2024/07/iStock-1145651678.webp", origin),
          alt: "Tropical beach destination",
        },
      ],
    },
    dateLine: "April 18-25, 2026",
    introTitle: "NEEI Conference at Riu Palace Pacifico",
    introBody:
      "This luxury Mexican destination is where your experience begins! With your stay, we hope you take full advantage of the many amenities available, including daily lifestyle activities, amazing dining options, pools and more. Enjoy walks on the beautiful sandy beach and immerse yourself in this great Mexican destination!",
    infoBoxes: [
      {
        title: "Luggage Tags",
        body: "Please ensure you attach a luggage ID tag to each suitcase and ensure each tag is attached securely and visible.",
        icon: "luggage",
      },
      {
        title: "Travel Documents",
        body: "Your travel documents including passports should be kept on your person to go through Mexican customs.",
        icon: "passport",
      },
      {
        title: "Hotel Arrival",
        body: "Cold beverages will be ready upon your arrival. This is a free evening to explore the resort, dine at one of the restaurants, or enjoy room service.",
        icon: "hotel",
      },
    ],
    scheduleTitle: "Conference Schedule:",
    scheduleDays: [
      {
        day: "Sunday (April 19)",
        icon: "hotel",
        items: [
          "• 10am Conference – Located @ Riu Nuevo Vallarta Theatre. For all guests to attend.",
          "• 6PM Welcome Cocktails @ Bolero Bar",
        ],
      },
      {
        day: "Thursday (April 23rd)",
        icon: "table",
        items: [
          "• Alberta & Manitoba Dinner & 6pm @ Guacamole Restaurant (40 Guests)",
        ],
      },
      {
        day: "Friday (April 24th)",
        icon: "hotel",
        items: [
          "• Saskatchewan Dinner & 6pm @ Guacamole Restaurant (36 Guests)",
        ],
      },
    ],
    scheduleImage: {
      src: media("2026/04/hotel-riu-vallarta-1.jpg", origin),
      alt: "Hotel Riu Vallarta",
    },
    scheduleClosing:
      "We look forward to seeing you at the NEEI Conference and wish you safe travels!",
    enjoyTitle: "Enjoy your week!",
    related: relatedServicesBand(origin),
  };
}

function relatedServicesBand(origin: string): MicrositeRelatedTile[] {
  return [
    {
      title: "Television Media",
      href: null,
      overlayOpacity: 0.3,
      image: {
        src: media(
          "2023/06/Screen-Shot-2021-12-09-at-1.05.09-PM.jpg",
          origin,
        ),
        alt: "Television Media",
      },
    },
    {
      title: "Outdoor Campaigns",
      href: null,
      overlayOpacity: 0.43,
      image: {
        src: media("2023/07/hvac.jpg", origin),
        alt: "Outdoor Campaigns",
      },
    },
    {
      title: "Digital Marketing",
      href: null,
      overlayOpacity: 0.66,
      image: {
        src: media("2023/06/google-ads-1.jpeg", origin),
        alt: "Digital Marketing",
      },
    },
    {
      title: "Website Design",
      href: null,
      overlayOpacity: 0.21,
      image: {
        src: media("2024/07/conference-registration.webp", origin),
        alt: "Website Design",
      },
    },
  ];
}
