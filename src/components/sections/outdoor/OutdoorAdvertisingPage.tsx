import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import type { ResourceGuideContent } from "@/lib/wordpress/resource-guide-types";
import type { ServiceMedia, ServicePageContent } from "@/lib/wordpress/service-page-types";
import { OutdoorFormatShowcase, type OutdoorFormat } from "./OutdoorFormatShowcase";
import styles from "./OutdoorAdvertisingPage.module.css";

type OutdoorAdvertisingPageProps = {
  content: ServicePageContent;
  /** Billboard Dimensions guide, the published source for format sizes. */
  dimensions?: ResourceGuideContent | null;
  /** Media-owner logo from the Kosick partner wall. */
  mediaOwner?: ServiceMedia | null;
};

const UPLOADS = "/wp-content/uploads";
const DIMENSIONS_HREF = "/services/outdoor-advertising/billboard-dimensions/";

/* Each section uses a different real campaign, so no photograph repeats */
const OPENING = {
  main: { src: `${UPLOADS}/2026/06/arcteryx-billboard-advertising.jpg`, alt: "Arc’teryx Veilance poster in a transit shelter on W Georgia St, Vancouver" },
  second: { src: `${UPLOADS}/2026/06/billboard-2.jpg`, alt: "A second Arc’teryx Veilance shelter poster beside an Arc’teryx store" },
};

const BILLBOARD = {
  src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`,
  alt: "Belyea Bros. high-efficiency heat pump billboard above a city street",
};

const SUPERBOARD = {
  src: `${UPLOADS}/2023/07/billboards-scaled.png`,
  alt: "Trane “Heat Cool Clean” superboard against a blue sky",
};

/* Trane “We run together”: one creative in three placements */
const CAMPAIGN = {
  billboard: { src: `${UPLOADS}/2026/01/outdoor-advertising.jpg`, alt: "Trane “We run together” billboard on a rooftop structure" },
  transit: { src: `${UPLOADS}/2024/03/transit-shelter-ads.webp`, alt: "Trane “We run together” poster in a transit shelter" },
  street: { src: `${UPLOADS}/2023/07/outdoor-advertising-1-scaled.jpg`, alt: "Trane “We run together” vertical board among downtown towers" },
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

const FORMAT_SET = [
  {
    id: "billboards",
    label: "Billboard",
    card: /billboard/i,
    feature: /billboard poster/i,
    image: { src: `${UPLOADS}/2023/07/home-services-billboards.jpg`, alt: "GE residential HVAC billboard against a blue sky", position: "55% 45%" },
  },
  {
    id: "transit",
    label: "Transit",
    card: /transit/i,
    feature: /transit/i,
    image: { src: `${UPLOADS}/2026/06/transit-out-of-home-advertising-1.jpg`, alt: "Elevated SkyTrain line crossing a downtown Vancouver street", position: "50% 45%" },
  },
  {
    id: "street-level",
    label: "Street-level",
    card: /street/i,
    feature: /street/i,
    image: { src: `${UPLOADS}/2026/06/outdoor-advertising.jpg`, alt: "Illuminated poster in a transit shelter on a tree-lined sidewalk", position: "60% 50%" },
  },
  {
    id: "digital",
    label: "Digital OOH",
    card: /digital/i,
    feature: /^$/,
    image: { src: `${UPLOADS}/2024/03/digital-superboard.webp`, alt: "Pattison digital superboard beside a multi-lane highway", position: "55% 50%" },
  },
];

const THREE_THINGS = [
  { name: "Location", line: "Be where people already move." },
  { name: "Timing", line: "Build frequency when demand matters." },
  { name: "Creative", line: "Make the message readable in seconds." },
];

const BILLBOARD_LABELS = ["High traffic", "Repeated exposure", "Local reach"];

/* Illustrative only: the parts of a day a plan is built around */
const DAYPARTS = [
  { name: "AM commute", peak: true },
  { name: "Midday", peak: false },
  { name: "PM commute", peak: true },
  { name: "Weekend", peak: false },
];

type Size = { label: string; width: number; height: number; display: string };

function specOf(dimensions: ResourceGuideContent | null | undefined, pattern: RegExp) {
  const section = dimensions?.sections.find((item) => pattern.test(item.title));
  return section?.spec?.replace(/^typical size:\s*/i, "").trim() || undefined;
}

/** First published size (feet ′ or inches ″) as width × height in feet. */
function sizeFrom(spec: string | undefined, label: string, portrait = false): Size | null {
  const match = spec?.replace(/\([^)]*\)/g, "").match(/(\d+(?:\.\d+)?)\s*([′'″"])\s*[×x]\s*(\d+(?:\.\d+)?)\s*([′'″"])/);
  if (!match) return null;
  const toFeet = (value: string, unit: string) => (/[″"]/.test(unit) ? Number(value) / 12 : Number(value));
  const a = toFeet(match[1], match[2]);
  const b = toFeet(match[3], match[4]);
  return {
    label,
    width: portrait ? Math.min(a, b) : Math.max(a, b),
    height: portrait ? Math.max(a, b) : Math.min(a, b),
    display: `${match[1]}${match[2]} × ${match[3]}${match[4]}`,
  };
}

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

export function OutdoorAdvertisingPage({ content, dimensions, mediaOwner }: OutdoorAdvertisingPageProps) {
  const cards = content.offerGroups.flatMap((group) => group.cards).filter((card) => card.title);
  const contactHref = content.cta?.primary.href || "/contact/";

  const formats: OutdoorFormat[] = FORMAT_SET.flatMap((format) => {
    const card = cards.find((item) => format.card.test(item.title));
    if (!card?.body) return [];
    const price = content.features.find((item) => format.feature.test(item.title))?.eyebrow;
    return [
      {
        id: format.id,
        label: format.label,
        line: card.body,
        meta: price && /\$\d/.test(price) ? price.replace(/^starting from/i, "Starting from") : undefined,
        image: format.image,
      },
    ];
  });

  const superboard = content.features.find((item) => /superboard/i.test(item.title));
  const scale = [
    sizeFrom(specOf(dimensions, /transit shelter/i), "Street level", true),
    sizeFrom(specOf(dimensions, /^horizontal poster/i), "Billboard"),
    sizeFrom(specOf(dimensions, /^superboard/i), "Superboard"),
  ].filter((size): size is Size => Boolean(size));
  // One drawing in feet: boards stand on a shared ground line
  const GAP = 3;
  const scaleHeight = Math.max(...scale.map((size) => size.height), 1) + 2.5;
  let cursor = 0;
  const placed = scale.map((size) => {
    const x = cursor;
    cursor += size.width + GAP;
    return { ...size, x };
  });
  const scaleWidth = cursor - GAP;

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

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
                  <Image src={OPENING.second.src} alt={OPENING.second.alt} fill sizes="(min-width: 960px) 22vw, 50vw" className={styles.cover} style={{ objectPosition: "62% 50%" }} />
                </div>
                <span className={styles.plate}>Street-level</span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Formats: a numbered strip of environments over one wide placement */}
      {formats.length > 1 ? (
        <section className={styles.formats} aria-labelledby="oo-formats">
          <div className="container">
            <h2 id="oo-formats" className={styles.title}>
              Choose your environment.
            </h2>
            <OutdoorFormatShowcase formats={formats} />
          </div>
        </section>
      ) : null}

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
            <Link className={styles.textLink} href={DIMENSIONS_HREF}>
              Explore billboard formats
              <ArrowIcon />
            </Link>
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
                  {placed.map((size) => (
                    <li key={size.label}>
                      <span>{size.label}</span>
                      <span>{size.display}</span>
                    </li>
                  ))}
                </ol>
                <p className={styles.scaleNote}>
                  Typical sizes from our <Link href={DIMENSIONS_HREF}>billboard dimensions guide</Link>.
                </p>
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
            <p className={styles.kicker}>Trane · We run together</p>
            <h2 id="oo-campaign" className={styles.title}>
              One campaign. Across the city.
            </h2>
            <p className={styles.lead}>One creative system, adapted to every placement and environment.</p>
          </div>
          <div className={styles.spread}>
            <Reveal variant="fade" className={`${styles.spreadMain} ${styles.marked}`}>
              <div className={styles.photo}>
                <Image src={CAMPAIGN.billboard.src} alt={CAMPAIGN.billboard.alt} fill sizes="(min-width: 960px) 60vw, 100vw" className={styles.cover} style={{ objectPosition: "50% 40%" }} />
              </div>
              <span className={styles.plate}>Billboard</span>
            </Reveal>
            <Reveal delay={120} className={styles.spreadTop}>
              <div className={`${styles.photo} ${styles.photoWhite}`}>
                <Image src={CAMPAIGN.transit.src} alt={CAMPAIGN.transit.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.contain} />
              </div>
              <span className={styles.plate}>Transit</span>
            </Reveal>
            <Reveal delay={240} className={styles.spreadBottom}>
              <div className={styles.photo}>
                <Image src={CAMPAIGN.street.src} alt={CAMPAIGN.street.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.cover} style={{ objectPosition: "50% 38%" }} />
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
                <span className={styles.visualPin} style={{ left: "58%", top: "42%" }} />
                <span className={styles.visualPin} style={{ left: "30%", top: "70%" }} />
              </span>
              <span className={styles.partNumber}>01</span>
              <span className={styles.partName}>{THREE_THINGS[0].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[0].line}</span>
            </li>
            <li className={styles.part}>
              <span className={styles.visualTime} aria-hidden="true">
                {DAYPARTS.map((part) => (
                  <span key={part.name} className={part.peak ? `${styles.timeSlot} ${styles.timePeak}` : styles.timeSlot}>
                    <span className={styles.timeBar} />
                    <span className={styles.timeName}>{part.name}</span>
                  </span>
                ))}
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
