import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./CorporateEventsPage.module.css";

const UPLOADS = "/wp-content/uploads";

const IMAGES = {
  sailing: { src: `${UPLOADS}/2023/06/wealth-management.jpg`, alt: "A group sailing in formation on open water at sunset" },
  coast: { src: `${UPLOADS}/2024/04/european-conference.webp`, alt: "Bell tower and domed roof above a coastal town on the Bay of Kotor" },
  poolside: { src: `${UPLOADS}/2024/07/conference-mexico.webp`, alt: "Two cocktails on the edge of a resort pool" },
  venue: { src: `${UPLOADS}/2025/05/golf-1.webp`, alt: "A bright event dining room set for guests" },
  destination: { src: `${UPLOADS}/2022/01/international-brands.webp`, alt: "Waves breaking against granite cliffs on a Cabo beach" },
  resort: { src: `${UPLOADS}/2026/04/hotel-riu-vallarta-1.jpg`, alt: "Resort pool and towers in Puerto Vallarta" },
  stage: { src: `${UPLOADS}/2025/08/IMG_2596-scaled.jpg`, alt: "A presenter on stage in front of a Trane screen aboard the Sun Princess" },
  hospitality: { src: `${UPLOADS}/2024/05/tournament-1.webp`, alt: "Margaritas served beside a bottle of tequila" },
  room: { src: `${UPLOADS}/2024/10/corporate-events.webp`, alt: "An audience listening to speakers at a corporate event" },
};

const EVENT_TYPES = [
  { href: "#incentive", label: "Incentive travel", title: "Reward & motivate", line: "Programs that celebrate performance in places worth the trip." },
  { href: "#trade-shows", label: "Trade shows", title: "Show up with impact", line: "A presence that draws traffic and turns visits into business." },
  { href: "#trade-shows", label: "Networking events", title: "Bring the right people together", line: "Rooms designed for the conversations that matter." },
];

const TRAVEL_POINTS = [
  { title: "Destination planning", line: "Places matched to the group and the goal." },
  { title: "Travel logistics", line: "Flights, stays and transfers handled." },
  { title: "Guest experience", line: "Curated activities for groups of any size." },
];

const CAPABILITIES = ["Venue", "Production", "Branding", "Guest experience", "Logistics"];

/* Figures stated on the page and in its FAQ */
const PROOF = [
  { figure: "40+", line: "groups taken to destinations worldwide" },
  { figure: "200+", line: "guests on international incentive programs" },
  { figure: "300+", line: "attendees at multi-day conferences" },
];

const LIFECYCLE = [
  { name: "Concept", line: "Goals, audience and budget shape the idea." },
  { name: "Planning", line: "Venues, vendors and logistics in one roadmap." },
  { name: "Production", line: "Every detail run on site, setup to teardown." },
  { name: "Follow-up", line: "Reporting and feedback that sharpen the next one." },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type CorporateEventsPageProps = {
  content: ServicePageContent;
};

export function CorporateEventsPage({ content }: CorporateEventsPageProps) {
  const { hero, faqs, cta } = content;
  const contactHref = cta?.primary.href || "/contact/";

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Intro: headline left, three layered photographs right */}
      <section className={styles.intro} aria-labelledby="ce-intro">
        <div className="container">
          <div className={styles.introGrid}>
            <div className={styles.introCopy}>
              <p className={styles.label}>Corporate events</p>
              <SectionTitle id="ce-intro" className={styles.display}>
                Experience the power of corporate events.
              </SectionTitle>
              <p className={styles.lead}>
                Conferences, incentive trips, trade shows and team events, planned from the first idea to the final
                farewell. From our base in Canada to destinations worldwide.
              </p>
              <Link className={styles.dark} href={contactHref}>
                Plan your event
                <ArrowIcon />
              </Link>
            </div>
            <div className={styles.collage}>
              <Reveal variant="fade" className={styles.collageMain}>
                <div className={styles.frame}>
                  <Image src={IMAGES.sailing.src} alt={IMAGES.sailing.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
                </div>
              </Reveal>
              <Reveal delay={120} className={styles.collageTall}>
                <div className={styles.frame}>
                  <Image src={IMAGES.coast.src} alt={IMAGES.coast.alt} fill sizes="(min-width: 960px) 22vw, 50vw" className={styles.cover} />
                </div>
              </Reveal>
              <Reveal delay={240} className={styles.collageSmall}>
                <div className={styles.frame}>
                  <Image src={IMAGES.poolside.src} alt={IMAGES.poolside.alt} fill sizes="(min-width: 960px) 18vw, 50vw" className={styles.cover} />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Event types: one featured venue, three ruled modules beside it */}
      <section className={styles.types} aria-labelledby="ce-types">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>What we produce</p>
            <SectionTitle id="ce-types" className={styles.title}>
              Four ways to bring people together.
            </SectionTitle>
          </div>
          <div className={styles.typesGrid}>
            <Reveal className={styles.featured}>
              <div className={styles.featuredFrame}>
                <Image src={IMAGES.venue.src} alt={IMAGES.venue.alt} fill sizes="(min-width: 960px) 55vw, 100vw" className={styles.cover} />
              </div>
              <div className={styles.featuredCopy}>
                <p className={styles.label}>Corporate events</p>
                <h3 className={styles.featuredTitle}>Create experiences people remember</h3>
                <p className={styles.body}>
                  Conferences, launches and team days that educate, motivate and leave a lasting impression.
                </p>
              </div>
            </Reveal>
            <ul className={styles.modules}>
              {EVENT_TYPES.map((type) => (
                <li key={type.label}>
                  <a className={styles.module} href={type.href}>
                    <span className={styles.moduleLabel}>{type.label}</span>
                    <span className={styles.moduleTitle}>{type.title}</span>
                    <span className={styles.moduleLine}>{type.line}</span>
                    <span className={styles.moduleArrow} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Incentive travel: a wide destination with a resort detail overlapping it */}
      <section id="incentive" className={styles.travel} aria-labelledby="ce-travel">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>Incentive travel</p>
            <SectionTitle id="ce-travel" className={styles.title}>
              Reward &amp; motivate.
            </SectionTitle>
          </div>
          <div className={styles.travelStage}>
            <Reveal variant="fade" className={styles.travelMain}>
              <div className={styles.frame}>
                <Image src={IMAGES.destination.src} alt={IMAGES.destination.alt} fill sizes="(min-width: 960px) 80vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <Reveal delay={150} className={styles.travelDetail}>
              <div className={styles.frame}>
                <Image src={IMAGES.resort.src} alt={IMAGES.resort.alt} fill sizes="(min-width: 960px) 30vw, 60vw" className={styles.cover} />
              </div>
            </Reveal>
          </div>
          <div className={styles.travelCopy}>
            <p className={styles.lead}>
              Domestic and international programs that celebrate success, from the first flight to the farewell
              dinner.
            </p>
            <ul className={styles.points}>
              {TRAVEL_POINTS.map((point) => (
                <li key={point.title}>
                  <span className={styles.pointTitle}>{point.title}</span>
                  <span className={styles.pointLine}>{point.line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trade shows: the stage photograph dominates, the headline panel locks into its edge,
          a hospitality detail sits beneath the copy, and the production scope runs along the base */}
      <section id="trade-shows" className={styles.trade} aria-labelledby="ce-trade">
        <div className="container">
          <div className={styles.tradeGrid}>
            <Reveal variant="fade" className={styles.tradeStage}>
              <figure className={styles.figure}>
                <div className={styles.tradeStageFrame}>
                  <Image src={IMAGES.stage.src} alt={IMAGES.stage.alt} fill sizes="(min-width: 960px) 58vw, 100vw" className={styles.cover} style={{ objectPosition: "60% 62%" }} />
                </div>
                <figcaption className={styles.captionOnDark}>Dealer presentation on board the Sun Princess.</figcaption>
              </figure>
            </Reveal>
            <div className={styles.tradeCopy}>
              <p className={styles.labelOnDark}>Showcase &amp; connect</p>
              <SectionTitle id="ce-trade" className={styles.tradeTitle}>
                Trade shows &amp; networking events
              </SectionTitle>
              <p className={styles.leadOnDark}>
                From pre-show promotion and booth design to on-site coordination and lead follow-up.
              </p>
            </div>
            <Reveal delay={220} className={styles.tradeDetail}>
              <figure className={styles.figure}>
                <div className={styles.tradeDetailFrame}>
                  <Image src={IMAGES.hospitality.src} alt={IMAGES.hospitality.alt} fill sizes="(min-width: 960px) 30vw, 70vw" className={styles.cover} />
                </div>
                <figcaption className={styles.statement}>Every touchpoint, from arrival to follow-up.</figcaption>
              </figure>
            </Reveal>
            <ol className={styles.scope} aria-label="What we handle">
              {CAPABILITIES.map((item, index) => (
                <Reveal key={item} as="li" delay={index * 90} className={styles.scopeItem}>
                  <span className={styles.scopeNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.scopeName}>{item}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* People: one oversized photograph, one line, then the figures */}
      <section className={styles.room} aria-labelledby="ce-room">
        <Reveal variant="fade">
          <div className={styles.roomPhoto}>
            <Image src={IMAGES.room.src} alt={IMAGES.room.alt} fill sizes="100vw" className={styles.cover} style={{ objectPosition: "50% 70%" }} />
            <div className={styles.roomShade} aria-hidden="true" />
            <div className={`container ${styles.roomCopy}`}>
              <h2 id="ce-room" className={styles.roomStatement}>
                The room is where the brand comes alive.
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="container">
          <ul className={styles.proof}>
            {PROOF.map((item) => (
              <li key={item.figure}>
                <span className={styles.proofFigure}>{item.figure}</span>
                <span className={styles.proofLine}>{item.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lifecycle: one line from concept to follow-up */}
      <section className={styles.lifecycle} aria-labelledby="ce-lifecycle">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>How we work</p>
            <SectionTitle id="ce-lifecycle" className={styles.title}>
              From plan to experience.
            </SectionTitle>
          </div>
          <ol className={styles.timeline}>
            {LIFECYCLE.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 120} className={styles.step}>
                <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.stepName}>{step.name}</span>
                <span className={styles.stepLine}>{step.line}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
