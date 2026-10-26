import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./BusinessDevelopmentPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const IMAGES = {
  team: {
    src: `${UPLOADS}/2026/09/henderson-inclusive-strategy-edited.jpg`,
    alt: "A team fitting coloured gears together on a meeting table",
  },
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
    alt: "A business audience listening to speakers at the front of a room",
  },
  file: {
    src: `${UPLOADS}/2024/01/pexels-sora-shimazaki-5668473-2.png`,
    alt: "Black binders beside a gavel on a dark desk",
  },
  built: {
    src: `${UPLOADS}/2023/06/real-estate-design-1.jpg`,
    alt: "Modern glass and stone building above a pool",
  },
};

const AREAS = [
  { href: "#growth", title: "Growth Strategy", summary: "Clarify direction, identify opportunities and build a plan for sustainable growth." },
  { href: "#sales", title: "Corporate Sales", summary: "Prepare, position and support the business through a sale or acquisition." },
  { href: "#legal", title: "Legal & Compliance", summary: "Navigate corporate structure, documentation and transaction requirements." },
  { href: "#exit", title: "Exit Strategy", summary: "Prepare the business for transition, succession or sale." },
];

/* The four calls every opportunity ends in */
const THEMES = [
  { name: "Pursue now", line: "Strong market, and the capability to win it.", lead: true },
  { name: "Build or partner", line: "Strong market, capability still to build." },
  { name: "Optimize", line: "Proven fit in a mature market." },
  { name: "Deprioritize", line: "Limited market and a poor fit." },
];

const PIPELINE = [
  { name: "Position", detail: "Offer, pricing and target accounts." },
  { name: "Qualify", detail: "Pipeline built and scored in the CRM." },
  { name: "Negotiate", detail: "Proposals and terms structured to win." },
  { name: "Close", detail: "High-value deals over the line." },
  { name: "Transition", detail: "Handed to delivery, then grown." },
];

const TRANSACTION_FILE = [
  { title: "Corporate structure", detail: "Entities, ownership and governance set up for the deal." },
  { title: "Documentation", detail: "Contracts drafted, reviewed and negotiated." },
  { title: "Due diligence", detail: "Records organized before anyone asks." },
  { title: "Compliance", detail: "Regulatory risk identified and addressed." },
  { title: "Agreements", detail: "Partnership and joint venture terms structured." },
];

const EXIT_PATH = [
  { name: "Build value", detail: "Valuation and benchmarks set the baseline." },
  { name: "Reduce owner dependence", detail: "Leadership and systems that run without you." },
  { name: "Prepare", detail: "Due diligence and the data room ready." },
  { name: "Position", detail: "Buyers, investors or successors identified." },
  { name: "Transition", detail: "A clean, well-timed handover." },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

type BusinessDevelopmentPageProps = {
  content: ServicePageContent;
};

export function BusinessDevelopmentPage({ content }: BusinessDevelopmentPageProps) {
  const { hero, intro, faqs, cta } = content;
  const closing = cta
    ? {
        title: "Planning the next move?",
        description: "Growth, a sale or a succession: the earlier the conversation, the more options you keep.",
        primary: { label: "Talk to us", href: cta.primary.href },
        phone: cta.phone ? { label: "Start a conversation", href: cta.phone.href } : null,
      }
    : null;

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Intro: headline and a tall crop on the left, an offset index of the four areas on the right */}
      <section className={styles.intro} aria-labelledby="bd-intro">
        <div className="container">
          <div className={styles.introGrid}>
            <div className={styles.introLead}>
              <p className={styles.label}>{labelCase(intro?.eyebrow || "What we offer")}</p>
              <SectionTitle id="bd-intro" className={styles.display}>
                Strategic advisory across every phase of business.
              </SectionTitle>
              <p className={styles.lead}>
                Senior guidance for the decisions that shape a company: where to grow, how to sell, how to close and
                when to step back.
              </p>
            </div>
            <Reveal variant="fade" className={styles.introPhotoWrap}>
              <div className={styles.introPhoto}>
                <Image src={IMAGES.team.src} alt={IMAGES.team.alt} fill sizes="(min-width: 960px) 30vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <ol className={styles.index}>
              {AREAS.map((area, index) => (
                <li key={area.href}>
                  <a className={styles.indexLink} href={area.href}>
                    <span className={styles.indexNumber}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.indexTitle}>{area.title}</span>
                    <span className={styles.indexSummary}>{area.summary}</span>
                    <span className={styles.indexArrow} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Growth: a large market image with the headline panel overlapping it, then a smaller image and the four calls */}
      <section id="growth" className={styles.growth} aria-labelledby="bd-growth">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>01 Growth strategy</p>
            <SectionTitle id="bd-growth" className={styles.title}>
              Scale with confidence.
            </SectionTitle>
          </div>
          <div className={styles.growthStage}>
            <Reveal variant="fade" className={styles.growthMain}>
              <div className={styles.growthPhoto}>
                <Image src={IMAGES.market.src} alt={IMAGES.market.alt} fill sizes="(min-width: 960px) 70vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <div className={styles.growthPanel}>
              <p className={styles.panelLead}>
                Growth should be a plan, not a guess. Every opportunity is tested before resources are committed.
              </p>
            </div>
          </div>

          <div className={styles.growthDetail}>
            <Reveal className={styles.growthSmall}>
              <figure className={styles.figure}>
                <div className={styles.smallPhoto}>
                  <Image src={IMAGES.operations.src} alt={IMAGES.operations.alt} fill sizes="(min-width: 960px) 30vw, 100vw" className={styles.cover} />
                </div>
                <figcaption className={styles.caption}>Expansion planned around the operation, not the other way round.</figcaption>
              </figure>
            </Reveal>
            <div className={styles.themes}>
              <p className={styles.label}>Every opportunity ends in one of four calls</p>
              <ul className={styles.themeList}>
                {THEMES.map((theme) => (
                  <li key={theme.name} className={theme.lead ? `${styles.theme} ${styles.themeLead}` : styles.theme}>
                    <span className={styles.themeName}>{theme.name}</span>
                    <span className={styles.themeLine}>{theme.line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* People: one large crop, a single statement and the one supported proof point */}
      <section className={styles.room} aria-labelledby="bd-room">
        <Reveal variant="fade">
          <div className={styles.roomPhoto}>
            <Image src={IMAGES.room.src} alt={IMAGES.room.alt} fill sizes="100vw" className={styles.cover} />
            <div className={styles.roomShade} aria-hidden="true" />
            <div className={`container ${styles.roomCopy}`}>
              <h2 id="bd-room" className={styles.roomStatement}>
                Advisors in the room for the decisions that shape the business.
              </h2>
              <p className={styles.roomProof}>
                <span className={styles.roomFigure}>40+</span>
                <span>years of experience</span>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Sales: headline beside a short brief, then one ruled progression across the page */}
      <section id="sales" className={styles.sales} aria-labelledby="bd-sales">
        <div className="container">
          <div className={styles.salesHead}>
            <p className={styles.label}>02 Corporate sales</p>
            <SectionTitle id="bd-sales" className={styles.title}>
              Build a scalable sales engine.
            </SectionTitle>
            <p className={styles.lead}>
              Enterprise-grade sales infrastructure, built alongside your team and run by them long after the
              engagement ends.
            </p>
          </div>
          <ol className={styles.pipeline} aria-label="Corporate sales process">
            {PIPELINE.map((stage, index) => (
              <Reveal key={stage.name} as="li" delay={index * 100} className={styles.stage}>
                <span className={styles.stageNode} aria-hidden="true" />
                <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.stageName}>{stage.name}</span>
                <span className={styles.stageDetail}>{stage.detail}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Legal: a tall document photo on the left, the transaction file ruled on the right */}
      <section id="legal" className={styles.legal} aria-labelledby="bd-legal">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className={styles.label}>03 Legal &amp; compliance</p>
            <SectionTitle id="bd-legal" className={styles.title}>
              Navigate complex deals with clarity.
            </SectionTitle>
          </div>
          <div className={styles.legalGrid}>
            <Reveal variant="fade" className={styles.legalPhotoWrap}>
              <div className={styles.legalPhoto}>
                <Image src={IMAGES.file.src} alt={IMAGES.file.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
              </div>
            </Reveal>
            <div className={styles.legalCopy}>
              <p className={styles.lead}>
                Deals stall on structure and paperwork. Alongside your legal counsel, every transaction is prepared
                to close.
              </p>
              <ol className={styles.file}>
                {TRANSACTION_FILE.map((item) => (
                  <li key={item.title} className={styles.fileRow}>
                    <span className={styles.fileCheck}>
                      <CheckIcon />
                    </span>
                    <span className={styles.fileTitle}>{item.title}</span>
                    <span className={styles.fileDetail}>{item.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Exit: dark, a headline across the top, then the building beside the path */}
      <section id="exit" className={styles.exit} aria-labelledby="bd-exit">
        <div className="container">
          <div className={styles.exitHead}>
            <p className={styles.labelOnDark}>04 Exit strategy &amp; succession</p>
            <SectionTitle id="bd-exit" className={styles.displayOnDark}>
              Prepare the business before the decision is urgent.
            </SectionTitle>
          </div>
          <div className={styles.exitGrid}>
            <Reveal variant="fade" className={styles.exitPhotoWrap}>
              <figure className={styles.figure}>
                <div className={styles.exitPhoto}>
                  <Image src={IMAGES.built.src} alt={IMAGES.built.alt} fill sizes="(min-width: 960px) 58vw, 100vw" className={styles.cover} />
                </div>
                <figcaption className={styles.captionOnDark}>Everything you have worked to build, handed on well.</figcaption>
              </figure>
            </Reveal>
            <div className={styles.exitCopy}>
              <p className={styles.leadOnDark}>
                A sale, merger or succession goes best when value is built years ahead. Methodical and confidential,
                from first valuation to handover.
              </p>
              <ol className={styles.path}>
                {EXIT_PATH.map((step, index) => (
                  <Reveal key={step.name} as="li" delay={index * 110} className={styles.pathStep}>
                    <span className={styles.pathNode} aria-hidden="true" />
                    <span className={styles.pathName}>{step.name}</span>
                    <span className={styles.pathDetail}>{step.detail}</span>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {closing ? <PageCta cta={closing} /> : null}
    </main>
  );
}
