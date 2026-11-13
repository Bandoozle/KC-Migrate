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
import { ExitNarrative } from "./ExitNarrative";
import { GrowthPlan } from "./GrowthPlan";
import { SalesEngine } from "./SalesEngine";
import styles from "./BusinessDevelopmentPage.module.css";

const UPLOADS = "/wp-content/uploads";

const IMAGES = {
  skyline: {
    src: `${UPLOADS}/2023/06/vancouver-agency.jpg`,
    alt: "Vancouver waterfront and skyline at sunset",
  },
  closing: {
    src: `${UPLOADS}/2017/07/Lions-Gate-Bridge-and-Downtown-Vancouver-at-sunrise-521834953_5000x3336-e1505405897284.jpeg`,
    alt: "",
  },
};

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

/** Section opener: sentence-case label, then title and lead, stacked. */
function SectionHead({
  id,
  label,
  title,
  lead,
  tone = "light",
}: {
  id: string;
  label: string;
  title: string;
  lead: string;
  tone?: "light" | "dark";
}) {
  return (
    <Reveal variant="fadeUp" className={tone === "dark" ? `${styles.head} ${styles.headDark}` : styles.head}>
      <p className={styles.label}>{label}</p>
      <SectionTitle id={id} className={styles.title}>
        {title}
      </SectionTitle>
      <SectionDescription className={styles.lead}>{lead}</SectionDescription>
    </Reveal>
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

      {/* What we offer: the services beside their photographs */}
      <section className={styles.offer} aria-labelledby="bd-intro">
        <div className="container">
          {/* No Reveal: this opener sits just under the hero and must stay readable as soon as the section enters view */}
          <div className={styles.head}>
            <p className={styles.label}>{labelCase(intro?.eyebrow || "What we offer")}</p>
            <SectionTitle id="bd-intro" className={styles.title}>
              Strategic advisory across every phase of business.
            </SectionTitle>
            <SectionDescription className={styles.lead}>
              Senior guidance for the decisions that shape a company: where to grow, how to sell, how to close and when to
              step back.
            </SectionDescription>
          </div>
          <AdvisoryExplorer />
        </div>
      </section>

      {/* Growth: city statement, then a scroll-driven editorial plan */}
      <section id="growth" className={styles.growth} aria-labelledby="bd-growth">
        <div className={styles.growthBand}>
          <Image src={IMAGES.skyline.src} alt={IMAGES.skyline.alt} fill sizes="100vw" className={styles.growthImage} />
          <div className={styles.growthShade} aria-hidden="true" />
          <div className={`container ${styles.growthHead}`}>
            <Reveal variant="fadeUp">
              <p className={styles.labelOnPhoto}>Growth strategy</p>
              <h2 id="bd-growth" className={styles.growthHeading}>
                Scale with confidence.
              </h2>
              <p className={styles.statement}>Growth should be a plan, not a gamble.</p>
              <p className={styles.growthLead}>
                Every opportunity is tested against market intelligence, competitive analysis and financial modelling
                before resources are committed.
              </p>
            </Reveal>
          </div>
        </div>

        <div className={`container ${styles.growthBody}`}>
          <GrowthPlan />
        </div>
      </section>

      {/* Sales: dark editorial sequence — photograph and milestone shift with stage */}
      <section id="sales" className={styles.sales} aria-labelledby="bd-sales">
        <div className="container">
          <SectionHead
            id="bd-sales"
            label="Corporate sales"
            title="Build a scalable sales engine."
            lead="Enterprise-grade sales infrastructure, built alongside your team and run by them long after the engagement ends."
          />
          <SalesEngine />
        </div>
      </section>

      {/* Legal: institutional photograph + editorial dossier */}
      <section id="legal" className={styles.legal} aria-labelledby="bd-legal">
        <div className="container">
          <SectionHead
            id="bd-legal"
            label="Legal & compliance"
            title="Navigate complex deals with clarity."
            lead="Deals stall on structure and paperwork. Alongside your legal counsel, every transaction is prepared to close."
          />
          <DealFile />
        </div>
      </section>

      {/* Exit: split cream editorial + intentional sunset photograph */}
      <section id="exit" className={styles.exit} aria-labelledby="bd-exit">
        <ExitNarrative />
      </section>

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {/* Closing: back to the city */}
      {cta ? (
        <section className={styles.closing} aria-labelledby="bd-closing">
          <Image src={IMAGES.closing.src} alt={IMAGES.closing.alt} fill sizes="100vw" className={styles.closingImage} />
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
