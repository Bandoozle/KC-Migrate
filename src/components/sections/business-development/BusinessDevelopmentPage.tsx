import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { AdvisoryExplorer } from "./AdvisoryExplorer";
import { DealFile } from "./DealFile";
import { SalesEngine } from "./SalesEngine";
import styles from "./BusinessDevelopmentPage.module.css";

const UPLOADS = "/wp-content/uploads";

const IMAGES = {
  market: {
    src: `${UPLOADS}/2023/06/vancouver-agency.jpg`,
    alt: "Vancouver waterfront and skyline at sunset",
  },
  operations: {
    src: `${UPLOADS}/2023/06/Screenshot-2023-06-14-at-3.21.33-PM-e1686845959493.jpg`,
    alt: "Van-Kam freight truck on a mountain highway",
  },
  room: {
    src: `${UPLOADS}/2024/10/corporate-events.webp`,
    alt: "",
  },
  built: {
    src: `${UPLOADS}/2023/06/real-estate.jpeg`,
    alt: "A bright living room opening onto a view of the ocean",
  },
};

/* From the Business Development Strategy deliverables */
const BENEFITS = [
  "Market analysis & competitive positioning frameworks",
  "Revenue model optimization & pricing strategy",
  "Strategic partnership identification & development",
  "Business plan creation & investor-ready pitch decks",
  "Operational efficiency audits & process improvement",
];

/* The four calls every opportunity ends in: capability across, market up */
const CALLS = [
  { name: "Build or partner", line: "Strong market, capability still to build." },
  { name: "Pursue now", line: "Strong market, and the capability to win it.", lead: true },
  { name: "Deprioritize", line: "Limited market and a poor fit." },
  { name: "Optimize", line: "Proven fit in a mature market." },
];

const EXIT_PATH = [
  { name: "Build value", detail: "Valuation and benchmarks set the baseline." },
  { name: "Reduce owner dependence", detail: "Leadership and systems that run without you." },
  { name: "Prepare", detail: "Due diligence and the data room ready." },
  { name: "Position", detail: "Buyers, investors or successors identified." },
  { name: "Transition", detail: "A clean, well-timed handover." },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.61 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.18a2 2 0 0 1 2.11-.45c.84.28 1.72.49 2.62.61A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

type BusinessDevelopmentPageProps = {
  content: ServicePageContent;
};

export function BusinessDevelopmentPage({ content }: BusinessDevelopmentPageProps) {
  const { hero, intro, faqs, cta } = content;

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} cinematic />

      {/* Advisory: one large photograph that changes with the service selected beside it */}
      <section className={styles.advisory} aria-labelledby="bd-intro">
        <div className="container">
          <p className={styles.label}>{labelCase(intro?.eyebrow || "What we offer")}</p>
          <SectionTitle id="bd-intro" className={styles.title}>
            Strategic advisory across every phase of business.
          </SectionTitle>
          <SectionDescription className={styles.lead}>
            Senior guidance for the decisions that shape a company: where to grow, how to sell, how to close and when
            to step back.
          </SectionDescription>
          <AdvisoryExplorer />
        </div>
      </section>

      {/* Growth: the statement carries the section, with photographs layered off the right edge */}
      <section id="growth" className={styles.growth} aria-labelledby="bd-growth">
        <div className={styles.growthStage}>
          <div className="container">
            <div className={styles.growthCopy}>
            <h2 id="bd-growth" className={styles.growthHeading}>
              Scale with confidence.
            </h2>
            <Reveal>
              <p className={styles.statement}>Growth should be a plan, not a gamble.</p>
            </Reveal>
            <p className={styles.growthLead}>
              Every opportunity is tested against market intelligence, competitive analysis and financial modelling
              before resources are committed.
            </p>
            </div>
          </div>
          <div className={styles.growthMedia}>
            <Reveal variant="fade" className={styles.growthMain}>
              <Image
                src={IMAGES.market.src}
                alt={IMAGES.market.alt}
                fill
                sizes="(min-width: 960px) 58vw, 100vw"
                className={styles.cover}
              />
            </Reveal>
            <Reveal delay={200} className={styles.growthInset}>
              <Image
                src={IMAGES.operations.src}
                alt={IMAGES.operations.alt}
                fill
                sizes="(min-width: 960px) 24vw, 45vw"
                className={styles.cover}
              />
            </Reveal>
          </div>
        </div>

        <div className={`container ${styles.growthDetail}`}>
          <div>
            <h3 className={styles.subheading}>What the plan covers</h3>
            <ul className={styles.benefits}>
              {BENEFITS.map((benefit, index) => (
                <Reveal key={benefit} as="li" delay={index * 70} className={styles.benefit}>
                  {benefit}
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={styles.subheading}>Every opportunity ends in one of four calls</h3>
            <div className={styles.matrix}>
              <span className={styles.axisY}>Market strength</span>
              <div className={styles.matrixGrid}>
                {CALLS.map((call, index) => (
                  <Reveal
                    key={call.name}
                    delay={index * 80}
                    className={call.lead ? `${styles.call} ${styles.callLead}` : styles.call}
                  >
                    <span className={styles.callName}>{call.name}</span>
                    <span className={styles.callLine}>{call.line}</span>
                  </Reveal>
                ))}
              </div>
              <span className={styles.axisX}>Capability to win</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sales: a compact, selectable framework */}
      <section id="sales" className={styles.sales} aria-labelledby="bd-sales">
        <div className="container">
          <p className={styles.label}>Corporate sales</p>
          <SectionTitle id="bd-sales" className={styles.title}>
            Build a scalable sales engine.
          </SectionTitle>
          <SectionDescription className={styles.lead}>
            Enterprise-grade sales infrastructure, built alongside your team and run by them long after the engagement
            ends.
          </SectionDescription>
          <SalesEngine />
        </div>
      </section>

      {/* Legal: an accordion that fills in the transaction file beside it */}
      <section id="legal" className={styles.legal} aria-labelledby="bd-legal">
        <div className="container">
          <p className={styles.label}>Legal &amp; compliance</p>
          <SectionTitle id="bd-legal" className={styles.title}>
            Navigate complex deals with clarity.
          </SectionTitle>
          <SectionDescription className={styles.lead}>
            Deals stall on structure and paperwork. Alongside your legal counsel, every transaction is prepared to
            close.
          </SectionDescription>
          <DealFile />
        </div>
      </section>

      {/* Exit: dark and full-bleed, the headline on the photograph and the path running to the handover */}
      <section id="exit" className={styles.exit} aria-labelledby="bd-exit">
        <div className={styles.exitMedia}>
          <Image src={IMAGES.built.src} alt={IMAGES.built.alt} fill sizes="100vw" className={styles.exitImage} />
          <div className={styles.exitShade} aria-hidden="true" />
          <div className={`container ${styles.exitHead}`}>
            <p className={styles.labelOnDark}>Exit strategy &amp; succession</p>
            <h2 id="bd-exit" className={styles.exitTitle}>
              Prepare the business before the decision is urgent.
            </h2>
          </div>
        </div>
        <div className="container">
          <p className={styles.exitLead}>
            A sale, merger or succession goes best when value is built years ahead. Methodical and confidential, from
            first valuation to handover.
          </p>
          <Reveal variant="fade">
            <div className={styles.pathLine} aria-hidden="true">
              <span>Years ahead</span>
              <span>Handover</span>
            </div>
          </Reveal>
          <ol className={styles.path}>
            {EXIT_PATH.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 90} className={styles.pathStep}>
                <span className={styles.pathName}>{step.name}</span>
                <span className={styles.pathDetail}>{step.detail}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {/* Closing: back in the room where these conversations happen */}
      {cta ? (
        <section className={styles.closing} aria-labelledby="bd-closing">
          <Image src={IMAGES.room.src} alt={IMAGES.room.alt} fill sizes="100vw" className={styles.closingImage} />
          <div className={styles.closingShade} aria-hidden="true" />
          <div className={`container ${styles.closingInner}`}>
            <h2 id="bd-closing" className={styles.closingTitle}>
              Planning the next move?
            </h2>
            <p className={styles.closingLead}>
              Growth, a sale or a succession: the earlier the conversation, the more options you keep.
            </p>
            <div className={styles.closingActions}>
              <Link href={cta.primary.href} className={styles.closingPrimary}>
                Start a conversation
              </Link>
              {cta.phone ? (
                <a href={cta.phone.href} className={styles.closingSecondary}>
                  <PhoneIcon />
                  604.925.5800
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
