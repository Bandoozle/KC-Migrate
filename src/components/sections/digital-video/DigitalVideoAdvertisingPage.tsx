import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { PartnerLandscape } from "./PartnerLandscape";
import styles from "./DigitalVideoAdvertisingPage.module.css";

type DigitalVideoAdvertisingPageProps = {
  content: ServicePageContent;
};

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

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
  { name: "Completion", line: "How much of the spot viewers watch." },
  { name: "Reach & frequency", line: "How many people, how often." },
  { name: "Brand lift", line: "What changes after they see it." },
  { name: "Attribution", line: "Site visits and conversions across devices." },
];

const PARTNER_GROUPS: Array<{ title: string; test: RegExp }> = [
  { title: "Sports", test: /sportsnet|tsn|espn|golf/i },
  { title: "Streaming", test: /crave|hulu/i },
  { title: "News", test: /cnn|cp24|global|cbc/i },
  { title: "Entertainment", test: /fox|nbc|cbs|discovery|hgtv|tlc|food|rogers|\be!/i },
  { title: "Audio", test: /spotify/i },
];

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
          <div className={styles.head}>
            <div>
              <p className={styles.label}>Placements</p>
              <SectionTitle as="h2" id="dv-formats" className={styles.title}>
                Where the spot runs.
              </SectionTitle>
            </div>
            <p className={styles.lead}>Connected TV, online video and premium publisher placements.</p>
          </div>
          <div className={styles.formatGrid}>
            <Reveal variant="fade" as="article" className={styles.formatLarge}>
              <div className={styles.photo}>
                <Image src={SHOTS.livingRoom.src} alt={SHOTS.livingRoom.alt} fill sizes="(min-width: 960px) 60vw, 100vw" className={styles.cover} />
              </div>
              <FormatCopy format={FORMATS.ctv} />
            </Reveal>
            <Reveal delay={120} as="article" className={styles.formatSmall}>
              <div className={styles.photo}>
                <Image src={SHOTS.tablet.src} alt={SHOTS.tablet.alt} fill sizes="(min-width: 960px) 35vw, 100vw" className={styles.cover} />
              </div>
              <FormatCopy format={FORMATS.preroll} />
            </Reveal>
            <Reveal delay={240} as="article" className={styles.formatSmall}>
              <div className={styles.photo}>
                <Image src={SHOTS.wallTv.src} alt={SHOTS.wallTv.alt} fill sizes="(min-width: 960px) 35vw, 100vw" className={styles.cover} />
              </div>
              <FormatCopy format={FORMATS.outstream} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Planning: a media-planning board, four stages on one line with an artifact each */}
      <section className={styles.plan} aria-labelledby="dv-plan">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.labelOnDark}>Media planning</p>
              <SectionTitle as="h2" id="dv-plan" className={styles.titleOnDark}>
                How a flight is planned.
              </SectionTitle>
            </div>
            <p className={styles.leadOnDark}>
              A mix of Connected TV, linear TV and digital video, planned for reach and frequency at efficient rates.
            </p>
          </div>
          <ol className={styles.board}>
            <Reveal as="li" className={styles.stage}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.stageNumber}>01</span>
              <span className={styles.stageName}>Audience</span>
              <span className={styles.stageLine}>Viewers chosen by geography, interests and behaviour.</span>
              <span className={styles.artifact} aria-hidden="true">
                <span className={styles.chip}>Geography</span>
                <span className={styles.chip}>Interests</span>
              </span>
            </Reveal>
            <Reveal as="li" delay={110} className={styles.stage}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.stageNumber}>02</span>
              <span className={styles.stageName}>Creative</span>
              <span className={styles.stageLine}>Message and format matched to how they watch.</span>
              <span className={styles.artifact} aria-hidden="true">
                <span className={styles.thumb}>
                  <Image src={SHOTS.creative.src} alt="" fill sizes="160px" className={styles.cover} />
                  <span className={styles.thumbPlay} />
                </span>
              </span>
            </Reveal>
            <Reveal as="li" delay={220} className={styles.stage}>
              <span className={styles.node} aria-hidden="true" />
              <span className={styles.stageNumber}>03</span>
              <span className={styles.stageName}>Placement</span>
              <span className={styles.stageLine}>Connected TV, online video and premium inventory.</span>
              <span className={styles.artifact} aria-hidden="true">
                <span className={styles.channels}>CTV · Pre-roll · Outstream</span>
              </span>
            </Reveal>
            <Reveal as="li" delay={330} className={styles.stage}>
              <span className={`${styles.node} ${styles.nodeLive}`} aria-hidden="true" />
              <span className={styles.stageNumber}>04</span>
              <span className={styles.stageName}>Optimization</span>
              <span className={styles.stageLine}>Adjusted in flight for reach, frequency and efficiency.</span>
              <span className={styles.artifact} aria-hidden="true">
                <span className={styles.live}>
                  <i />
                  Live
                </span>
              </span>
            </Reveal>
          </ol>
        </div>
      </section>

      {/* Targeting: four segments feed one placement, which lands on three surfaces */}
      <section className={styles.target} aria-labelledby="dv-target">
        <div className="container">
          <div className={styles.targetGrid}>
            <div>
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
                      <Image src={SHOTS.couch.src} alt="" fill sizes="(min-width: 960px) 35vw, 80vw" className={styles.cover} />
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
            <div className={styles.head}>
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
