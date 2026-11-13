import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RelatedServices } from "@/components/sections/ads/RelatedServices";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { FlightMarquee, type FlightStage } from "./FlightMarquee";
import { MaviShowcase } from "./MaviShowcase";
import { PartnerLandscape } from "./PartnerLandscape";
import { TvCompareStudio } from "./TvCompareStudio";
import styles from "./DigitalVideoAdvertisingPage.module.css";

type DigitalVideoAdvertisingPageProps = {
  content: ServicePageContent;
};

const UPLOADS = "/wp-content/uploads";

const SHOTS = {
  /** Broadcast / linear living-room TV */
  livingRoom: {
    src: `${UPLOADS}/2026/09/Television-Advertising.jpg`,
    alt: "A family watching hockey on a large living-room TV",
  },
  /** Streaming app on a wall-mounted TV */
  streamingTv: {
    src: "/images/television/prime-video.jpg",
    alt: "Prime Video playing on a wall-mounted living-room television",
  },
  /** Connected TV / sofa viewing */
  connectedTv: {
    src: "/images/television/connected-tv.jpg",
    alt: "Two people on a sofa watching a football game on a living-room Connected TV",
  },
  /** Mobile online video / pre-roll */
  mobilePreRoll: {
    src: "/images/television/daikin-mobile.jpg",
    alt: "A Daikin Comfort sponsored video playing on a smartphone",
  },
  /** Tablet / outstream-style viewing */
  tablet: {
    src: `${UPLOADS}/2026/02/connected-tv-advertising.jpg`,
    alt: "A viewer streaming on a tablet from the couch",
  },
  homeComfort: {
    src: `${UPLOADS}/2026/07/Media-Buying.jpg`,
    alt: "A family watching a Home Comfort ad on their living-room TV",
  },
  watchParty: {
    src: `${UPLOADS}/2025/12/television-advertising-media-buying.jpg`,
    alt: "Friends watching soccer together on a living-room TV",
  },
  tennis: {
    src: "/images/television/tennis-tv.jpg",
    alt: "Tennis playing on a living-room television",
  },
};

/* Connected TV rebuild (Bretton's audit, Nov 2026): what it is, how it differs from linear TV, local markets */
const ABOUT = {
  image: SHOTS.streamingTv,
  devices: ["Smart TVs", "Streaming devices such as Roku, Apple TV and Fire TV", "Gaming consoles", "Streaming apps on phones and tablets"],
};

const LOCAL = [
  { title: "Your trading area", body: "Target the postal codes, cities or regions you serve, so spend stays where customers can buy from you." },
  { title: "Market-by-market weight", body: "Run more frequency in the markets that matter most, and test new ones with a smaller share of budget." },
  { title: "Local brand visibility", body: "Appear on the same big screen as national brands, in your own neighbourhoods, at a fraction of broadcast reach costs." },
];

const FORMATS = {
  ctv: { kicker: "Streaming TV", title: "Connected TV", line: "Big-screen reach, targeted digitally." },
  preroll: { kicker: "Online video", title: "Pre-roll and mid-roll", line: "Reach viewers around the content they already watch." },
  outstream: { kicker: "In-page video", title: "Outstream and vertical", line: "Video placements beyond the traditional player." },
};

const FLIGHT: FlightStage[] = [
  {
    number: "01",
    name: "Audience",
    line: "Viewers chosen by geography, interests and behaviour.",
    meta: "Geography · Interests",
    image: SHOTS.homeComfort,
  },
  {
    number: "02",
    name: "Creative",
    line: "Message and format matched to how they watch.",
    meta: "Matched to the screen",
    image: { src: "/images/connected-tv/mavi-living-room-day.jpg", alt: "Mavi campaign on a living-room television" },
  },
  {
    number: "03",
    name: "Placement",
    line: "Connected TV, online video and premium inventory.",
    meta: "CTV · Pre-roll · Outstream",
    image: SHOTS.connectedTv,
  },
  {
    number: "04",
    name: "Optimization",
    line: "Adjusted in flight for reach, frequency and efficiency.",
    meta: "Live",
    live: true,
    image: SHOTS.watchParty,
  },
];

const SEGMENTS = ["Demographics", "Geography", "Behaviour", "Context"];
const SURFACES = ["Streaming", "Mobile", "Desktop"];

const MEASURES = [
  { name: "Video completion rate", status: "Tracked" },
  { name: "Reach and frequency", status: "Tracked" },
  { name: "Brand lift", status: "Tracked" },
  { name: "Website visit attribution", status: "Tracked" },
  { name: "Cross-device conversions", status: "Tracked" },
];

const MEASURE_LABELS = [
  { name: "Completion", line: "How much of the spot viewers watch.", icon: "completion" },
  { name: "Reach & frequency", line: "How many people, how often.", icon: "reach" },
  { name: "Brand lift", line: "What changes after they see it.", icon: "lift" },
  { name: "Attribution", line: "Site visits and conversions across devices.", icon: "attribution" },
] as const;

/* Line icons for the four measures, drawn on a 24px grid */
const MEASURE_ICONS: Record<(typeof MEASURE_LABELS)[number]["icon"], string> = {
  // A play button inside a mostly completed progress ring
  completion: "M12 3a9 9 0 1 1-8.5 6M10 9l5 3-5 3z",
  // Two people
  reach: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19a6 6 0 0 1 12 0M16 5.3a3 3 0 0 1 0 5.4M17 14a6 6 0 0 1 4 5",
  // Bars rising to an arrow
  lift: "M4 20h16M7 16v-3M12 16V9M17 16V5M14.5 7.5 17 5l2.5 2.5",
  // A cursor clicking on a screen
  attribution: "M4 15V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6M2 19h9M14 13l7 2.5-3 1.2-1.2 3z",
};

const PARTNER_GROUPS: Array<{ title: string; test: RegExp }> = [
  { title: "Sports", test: /sportsnet|tsn|espn|golf/i },
  { title: "Streaming", test: /crave|hulu/i },
  { title: "News", test: /cnn|cp24|global|cbc/i },
  { title: "Entertainment", test: /fox|nbc|cbs|discovery|hgtv|tlc|food|rogers|\be!/i },
  { title: "Audio", test: /spotify/i },
];

/* Player chrome over a placement photo: an ad badge and a scrub bar, so each scene reads as a video in play */
function PlayerChrome({ progress }: { progress: number }) {
  return (
    <span className={styles.chrome} aria-hidden="true">
      <span className={styles.adBadge}>Ad</span>
      <span className={styles.scrub}>
        <span className={styles.scrubFill} style={{ width: `${progress}%` }} />
      </span>
    </span>
  );
}

function FormatCopy({ format }: { format: (typeof FORMATS)[keyof typeof FORMATS] }) {
  return (
    <div className={styles.formatCopy}>
      <p className={styles.kicker}>{format.kicker}</p>
      <h3 className={styles.formatTitle}>{format.title}</h3>
      <p className={styles.formatLine}>{format.line}</p>
    </div>
  );
}

export function DigitalVideoAdvertisingPage({ content }: DigitalVideoAdvertisingPageProps) {
  const partners = (content.partnerLogos?.logos ?? [])
    .flatMap((logo, index) => {
      const name = getPartnerName(logo, index);
      return name.startsWith("Partner ") ? [] : [{ ...logo, name }];
    })
    .filter((logo, index, all) => all.findIndex((item) => item.name === logo.name) === index);
  const grouped = PARTNER_GROUPS.map((group) => ({
    title: group.title,
    logos: partners.filter((logo) => group.test.test(logo.name)).map(({ src, name }) => ({ src, name })),
  })).filter((group) => group.logos.length > 0);
  const groupedNames = new Set(grouped.flatMap((group) => group.logos.map((logo) => logo.name)));
  const other = partners.filter((logo) => !groupedNames.has(logo.name)).map(({ src, name }) => ({ src, name }));
  // Anything that matches no category stays visible rather than disappearing.
  if (other.length > 0) grouped.push({ title: "More", logos: other });

  const hero = {
    ...content.hero,
    slides: [SHOTS.connectedTv],
  };

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} backgroundPosition="62% 40%" />

      {/* What Connected TV is: the definition beside a streaming screen */}
      <section className={styles.about} aria-labelledby="dv-about">
        <div className={`container ${styles.aboutGrid}`}>
          <div>
            <p className={styles.label}>What Connected TV is</p>
            <SectionTitle as="h2" id="dv-about" className={styles.title}>
              Television advertising, delivered through streaming.
            </SectionTitle>
            <p className={styles.lead}>
              Connected TV advertising places your commercial inside the streaming apps people watch on their televisions.
              It keeps what makes TV work, a full-screen spot with sound and motion in the living room, and adds the
              targeting and reporting of digital media.
            </p>
            <h3 className={styles.aboutListTitle}>Where people watch</h3>
            <ul className={styles.aboutList}>
              {ABOUT.devices.map((device) => (
                <li key={device}>{device}</li>
              ))}
            </ul>
          </div>
          <Reveal variant="fade" className={styles.aboutPhoto}>
            <Image src={ABOUT.image.src} alt={ABOUT.image.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
          </Reveal>
        </div>
      </section>

      {/* Traditional TV and streaming TV, read across one row at a time */}
      <section className={styles.versus} aria-labelledby="dv-versus">
        <div className="container">
          <div className={styles.head}>
            <p className={styles.labelOnDark}>Traditional TV and streaming TV</p>
            <SectionTitle as="h2" id="dv-versus" className={styles.titleOnDark}>
              Same big screen. Different way to buy it.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Many plans use both: broadcast for broad reach and credibility, Connected TV to focus weight on the markets and
              audiences that matter most. Our <Link href="/services/television-advertising/">television advertising</Link>{" "}
              team plans them as one schedule.
            </p>
          </div>
          <TvCompareStudio />
        </div>
      </section>

      {/* Formats: one large Connected TV scene, two smaller placements stacked beside it */}
      <section className={styles.formats} aria-labelledby="dv-formats">
        <div className="container">
          <div className={`${styles.head} ${styles.centered}`}>
            <div>
              <p className={styles.label}>Streaming placements</p>
              <SectionTitle as="h2" id="dv-formats" className={styles.title}>
                Placements built for reach.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              Connected TV first, with online video and premium publisher placements to extend reach to phones, tablets and
              desktops.
            </p>
          </div>
          <div className={styles.formatGrid}>
            <Reveal variant="fade" as="article" className={`${styles.formatCard} ${styles.formatFeature}`}>
              <div className={styles.photo}>
                <Image
                  src="/images/connected-tv/mavi-living-room-evening.jpg"
                  alt="A Connected TV spot playing in a living room at dusk"
                  fill
                  sizes="(min-width: 960px) 85vw, 100vw"
                  className={styles.cover}
                />
                <PlayerChrome progress={64} />
              </div>
              <FormatCopy format={FORMATS.ctv} />
            </Reveal>
            <div className={styles.formatStack}>
              <Reveal delay={120} as="article" className={styles.formatCard}>
                <div className={styles.photo}>
                  {/* Daikin phone already shows sponsored video chrome — skip the overlay. */}
                  <Image
                    src={SHOTS.mobilePreRoll.src}
                    alt={SHOTS.mobilePreRoll.alt}
                    fill
                    sizes="(min-width: 960px) 38vw, 100vw"
                    className={styles.cover}
                  />
                </div>
                <FormatCopy format={FORMATS.preroll} />
              </Reveal>
              <Reveal delay={240} as="article" className={styles.formatCard}>
                <div className={styles.photo}>
                  <Image
                    src={SHOTS.tablet.src}
                    alt={SHOTS.tablet.alt}
                    fill
                    sizes="(min-width: 960px) 38vw, 100vw"
                    className={styles.cover}
                  />
                  <PlayerChrome progress={46} />
                </div>
                <FormatCopy format={FORMATS.outstream} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Planning: the four stages as two drifting rows of cards, top row right, bottom row left */}
      <section className={styles.plan} aria-labelledby="dv-plan">
        <div className="container">
          <div className={`${styles.head} ${styles.centered}`}>
            <div>
              <p className={styles.label}>Media planning</p>
              <SectionTitle as="h2" id="dv-plan" className={styles.title}>
                How a flight is planned.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              A mix of Connected TV, linear TV and digital video, planned for reach and frequency at efficient rates.
            </p>
          </div>
        </div>
        <FlightMarquee label="Flight planning stages" rows={[FLIGHT.slice(0, 2), FLIGHT.slice(2)]} />
      </section>

      {/* Targeting: four segments feed one placement, which lands on three surfaces */}
      <section className={styles.target} aria-labelledby="dv-target">
        <div className="container">
          <div className={styles.targetGrid}>
            <div className={styles.centered}>
              <p className={styles.label}>Geographic and demographic targeting</p>
              <SectionTitle as="h2" id="dv-target" className={styles.title}>
                The right households, in the right markets.
              </SectionTitle>
              <p className={styles.lead}>
                Geography, demographics, interests and viewing context shape who sees the spot, so the budget goes to the
                people most likely to become customers.
              </p>
            </div>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={styles.funnel} aria-hidden="true">
                  <ul className={styles.segments}>
                    {SEGMENTS.map((segment) => (
                      <li key={segment}>{segment}</li>
                    ))}
                  </ul>
                  <div className={styles.placement}>
                    <div className={styles.placementFrame}>
                      <Image src={SHOTS.tennis.src} alt="" fill sizes="(min-width: 960px) 45vw, 80vw" className={styles.cover} />
                    </div>
                    <span className={styles.placementLabel}>One video placement</span>
                  </div>
                  <ul className={styles.surfaces}>
                    {SURFACES.map((surface) => (
                      <li key={surface}>{surface}</li>
                    ))}
                  </ul>
                </div>
                <figcaption className={styles.caption}>
                  Demographic, geographic, behavioural and contextual signals shape one placement across screens.
                </figcaption>
              </figure>
            </Reveal>
          </div>
          {/* Local market visibility */}
          <ul className={styles.local}>
            {LOCAL.map((item) => (
              <li key={item.title}>
                <h3 className={styles.localTitle}>{item.title}</h3>
                <p className={styles.localBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <MaviShowcase />

      {/* Measurement: a live flight report beside the copy, four labels under it */}
      <section className={styles.report} aria-labelledby="dv-report">
        <div className="container">
          <div className={styles.reportGrid}>
            <div>
              <p className={styles.label}>Reporting</p>
              <SectionTitle as="h2" id="dv-report" className={styles.title}>
                Measured while the flight is live.
              </SectionTitle>
              <p className={styles.lead}>
                Real-time tracking across every placement, with room to adjust the campaign mid-flight.
              </p>
            </div>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={styles.dashboard} aria-hidden="true">
                  <div className={styles.dashHead}>
                    <span className={styles.dashTitle}>Campaign flight</span>
                    <span className={styles.live}>
                      <i />
                      Live
                    </span>
                  </div>
                  <div className={styles.dashCreative}>
                    <span className={styles.dashThumb}>
                      <Image
                        src="/images/connected-tv/mavi-living-room-day.jpg"
                        alt=""
                        fill
                        sizes="320px"
                        className={styles.cover}
                      />
                    </span>
                    <span className={styles.dashMeta}>
                      <span>CTV · Pre-roll · Outstream</span>
                      <span className={styles.flight}>
                        <span className={styles.flightBar} />
                      </span>
                      <span className={styles.flightLabel}>Flight in progress</span>
                    </span>
                  </div>
                  <ul className={styles.dashRows}>
                    {MEASURES.map((measure) => (
                      <li key={measure.name}>
                        <span>{measure.name}</span>
                        <span className={styles.status}>{measure.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <figcaption className={styles.caption}>Illustrative report layout. No client data.</figcaption>
              </figure>
            </Reveal>
          </div>
          <ul className={styles.measureLabels}>
            {MEASURE_LABELS.map((item) => (
              <li key={item.name}>
                <span className={styles.measureIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d={MEASURE_ICONS[item.icon]} />
                  </svg>
                </span>
                <span className={styles.measureName}>{item.name}</span>
                <span className={styles.measureLine}>{item.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners: the media landscape */}
      {grouped.length > 0 ? (
        <section className={styles.partners} aria-labelledby="dv-partners">
          <div className="container">
            <div className={`${styles.head} ${styles.centered}`}>
              <div>
                <p className={styles.label}>Distribution</p>
                <SectionTitle as="h2" id="dv-partners" className={styles.title}>
                  Where your ads can appear.
                </SectionTitle>
              </div>
              <p className={styles.lead}>Premium sports, streaming, news and entertainment inventory.</p>
            </div>
            <PartnerLandscape groups={grouped} />
          </div>
        </section>
      ) : null}

      <RelatedServices
        title="Connected TV works hardest alongside your other channels."
        current="/services/digital-connected-tv/"
        align="center"
      />

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
