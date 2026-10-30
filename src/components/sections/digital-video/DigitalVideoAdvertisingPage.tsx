import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { FlightMarquee, type FlightStage } from "./FlightMarquee";
import { PartnerLandscape } from "./PartnerLandscape";
import styles from "./DigitalVideoAdvertisingPage.module.css";

type DigitalVideoAdvertisingPageProps = {
  content: ServicePageContent;
};

const UPLOADS = "/wp-content/uploads";

const SHOTS = {
  livingRoom: { src: `${UPLOADS}/2026/06/tv-streaming-advertising-1.jpg`, alt: "Living-room television open to the Prime Video app" },
  tablet: { src: `${UPLOADS}/2023/06/streaming-ads.png`, alt: "Tablet playing a motorsport video, with the TSN mark in the corner" },
  wallTv: { src: `${UPLOADS}/2026/06/digital-streaming-advertising-1.jpg`, alt: "Wall-mounted television showing a Formula 1 race" },
  couch: { src: `${UPLOADS}/2026/02/connected-tv-advertising.jpg`, alt: "A viewer streaming on a tablet from the couch" },
  /* One creative frame, reused on every screen in the campaign section */
  creative: { src: `${UPLOADS}/2026/02/media-buying.jpg`, alt: "" },
};

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
    image: SHOTS.couch,
  },
  {
    number: "02",
    name: "Creative",
    line: "Message and format matched to how they watch.",
    meta: "Matched to the screen",
    image: { src: SHOTS.creative.src, alt: "A campaign creative frame" },
  },
  {
    number: "03",
    name: "Placement",
    line: "Connected TV, online video and premium inventory.",
    meta: "CTV · Pre-roll · Outstream",
    image: SHOTS.livingRoom,
  },
  {
    number: "04",
    name: "Optimization",
    line: "Adjusted in flight for reach, frequency and efficiency.",
    meta: "Live",
    live: true,
    image: SHOTS.tablet,
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

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {/* Formats: one large Connected TV scene, two smaller placements stacked beside it */}
      <section className={styles.formats} aria-labelledby="dv-formats">
        <div className="container">
          <div className={`${styles.head} ${styles.centered}`}>
            <div>
              <p className={styles.label}>Placements</p>
              <SectionTitle as="h2" id="dv-formats" className={styles.title}>
                Where the spot runs.
              </SectionTitle>
            </div>
            <p className={styles.lead}>Connected TV, online video and premium publisher placements.</p>
          </div>
          <div className={styles.formatGrid}>
            <Reveal variant="fade" as="article" className={`${styles.formatCard} ${styles.formatFeature}`}>
              <div className={styles.photo}>
                <Image src={SHOTS.livingRoom.src} alt={SHOTS.livingRoom.alt} fill sizes="(min-width: 960px) 58vw, 100vw" className={styles.cover} />
                <PlayerChrome progress={64} />
              </div>
              <FormatCopy format={FORMATS.ctv} />
            </Reveal>
            <div className={styles.formatStack}>
              <Reveal delay={120} as="article" className={styles.formatCard}>
                <div className={styles.photo}>
                  <Image src={SHOTS.tablet.src} alt={SHOTS.tablet.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.cover} />
                  <PlayerChrome progress={28} />
                </div>
                <FormatCopy format={FORMATS.preroll} />
              </Reveal>
              <Reveal delay={240} as="article" className={styles.formatCard}>
                <div className={styles.photo}>
                  <Image src={SHOTS.wallTv.src} alt={SHOTS.wallTv.alt} fill sizes="(min-width: 960px) 38vw, 100vw" className={styles.cover} />
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
          <div className={styles.head}>
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
          <div className={styles.ruler} aria-hidden="true" />
        </div>
        <FlightMarquee label="Flight planning stages" rows={[FLIGHT.slice(0, 2), FLIGHT.slice(2)]} />
      </section>

      {/* Targeting: four segments feed one placement, which lands on three surfaces */}
      <section className={styles.target} aria-labelledby="dv-target">
        <div className="container">
          <div className={styles.targetGrid}>
            <div className={styles.centered}>
              <p className={styles.label}>Audience targeting</p>
              <SectionTitle as="h2" id="dv-target" className={styles.title}>
                Target the right creative to the right audience.
              </SectionTitle>
              <p className={styles.lead}>
                Creative aligned with audience behaviour and channel performance, so the message connects where it
                matters most.
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
                      <Image src={SHOTS.couch.src} alt="" fill sizes="(min-width: 960px) 45vw, 80vw" className={styles.cover} />
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
        </div>
      </section>

      {/* Campaign: the same creative on a television, a tablet and a phone, near full width */}
      <section className={styles.campaign} aria-labelledby="dv-campaign">
        <div className="container">
          <div className={styles.campaignHead}>
            <p className={styles.labelOnDark}>One creative system</p>
            <SectionTitle as="h2" id="dv-campaign" className={styles.displayOnDark}>
              One campaign. Every screen.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Build one strong creative system and adapt it across the places your audience watches.
            </p>
          </div>
          <Reveal variant="fade" className={styles.screens}>
            <div className={styles.tv} aria-hidden="true">
              <div className={styles.screen}>
                <Image src={SHOTS.creative.src} alt="" fill sizes="(min-width: 960px) 70vw, 100vw" className={styles.cover} />
                <span className={styles.screenTag}>Connected TV</span>
              </div>
            </div>
            <div className={styles.tabletDevice} aria-hidden="true">
              <div className={styles.screen}>
                <Image src={SHOTS.creative.src} alt="" fill sizes="30vw" className={styles.cover} />
                <span className={styles.screenTag}>Pre-roll</span>
              </div>
            </div>
            <div className={styles.phone} aria-hidden="true">
              <div className={styles.screen}>
                <Image src={SHOTS.creative.src} alt="" fill sizes="20vw" className={styles.cover} style={{ objectPosition: "62% 50%" }} />
                <span className={styles.screenTag}>Vertical</span>
              </div>
            </div>
          </Reveal>
          <p className={styles.visuallyHidden}>The same campaign creative shown on a television, a tablet and a phone.</p>
        </div>
      </section>

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
                      <Image src={SHOTS.creative.src} alt="" fill sizes="200px" className={styles.cover} />
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

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
