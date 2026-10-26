import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { VimeoFeature } from "@/components/sections/hvac/VimeoFeature";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./GolfMarketingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const IMAGES = {
  teeShot: { src: `${UPLOADS}/2026/06/golf-course-branding-marketing.jpg`, alt: "A golfer lining up an approach shot on a tree-lined fairway" },
  fairway: { src: `${UPLOADS}/2026/03/golf-course-branding.jpg`, alt: "A golfer walking down a sunlit fairway with his bag" },
  clubhouse: { src: `${UPLOADS}/2026/06/golf-course-marketing-food-beverage.jpg`, alt: "Tacos, salads and a spritz on the Chilliwack Golf Club patio" },
  course: { src: `${UPLOADS}/2026/02/arizona-golf-course-marketing.jpg`, alt: "Aerial view of a desert golf course below a mountain range" },
  green: { src: `${UPLOADS}/2026/06/golf-social-media-marketing.jpg`, alt: "A putting green framed by rhododendrons and tall firs" },
  uncorked: { src: `${UPLOADS}/2024/05/golf-event.webp`, alt: "Uncorked Invitational logo" },
};

/* The four offer cards, renamed as holes on the scorecard */
const SCORECARD = [
  { play: "Drive demand", line: "Lead generation across digital and traditional channels." },
  { play: "Grow membership", line: "Keep your course visible and valuable year-round." },
  { play: "Promote events", line: "Fill tournaments, corporate outings and seasonal experiences." },
  { play: "Improve performance", line: "Track results and optimize for revenue growth." },
];

const TARGETS = ["Local golfers", "Members", "Corporate groups", "Visiting players"];

const TEE_POINTS = [
  { name: "Search", line: "Google Ads built on golf and tee-time intent." },
  { name: "Social & video", line: "Facebook, Instagram, YouTube and Connected TV." },
  { name: "Local reach", line: "Outdoor and radio across your market." },
  { name: "Booking", line: "A site with online tee times and a pro shop." },
];

const FAIRWAY = ["Traffic", "Interest", "Booking", "Repeat play", "Revenue"];

const EVENT_THEMES = [
  /* Tee times only set the order of play on the sheet */
  { tee: "Week 1", name: "Tournament promotion", line: "Registration and awareness campaigns." },
  { tee: "Week 2", name: "Sponsor visibility", line: "Sponsor acquisition and on-course presence." },
  { tee: "Week 4", name: "Player registration", line: "Email and SMS sequences that drive attendance." },
  { tee: "After", name: "Post-event follow-up", line: "Content and photos that sell next year." },
];

const ROUND = [
  { name: "Discovery", line: "Understand the course, audience and goals." },
  { name: "Strategy", line: "Build the right mix of channels and offers." },
  { name: "Launch", line: "Activate campaigns, events and content." },
  { name: "Optimize", line: "Track performance and improve results." },
];

function hole(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Faint topographic lines, used behind a few sections like the contours on a course map. */
function Contours({ className }: { className?: string }) {
  return (
    <svg className={[styles.contours, className].filter(Boolean).join(" ")} viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {[0, 1, 2, 3, 4, 5].map((ring) => (
        <path
          key={ring}
          d={`M ${-40 + ring * 12} ${210 + ring * 26} C ${140 - ring * 6} ${110 + ring * 20}, ${300 + ring * 10} ${300 - ring * 14}, ${470 + ring * 8} ${180 + ring * 18} S ${720 - ring * 6} ${80 + ring * 24}, ${860} ${150 + ring * 26}`}
        />
      ))}
    </svg>
  );
}

function Flag() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M7 21V3l10 4-10 4" />
    </svg>
  );
}

function HoleMarker({ number, label, dark = false }: { number: string; label: string; dark?: boolean }) {
  return (
    <p className={dark ? `${styles.marker} ${styles.markerDark}` : styles.marker}>
      <span className={styles.markerHole}>Hole {number}</span>
      <span className={styles.markerLabel}>{label}</span>
    </p>
  );
}

type GolfMarketingPageProps = {
  content: ServicePageContent;
};

export function GolfMarketingPage({ content }: GolfMarketingPageProps) {
  const { hero, faqs, cta } = content;
  const broadcast = content.videoSections.find((section) => /vimeo\.com\/video\/\d+/.test(section.src));
  const broadcastId = broadcast?.src.match(/vimeo\.com\/video\/(\d+)/)?.[1];

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Scorecard: the four plays as a card you'd find in the cart */}
      <section className={styles.scorecardSection} aria-labelledby="gm-scorecard">
        <Contours />
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>The course</p>
              <SectionTitle id="gm-scorecard" className={styles.title}>
                Full-service golf marketing.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              From lead generation and membership growth to tournament promotion and measurable revenue performance.
            </p>
          </div>
          <div className={styles.scorecard} role="table" aria-label="Golf marketing scorecard">
            <div className={styles.scoreRow} role="row">
              <span className={styles.scoreLabel} role="rowheader">
                Hole
              </span>
              {SCORECARD.map((item, index) => (
                <span key={item.play} className={styles.scoreHole} role="cell">
                  {hole(index)}
                </span>
              ))}
            </div>
            <div className={styles.scoreRow} role="row">
              <span className={styles.scoreLabel} role="rowheader">
                Play
              </span>
              {SCORECARD.map((item) => (
                <span key={item.play} className={styles.scorePlay} role="cell">
                  {item.play}
                </span>
              ))}
            </div>
            <div className={styles.scoreRow} role="row">
              <span className={styles.scoreLabel} role="rowheader">
                Focus
              </span>
              {SCORECARD.map((item) => (
                <span key={item.play} className={styles.scoreLine} role="cell">
                  {item.line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tee shot: a golfer at address, audience targets routed toward one booking flag */}
      <section className={styles.tee} aria-labelledby="gm-tee">
        <div className="container">
          <div className={styles.teeGrid}>
            <Reveal variant="fade" className={styles.teeMedia}>
              <div className={styles.teePhoto}>
                <Image src={IMAGES.teeShot.src} alt={IMAGES.teeShot.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
                <div className={styles.routing} aria-hidden="true">
                  <svg className={styles.routeLine} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 12 92 C 30 70, 70 72, 58 50 S 30 24, 78 10" />
                  </svg>
                  <ul className={styles.targets}>
                    {TARGETS.map((target) => (
                      <li key={target}>{target}</li>
                    ))}
                  </ul>
                  <span className={styles.pin}>
                    <Flag />
                    Tee time booked
                  </span>
                </div>
              </div>
            </Reveal>
            <div>
              <HoleMarker number="01" label="Tee shot" />
              <SectionTitle id="gm-tee" className={styles.title}>
                Reach the right golfers at the right time.
              </SectionTitle>
              <p className={styles.lead}>
                Omni-channel campaigns that find local golfers looking for their next round and high-value prospects
                looking for a club, then send them somewhere built to book.
              </p>
              <ul className={styles.yardage}>
                {TEE_POINTS.map((point, index) => (
                  <li key={point.name}>
                    <span className={styles.yards}>{hole(index)}</span>
                    <span className={styles.pointName}>{point.name}</span>
                    <span className={styles.pointLine}>{point.line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fairway: a wide walking shot, then the path from traffic to revenue */}
      <section className={styles.fairway} aria-labelledby="gm-fairway">
        <div className="container">
          <div className={styles.head}>
            <div>
              <HoleMarker number="02" label="The fairway" />
              <SectionTitle id="gm-fairway" className={styles.title}>
                Turn interest into rounds, memberships and event revenue.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              Brand awareness is your most powerful revenue driver. We make your course the first name golfers
              think of, then track every step from first visit to the pro shop and patio.
            </p>
          </div>
          <div className={styles.fairwayStage}>
            <Reveal variant="fade" className={styles.fairwayWide}>
              <div className={styles.photo}>
                <Image src={IMAGES.fairway.src} alt={IMAGES.fairway.alt} fill sizes="(min-width: 960px) 70vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <Reveal delay={150} className={styles.fairwayDetail}>
              <figure className={styles.figure}>
                <div className={styles.photo}>
                  <Image src={IMAGES.clubhouse.src} alt={IMAGES.clubhouse.alt} fill sizes="(min-width: 960px) 25vw, 60vw" className={styles.cover} />
                </div>
                <figcaption className={styles.caption}>Food and beverage counts toward the round.</figcaption>
              </figure>
            </Reveal>
          </div>
          <ol className={styles.path} aria-label="From traffic to revenue">
            {FAIRWAY.map((step, index) => (
              <Reveal key={step} as="li" delay={index * 90} className={styles.pathStep}>
                <span className={index === FAIRWAY.length - 1 ? `${styles.pathDot} ${styles.pathDotEnd}` : styles.pathDot} aria-hidden="true">
                  {index === FAIRWAY.length - 1 ? <Flag /> : null}
                </span>
                <span className={styles.pathName}>{step}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Events: the green. A wide course aerial with an event card set on it */}
      <section className={styles.events} aria-labelledby="gm-events">
        <Contours className={styles.contoursDark} />
        <div className="container">
          <HoleMarker number="03" label="On the green" dark />
          <SectionTitle id="gm-events" className={styles.displayOnDark}>
            Fill tournaments and make every event feel bigger.
          </SectionTitle>
          <p className={styles.leadOnDark}>
            Tournaments, charity events and corporate outings, marketed from first announcement to the photos that
            sell next year.
          </p>
          <div className={styles.eventStage}>
            <Reveal variant="fade" className={styles.eventWide}>
              <div className={styles.photo}>
                <Image src={IMAGES.course.src} alt={IMAGES.course.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <Reveal delay={150} className={styles.eventCard}>
              <div className={styles.eventLogo}>
                <Image src={IMAGES.uncorked.src} alt={IMAGES.uncorked.alt} fill sizes="240px" className={styles.contain} />
              </div>
              <p className={styles.eventKicker}>Kosick event</p>
              <p className={styles.eventName}>Uncorked Invitational</p>
              <ul className={styles.itinerary} aria-label="Tournament day">
                <li>
                  <span>Registration</span>
                  <span>Check-in &amp; welcome</span>
                </li>
                <li>
                  <span>On course</span>
                  <span>Sponsor holes &amp; contests</span>
                </li>
                <li>
                  <span>Clubhouse</span>
                  <span>Dinner &amp; awards</span>
                </li>
              </ul>
            </Reveal>
          </div>
          {/* Event services set as a tournament tee sheet */}
          <div className={styles.teeSheet}>
            <div className={styles.sheetTitle}>
              <span>Tournament tee sheet</span>
              <span>Shotgun start</span>
            </div>
            <table className={styles.sheet}>
              <thead>
                <tr>
                  <th scope="col">Tee</th>
                  <th scope="col">What we run</th>
                  <th scope="col">How</th>
                  <th scope="col">Hole</th>
                </tr>
              </thead>
              <tbody>
                {EVENT_THEMES.map((theme, index) => (
                  <tr key={theme.name}>
                    <td className={styles.sheetTime}>{theme.tee}</td>
                    <th scope="row" className={styles.sheetName}>
                      {theme.name}
                      <small aria-hidden="true">{theme.line}</small>
                    </th>
                    <td className={styles.sheetLine}>{theme.line}</td>
                    <td className={styles.sheetHole}>
                      <span>{hole(index)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Broadcast: the Sportsnet spot, presented as a feature */}
      {broadcastId ? (
        <section className={styles.broadcast} aria-labelledby="gm-broadcast">
          <div className="container">
            <div className={styles.broadcastGrid}>
              <div className={styles.broadcastCopy}>
                <p className={styles.onAir}>
                  <i aria-hidden="true" />
                  As seen on Sportsnet
                </p>
                <SectionTitle id="gm-broadcast" className={styles.titleOnDark}>
                  Seen by golf audiences beyond the course.
                </SectionTitle>
                <p className={styles.leadOnDark}>
                  Our Mount Baker Golf Trail spot, produced and placed for golf fans watching at home.
                </p>
              </div>
              <Reveal variant="fade" className={styles.broadcastMedia}>
                <VimeoFeature id={broadcastId} title="the Mount Baker Golf Trail spot" poster="/images/golf-sportsnet-poster.jpg" inline={false} />
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      {/* The round: four holes on one routed path */}
      <section className={styles.round} aria-labelledby="gm-round">
        <Contours />
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>How we work</p>
              <SectionTitle id="gm-round" className={styles.title}>
                Our golf marketing process.
              </SectionTitle>
            </div>
            <p className={styles.lead}>Four holes from first conversation to a program that keeps improving.</p>
          </div>
          <ol className={styles.holes}>
            <svg className={styles.holesRoute} viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M 0 90 C 120 90, 160 30, 250 30 S 400 90, 500 90 S 660 30, 750 30 S 900 90, 1000 90" />
            </svg>
            {ROUND.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 120} className={index % 2 ? `${styles.holeStep} ${styles.holeHigh}` : styles.holeStep}>
                <span className={styles.holeFlag} aria-hidden="true">
                  <Flag />
                </span>
                <span className={styles.holeNumber}>Hole {hole(index)}</span>
                <span className={styles.holeName}>{step.name}</span>
                <span className={styles.holeLine}>{step.line}</span>
              </Reveal>
            ))}
          </ol>
          <div className={styles.greenStrip}>
            <Reveal variant="fade" className={styles.greenPhoto}>
              <div className={styles.photo}>
                <Image src={IMAGES.green.src} alt={IMAGES.green.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <p className={styles.greenNote}>Every round ends on the green: more tee times, more members and fuller events.</p>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
