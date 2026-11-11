import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import type { ServiceMedia, ServicePageContent } from "@/lib/wordpress/service-page-types";
import { OutdoorPricing, type OutdoorPrice } from "./OutdoorPricing";
import { OutdoorJourney } from "./OutdoorJourney";
import { LocationVisual, TimingVisual } from "./OutdoorFactorVisuals";
import styles from "./OutdoorAdvertisingPage.module.css";

type OutdoorAdvertisingPageProps = {
  content: ServicePageContent;
  /** Media-owner logo from the Kosick partner wall. */
  mediaOwner?: ServiceMedia | null;
};

const UPLOADS = "/wp-content/uploads";

/* Each section uses a different real campaign, so no photograph repeats */
const OPENING = {
  main: { src: `${UPLOADS}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "Arc’teryx Veilance poster in a transit shelter on W Georgia St, Vancouver" },
  second: { src: `${UPLOADS}/2026/06/billboard-2.jpg`, alt: "A second Arc’teryx Veilance shelter poster beside an Arc’teryx store" },
};

const BILLBOARD = {
  src: "/images/outdoor/trane-we-run-together-billboard.jpg",
  alt: "A Trane We Run Together billboard against downtown towers",
};

const SUPERBOARD = {
  src: `${UPLOADS}/2023/07/billboards-scaled.png`,
  alt: "Trane “Heat Cool Clean” superboard against a blue sky",
};

/* Three formats, three industries — outdoor that isn’t locked to one category */
const CAMPAIGN = {
  billboard: {
    src: `${UPLOADS}/2026/01/outdoor-billboard-advertising.jpg`,
    alt: "An urban roadside billboard on a brick wall as traffic passes",
  },
  transit: {
    src: `${UPLOADS}/2026/06/arcteryx-billboard-advertising.jpg`,
    alt: "Arc’teryx Veilance poster in a transit shelter on W Georgia St, Vancouver",
  },
  street: {
    src: "/images/industries/medical-aesthetics/skinfolio-transit-shelter.jpg",
    alt: "Skinfolio street-level digital display on a downtown sidewalk",
  },
};

const CITY = {
  src: `${UPLOADS}/2023/06/vancouver-agency.jpg`,
  alt: "Vancouver skyline and waterfront at sunset",
};

/* Where outdoor meets people, as the page's own copy describes it */
const CITY_MARKERS = [
  { label: "Commute", x: 22, y: 62 },
  { label: "Shop", x: 48, y: 48 },
  { label: "Travel", x: 76, y: 58 },
];

const READABLE = { src: `${UPLOADS}/2023/07/hvac.jpg`, alt: "Ayotte “Upgrade your furnace” billboard" };

/*
 * Starting prices supplied by Kosick, cheapest first. No billing period is
 * shown because none has been confirmed. Each card uses a real placement.
 */
const PRICES: Array<Omit<OutdoorPrice, "size"> & { scale?: string }> = [
  {
    id: "street-level",
    name: "Street-Level (TSA)",
    price: "$550",
    description: "Transit shelter posters at eye level, where people wait, walk and shop.",
    scale: "Street level",
    plate: "Street-level shelter",
    image: { src: `${UPLOADS}/2026/06/outdoor-advertising.jpg`, alt: "Sparkle Dental Spa poster in a street-level transit shelter", position: "55% 45%" },
  },
  {
    id: "billboard-posters",
    name: "Billboard Posters",
    price: "$1,000",
    description: "Roadside posters that repeat your message along busy commuter routes.",
    scale: "Billboard",
    plate: "Roadside poster",
    image: { src: `${UPLOADS}/2024/03/billboard-advertising.webp`, alt: "Belyea Bros. Trane high-efficiency heat pump billboard poster", position: "45% 50%" },
  },
  {
    id: "transit",
    name: "Transit Advertising",
    price: "$1,000",
    description: "Placements on and around transit that travel with riders across the city.",
    plate: "SkyTrain corridor",
    image: { src: `${UPLOADS}/2026/06/transit-out-of-home-advertising-1.jpg`, alt: "SkyTrain crossing a downtown Vancouver street", position: "45% 40%" },
  },
  {
    id: "superboards",
    name: "Superboards",
    price: "$1,500",
    description: "Oversized premium boards for landmark visibility on major roads.",
    scale: "Superboard",
    plate: "Superboard",
    image: { src: SUPERBOARD.src, alt: SUPERBOARD.alt, position: "40% 50%" },
  },
];

const THREE_THINGS = [
  { name: "Location", line: "Be where people already move." },
  { name: "Timing", line: "Build frequency when demand matters." },
  { name: "Creative", line: "Make the message readable in seconds." },
];

const BILLBOARD_LABELS = ["High traffic", "Repeated exposure", "Local reach"];

const DIMENSIONS_HREF = "/services/outdoor-advertising/billboard-dimensions/";

type Size = { label: string; width: number; height: number; display: string };

/*
 * Typical Canadian sizes, carried over from the retired Billboard Dimensions
 * guide. The first three are drawn to scale; every format is listed with its note.
 */
const SIZES: Array<Size & { name: string; note: string; drawn: boolean }> = [
  { label: "Street level", name: "Transit shelter ads", display: "47″ × 68″ (about 4′ × 6′)", width: 47 / 12, height: 68 / 12, drawn: true, note: "Street-level placements that reach pedestrians, commuters and local neighbourhood traffic." },
  { label: "Billboard", name: "Horizontal posters", display: "10′ × 20′", width: 20, height: 10, drawn: true, note: "A versatile format for high-traffic urban and roadside placements." },
  { label: "Digital", name: "Digital horizontal posters", display: "10′ × 20′, digital rotation", width: 20, height: 10, drawn: false, note: "Creative rotates through the day and can change quickly." },
  { label: "Superboard", name: "Superboards", display: "10′ × 32′ or 14′ × 48′", width: 32, height: 10, drawn: true, note: "Large-format placements for major highways and long-distance visibility." },
];

function firstSentences(text: string | undefined, count: number) {
  if (!text) return "";
  return text
    .split(/(?<=[.!?])\s+/)
    .slice(0, count)
    .join(" ");
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const ROUTES = {
  a: { d: "M 0 40 H 320 V 160 H 620 V 300 H 1000", markers: [[320, 40], [620, 160]] },
  b: { d: "M 1000 30 H 700 V 200 H 380 V 330 H 0", markers: [[700, 30], [380, 200]] },
  c: { d: "M 0 300 H 260 V 120 H 640 V 260 H 1000", markers: [[260, 300], [640, 120]] },
} as const;

/**
 * A thin route that turns as the page goes down, with small placement markers,
 * like a planning line drawn over a city grid. Decorative; hidden on small screens.
 */
function Route({ variant }: { variant: keyof typeof ROUTES }) {
  const route = ROUTES[variant];
  return (
    <svg className={styles.route} viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={route.d} />
      {route.markers.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
      ))}
    </svg>
  );
}

/* One drawing in feet: the drawn formats stand side by side on a shared ground line */
const GAP = 3;
const scale = SIZES.filter((size) => size.drawn);
const scaleHeight = Math.max(...scale.map((size) => size.height), 1) + 2.5;
const placed = scale.map((size, index) => ({
  ...size,
  x: scale.slice(0, index).reduce((sum, prior) => sum + prior.width + GAP, 0),
}));
const scaleWidth = placed.length ? placed[placed.length - 1].x + placed[placed.length - 1].width : 0;

export function OutdoorAdvertisingPage({ content, mediaOwner }: OutdoorAdvertisingPageProps) {
  const contactHref = content.cta?.primary.href || "/contact/";

  const superboard = content.features.find((item) => /superboard/i.test(item.title));
  const prices: OutdoorPrice[] = PRICES.map(({ scale: sizeLabel, ...item }) => ({
    ...item,
    size: SIZES.find((size) => size.label === sizeLabel)?.display.replace(/ \(about .*\)$/, ""),
  }));

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {/* Billboard exposure on the drive, then the trip to the store: first, directly under the hero */}
      <OutdoorJourney />

      {/* Opening: 40/60, one campaign in two Vancouver shelters, offset with crop marks */}
      <section className={styles.opening} aria-labelledby="oo-opening">
        <Route variant="a" />
        <div className="container">
          <div className={styles.openingGrid}>
            <div>
              <p className={styles.kicker}>Outdoor advertising</p>
              <h2 id="oo-opening" className={styles.title}>
                From one landmark placement to a city-wide presence.
              </h2>
              <p className={styles.lead}>
                Billboard, transit, street-level and digital placements in Vancouver, Calgary, Toronto and markets
                nationwide.
              </p>
              <Link className={styles.solid} href={contactHref}>
                Plan an outdoor campaign
                <ArrowIcon />
              </Link>
            </div>
            <div className={styles.collage}>
              <Reveal variant="fade" className={`${styles.collageMain} ${styles.marked}`}>
                <div className={styles.photo}>
                  <Image src={OPENING.main.src} alt={OPENING.main.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
                </div>
                <span className={styles.plate}>W Georgia St · Transit shelter</span>
              </Reveal>
              <Reveal delay={150} className={styles.collageSecond}>
                <div className={styles.photo}>
                  <Image src={OPENING.second.src} alt={OPENING.second.alt} fill sizes="(min-width: 960px) 45vw, 90vw" className={styles.cover} style={{ objectPosition: "62% 50%" }} />
                </div>
                <span className={styles.plate}>Street-level</span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Formats and starting prices; extra bottom room for the billboard to cross into */}
      <OutdoorPricing prices={prices} contactHref={contactHref} className={styles.formats} />

      {/* Billboard: near full width, crossing up into the section above, copy panel set on the image */}
      <section className={styles.billboard} aria-labelledby="oo-billboard">
        <Reveal variant="fade" className={styles.bleed}>
          <Image src={BILLBOARD.src} alt={BILLBOARD.alt} fill sizes="100vw" className={styles.cover} style={{ objectPosition: "50% 35%" }} />
          <div className={styles.bleedPanel}>
            <p className={styles.kicker}>Billboards</p>
            <h2 id="oo-billboard" className={styles.title}>
              Built to be seen at scale.
            </h2>
            <p className={styles.leadSmall}>
              Strategic placements create repeated visibility across high-traffic routes, neighbourhoods and
              commuter corridors.
            </p>
            <ul className={styles.labels}>
              {BILLBOARD_LABELS.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
            <div className={styles.bleedActions}>
              <Link className={styles.solid} href={DIMENSIONS_HREF}>
                View Billboard Sizes
                <ArrowIcon />
              </Link>
              <Link className={styles.textLink} href="#oo-pricing">
                See starting prices
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Superboard: image, name, one explanation, then scale */}
      {superboard ? (
        <section className={styles.superboard} aria-labelledby="oo-superboard">
          <div className="container">
            <Reveal variant="fade" className={`${styles.superMedia} ${styles.marked} ${styles.markedLight}`}>
              <div className={styles.photo}>
                <Image src={SUPERBOARD.src} alt={SUPERBOARD.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <div className={styles.superCopy}>
              <div>
                <p className={styles.kickerOnDark}>Premium format</p>
                <h2 id="oo-superboard" className={styles.superTitle}>
                  Superboards
                </h2>
              </div>
              <p className={styles.leadOnDark}>{firstSentences(superboard.body, 2)}</p>
            </div>
            {scale.length > 1 ? (
              <figure className={styles.scale}>
                <figcaption className={styles.scaleTitle}>Drawn to scale</figcaption>
                <svg
                  className={styles.scaleDrawing}
                  viewBox={`0 0 ${scaleWidth} ${scaleHeight}`}
                  role="img"
                  aria-label={placed.map((size) => `${size.label} ${size.display}`).join(", ")}
                >
                  <line className={styles.ground} x1="0" y1={scaleHeight - 1.5} x2={scaleWidth} y2={scaleHeight - 1.5} />
                  {placed.map((size) => {
                    const top = scaleHeight - 1.5 - size.height;
                    const isSuper = /superboard/i.test(size.label);
                    return (
                      <g key={size.label}>
                        <rect
                          className={isSuper ? `${styles.board} ${styles.boardSuper}` : styles.board}
                          x={size.x}
                          y={top}
                          width={size.width}
                          height={size.height}
                        />
                        <text className={styles.boardLabel} x={size.x} y={top - 0.6}>
                          {size.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <ol className={styles.scaleKey}>
                  {SIZES.map((size) => (
                    <li key={size.name}>
                      <span>{size.name}</span>
                      <span>{size.display}</span>
                      <span className={styles.scaleKeyNote}>{size.note}</span>
                    </li>
                  ))}
                </ol>
                <p className={styles.scaleNote}>
                  Typical Canadian sizes from our{" "}
                  <Link href={DIMENSIONS_HREF}>billboard dimensions guide</Link>. Exact dimensions vary by media owner
                  and location.
                </p>
                <Link className={styles.scaleCta} href={DIMENSIONS_HREF}>
                  View Billboard Sizes
                  <ArrowIcon />
                </Link>
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Campaign: one dominant billboard, transit and street-level stacked beside it */}
      <section className={styles.campaign} aria-labelledby="oo-campaign">
        <Route variant="b" />
        <div className="container">
          <div className={styles.campaignHead}>
            <p className={styles.kicker}>Outdoor advertising</p>
            <h2 id="oo-campaign" className={styles.title}>
              One campaign. Across the city.
            </h2>
            <p className={styles.lead}>
              Billboards, transit and street-level placements adapted for every environment — retail, clinics, destinations
              and local brands alike.
            </p>
          </div>
          <div className={styles.spread}>
            <Reveal variant="fade" className={`${styles.spreadMain} ${styles.marked}`}>
              <div className={styles.photo}>
                <Image src={CAMPAIGN.billboard.src} alt={CAMPAIGN.billboard.alt} fill sizes="(min-width: 960px) 60vw, 100vw" className={styles.cover} style={{ objectPosition: "50% 45%" }} />
              </div>
              <span className={styles.plate}>Billboard</span>
            </Reveal>
            <Reveal delay={120} className={styles.spreadTop}>
              <div className={styles.photo}>
                <Image src={CAMPAIGN.transit.src} alt={CAMPAIGN.transit.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.cover} style={{ objectPosition: "55% 40%" }} />
              </div>
              <span className={styles.plate}>Transit</span>
            </Reveal>
            <Reveal delay={240} className={styles.spreadBottom}>
              <div className={styles.photo}>
                <Image src={CAMPAIGN.street.src} alt={CAMPAIGN.street.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.cover} style={{ objectPosition: "50% 40%" }} />
              </div>
              <span className={styles.plate}>Street-level</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* City presence: the skyline, full width, with placement markers */}
      <section className={styles.city} aria-labelledby="oo-city">
        <Image src={CITY.src} alt={CITY.alt} fill sizes="100vw" className={styles.cover} />
        <div className={styles.cityShade} aria-hidden="true" />
        <ul className={styles.markers} aria-hidden="true">
          {CITY_MARKERS.map((marker) => (
            <li key={marker.label} style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
              <span className={styles.markerDot} />
              <span className={styles.markerLabel}>{marker.label}</span>
            </li>
          ))}
        </ul>
        <div className={`container ${styles.cityCopy}`}>
          <h2 id="oo-city" className={styles.titleOnDark}>
            Be seen where the city moves.
          </h2>
          <p className={styles.leadOnDark}>On the way to work, at the shops and through the terminals.</p>
        </div>
      </section>

      {/* Three things: a compact triptych, each column grounded by a small visual */}
      <section className={styles.three} aria-labelledby="oo-three">
        <Route variant="c" />
        <div className="container">
          <h2 id="oo-three" className={styles.title}>
            Outdoor works when three things align.
          </h2>
          <ol className={styles.triptych}>
            <li className={styles.part}>
              <span className={styles.visualGrid} aria-hidden="true">
                <LocationVisual />
              </span>
              <span className={styles.partNumber}>01</span>
              <span className={styles.partName}>{THREE_THINGS[0].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[0].line}</span>
            </li>
            <li className={styles.part}>
              <span className={styles.visualTime} aria-hidden="true">
                <TimingVisual />
              </span>
              <span className={styles.partNumber}>02</span>
              <span className={styles.partName}>{THREE_THINGS[1].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[1].line}</span>
            </li>
            <li className={styles.part}>
              <span className={styles.visualCreative} aria-hidden="true">
                <Image src={READABLE.src} alt="" fill sizes="(min-width: 960px) 30vw, 100vw" className={styles.cover} style={{ objectPosition: "48% 30%" }} />
              </span>
              <span className={styles.partNumber}>03</span>
              <span className={styles.partName}>{THREE_THINGS[2].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[2].line}</span>
            </li>
          </ol>
          {mediaOwner?.src ? (
            <p className={styles.partner}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaOwner.src} alt="Pattison Outdoor Advertising" />
              <span>Rates negotiated directly with media owners, including Pattison Outdoor Advertising.</span>
            </p>
          ) : null}
        </div>
      </section>

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
