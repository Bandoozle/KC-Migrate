import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ProcessTrack } from "@/components/sections/ProcessSteps";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./DentalMarketingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

/* Sparkle Dental Spa is the one practice carried through the campaign section */
const IMAGES = {
  hygienist: { src: `${UPLOADS}/2026/07/Dental-Marketing.jpg`, alt: "A hygienist preparing instruments beside a patient in the chair" },
  recall: { src: `${UPLOADS}/2026/07/Dental-Lead-Generation.jpg`, alt: "A hygienist with a patient, an appointment calendar overlaid" },
  social: { src: `${UPLOADS}/2026/07/Social-Media-Dental.jpg`, alt: "Social content for a dental spa: waiting room, products and details" },
  sparkleSite: { src: `${UPLOADS}/2026/07/Screenshot-2026-07-22-at-11.22.57-PM.jpg`, alt: "Sparkle Dental Spa home page" },
  sparkleLaptop: { src: `${UPLOADS}/2026/07/Dental-Web-Development.jpg`, alt: "The Sparkle Dental Spa website on a laptop" },
  sparkleOutdoor: { src: `${UPLOADS}/2026/06/outdoor-advertising.jpg`, alt: "Sparkle Dental Spa transit shelter ad reading Be Flossome" },
  sparkleSpa: { src: `${UPLOADS}/2026/07/Dental-Vancouver.jpg`, alt: "The Sparkle Dental Spa waiting room with a gold tooth on the table" },
};

const JOURNEY = [
  { name: "Get found", line: "Search and local visibility." },
  { name: "Get chosen", line: "Reputation and brand trust." },
  { name: "Get booked", line: "Conversion and appointment flow." },
  { name: "Keep growing", line: "Retention and ongoing engagement." },
];

const SEARCH_POINTS = [
  { name: "Local SEO", line: "Rank for “dentist near me” and city searches." },
  { name: "Google Business Profile", line: "A listing patients choose first." },
  { name: "Search visibility", line: "Landing pages for every service you offer." },
];

const TRUST_THEMES = [
  { name: "Reviews", line: "Review generation and reputation management." },
  { name: "Website conversion", line: "Clear content and calls to action." },
  { name: "Appointment experience", line: "Online booking that takes seconds." },
];

const RETENTION = ["Appointment", "Follow-up", "Recall", "Review", "Return"];

const SYSTEM = [
  { group: "Get found", items: ["SEO", "Local search", "Paid search"] },
  { group: "Build trust", items: ["Branding", "Reputation", "Content"] },
  { group: "Convert", items: ["Website development", "Landing pages", "Appointment UX"] },
  { group: "Stay connected", items: ["Email", "Social", "Retention"] },
  { group: "Measure", items: ["Analytics", "Reporting", "Strategy"] },
];

function Stars() {
  return (
    <span className={styles.stars} aria-hidden="true">
      ★★★★★
    </span>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type DentalMarketingPageProps = {
  content: ServicePageContent;
};

export function DentalMarketingPage({ content }: DentalMarketingPageProps) {
  const { hero, faqs, cta } = content;
  const contactHref = cta?.primary.href || "/contact/";
  // The WordPress CTA on this page carries email-marketing copy, so the close is written for dental
  const closing = cta
    ? {
        ...cta,
        title: "Ready to grow your practice?",
        description: "Let’s build a plan that fills your schedule with the patients you want.",
      }
    : null;

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Journey: four stages on one line */}
      <section className={styles.journey} aria-labelledby="dm-journey">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>The patient journey</p>
              <SectionTitle id="dm-journey" className={styles.title}>
                Dental marketing built for growing practices.
              </SectionTitle>
            </div>
            <p className={styles.lead}>Build visibility, earn trust and turn more searches into booked patients.</p>
          </div>
          <ProcessTrack
            className={styles.journeyTrack}
            steps={JOURNEY.map((stage, index) => ({
              number: String(index + 1),
              title: stage.name,
              body: stage.line,
            }))}
          />
        </div>
      </section>

      {/* Acquisition: an illustrative search, map and listing composition */}
      <section className={styles.search} aria-labelledby="dm-search">
        <div className="container">
          <div className={styles.searchGrid}>
            <Reveal variant="fade">
              <figure className={styles.figure}>
                <div className={styles.searchStage} aria-hidden="true">
                  <div className={styles.serp}>
                    <div className={styles.searchBar}>dentist near me</div>
                    <div className={styles.map}>
                      <span className={`${styles.pin} ${styles.pinLead}`} style={{ left: "44%", top: "42%" }} />
                      <span className={styles.pin} style={{ left: "22%", top: "66%" }} />
                      <span className={styles.pin} style={{ left: "74%", top: "60%" }} />
                    </div>
                    <div className={`${styles.listing} ${styles.listingLead}`}>
                      <span className={styles.listingName}>Your practice</span>
                      <Stars />
                      <span className={styles.listingMeta}>Open now · Book online · Call</span>
                    </div>
                    <div className={styles.listing}>
                      <span className={styles.listingName}>Nearby practice</span>
                      <span className={styles.listingMeta}>Directions</span>
                    </div>
                  </div>
                  <div className={styles.phone}>
                    <div className={styles.phoneScreen}>
                      <Image src={IMAGES.sparkleSite.src} alt="" fill sizes="200px" className={styles.cover} style={{ objectPosition: "20% 0%" }} />
                    </div>
                  </div>
                </div>
                <figcaption className={styles.caption}>Illustrative search result and local listing.</figcaption>
              </figure>
            </Reveal>
            <div>
              <p className={styles.label}>Patient acquisition</p>
              <SectionTitle id="dm-search" className={styles.title}>
                Be there when patients are searching.
              </SectionTitle>
              <p className={styles.lead}>
                Most new patients start with a Google search. We put your practice at the top for routine care and
                high-value specialty services.
              </p>
              <ul className={styles.points}>
                {SEARCH_POINTS.map((point) => (
                  <li key={point.name}>
                    <span className={styles.pointName}>{point.name}</span>
                    <span className={styles.pointLine}>{point.line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust: one large practice photograph with a review and booking layer */}
      <section className={styles.trust} aria-labelledby="dm-trust">
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustCopy}>
              <p className={styles.label}>Conversion &amp; reputation</p>
              <SectionTitle id="dm-trust" className={styles.display}>
                Turn trust into appointments.
              </SectionTitle>
              <p className={styles.lead}>
                A strong reputation, clear website and simple booking experience help turn searchers into new
                patients.
              </p>
              <ul className={styles.themes}>
                {TRUST_THEMES.map((theme) => (
                  <li key={theme.name}>
                    <span className={styles.pointName}>{theme.name}</span>
                    <span className={styles.pointLine}>{theme.line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Reveal variant="fade" className={styles.trustMedia}>
              <div className={styles.trustPhoto}>
                <Image src={IMAGES.hygienist.src} alt={IMAGES.hygienist.alt} fill sizes="(min-width: 960px) 50vw, 100vw" className={styles.cover} />
              </div>
              <div className={styles.reviewLayer} aria-hidden="true">
                <Stars />
                <span className={styles.reviewTitle}>New patient review</span>
                <span className={styles.reviewLine} />
                <span className={`${styles.reviewLine} ${styles.short}`} />
              </div>
              <div className={styles.bookedLayer} aria-hidden="true">
                <span className={styles.bookedIcon}>
                  <CheckIcon />
                </span>
                <span>
                  <span className={styles.bookedTitle}>Appointment confirmed</span>
                  <span className={styles.bookedMeta}>Cleaning &amp; check-up</span>
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Paid: one campaign moving a patient from ad to booking */}
      <section className={styles.paid} aria-labelledby="dm-paid">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.labelOnDark}>Paid advertising</p>
              <SectionTitle id="dm-paid" className={styles.titleOnDark}>
                Reach the right patients at the right time.
              </SectionTitle>
            </div>
            <p className={styles.leadOnDark}>
              Google and Meta campaigns focused on the services that drive the most revenue, with retargeting for
              visitors who didn&rsquo;t book.
            </p>
          </div>
          <ol className={styles.paidFlow} aria-label="From ad to appointment">
            <Reveal as="li" className={styles.paidStep}>
              <div className={styles.paidVisual} aria-hidden="true">
                <div className={styles.adCard}>
                  <span className={styles.adTag}>Sponsored</span>
                  <span className={styles.adTitle}>Invisalign consultations</span>
                  <span className={styles.adUrl}>yourpractice.ca</span>
                  <span className={styles.reviewLine} />
                </div>
              </div>
              <span className={styles.paidName}>Search ad</span>
              <span className={styles.paidLine}>High-intent searches for your services.</span>
            </Reveal>
            <Reveal as="li" delay={110} className={styles.paidStep}>
              <div className={styles.paidVisual}>
                <Image src={IMAGES.social.src} alt={IMAGES.social.alt} fill sizes="(min-width: 960px) 22vw, 50vw" className={styles.cover} />
              </div>
              <span className={styles.paidName}>Social &amp; display</span>
              <span className={styles.paidLine}>Facebook and Instagram awareness.</span>
            </Reveal>
            <Reveal as="li" delay={220} className={styles.paidStep}>
              <div className={styles.paidVisual}>
                <Image src={IMAGES.sparkleSite.src} alt={IMAGES.sparkleSite.alt} fill sizes="(min-width: 960px) 22vw, 50vw" className={styles.cover} style={{ objectPosition: "top left" }} />
              </div>
              <span className={styles.paidName}>Landing page</span>
              <span className={styles.paidLine}>One page per treatment, built to book.</span>
            </Reveal>
            <Reveal as="li" delay={330} className={styles.paidStep}>
              <div className={`${styles.paidVisual} ${styles.paidBooked}`} aria-hidden="true">
                <span className={styles.bookedIcon}>
                  <CheckIcon />
                </span>
                <span className={styles.bookedTitle}>Booked</span>
                <span className={styles.bookedMeta}>Call tracked and attributed</span>
              </div>
              <span className={styles.paidName}>Appointment</span>
              <span className={styles.paidLine}>Calls and bookings tracked to the ad.</span>
            </Reveal>
          </ol>
        </div>
      </section>

      {/* Retention: the relationship after the first visit */}
      <section className={styles.retention} aria-labelledby="dm-retention">
        <div className="container">
          <div className={styles.retentionGrid}>
            <div>
              <p className={styles.label}>Retention &amp; engagement</p>
              <SectionTitle id="dm-retention" className={styles.title}>
                Keep patients connected to your practice.
              </SectionTitle>
              <p className={styles.lead}>
                Email reminders, recall campaigns and social content keep patients coming back, and the most
                profitable practices are built on returning patients.
              </p>
              <ol className={styles.cycle}>
                {RETENTION.map((step, index) => (
                  <Reveal key={step} as="li" delay={index * 90} className={styles.cycleStep}>
                    <span className={styles.cycleNode} aria-hidden="true" />
                    <span className={styles.cycleNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.cycleName}>{step}</span>
                  </Reveal>
                ))}
              </ol>
            </div>
            <Reveal variant="fade" className={styles.retentionMedia}>
              <div className={styles.retentionPhoto}>
                <Image src={IMAGES.recall.src} alt={IMAGES.recall.alt} fill sizes="(min-width: 960px) 45vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Campaign: one practice carried across every placement */}
      <section className={styles.campaign} aria-labelledby="dm-campaign">
        <div className="container">
          <div className={styles.campaignHead}>
            <p className={styles.labelOnDark}>Sparkle Dental Spa</p>
            <SectionTitle id="dm-campaign" className={styles.displayOnDark}>
              One practice. One consistent patient experience.
            </SectionTitle>
          </div>
          <div className={styles.mosaic}>
            <Reveal variant="fade" className={`${styles.mosaicTile} ${styles.mosaicOutdoor}`}>
              <Image src={IMAGES.sparkleOutdoor.src} alt={IMAGES.sparkleOutdoor.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
              <span className={styles.mosaicLabel}>Outdoor</span>
            </Reveal>
            <Reveal delay={100} className={`${styles.mosaicTile} ${styles.mosaicWebsite}`}>
              <Image src={IMAGES.sparkleLaptop.src} alt={IMAGES.sparkleLaptop.alt} fill sizes="(min-width: 960px) 30vw, 50vw" className={styles.cover} />
              <span className={styles.mosaicLabel}>Website</span>
            </Reveal>
            <Reveal delay={200} className={`${styles.mosaicTile} ${styles.mosaicMobile}`}>
              <div className={styles.mobileStage}>
                <div className={styles.phone}>
                  <div className={styles.phoneScreen}>
                    <Image src={IMAGES.sparkleSite.src} alt="Sparkle Dental Spa site on a phone" fill sizes="200px" className={styles.cover} style={{ objectPosition: "20% 0%" }} />
                  </div>
                </div>
              </div>
              <span className={styles.mosaicLabel}>Mobile</span>
            </Reveal>
            <Reveal delay={300} className={`${styles.mosaicTile} ${styles.mosaicPractice}`}>
              <Image src={IMAGES.sparkleSpa.src} alt={IMAGES.sparkleSpa.alt} fill sizes="(min-width: 960px) 60vw, 100vw" className={styles.cover} />
              <span className={styles.mosaicLabel}>In the practice</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* System: five groups, ruled */}
      <section className={styles.system} aria-labelledby="dm-system">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>Everything you need to grow</p>
              <SectionTitle id="dm-system" className={styles.title}>
                One system for practice growth.
              </SectionTitle>
            </div>
          </div>
          <div className={styles.groups}>
            {SYSTEM.map((group, index) => (
              <div key={group.group} className={styles.group}>
                <span className={styles.groupNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.groupName}>{group.group}</h3>
                <ul className={styles.groupItems}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link className={styles.button} href={contactHref}>
            Talk to our team
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {closing ? <PageCta cta={closing} /> : null}
    </main>
  );
}
