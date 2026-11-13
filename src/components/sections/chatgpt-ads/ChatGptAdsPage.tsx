import Link from "next/link";
import { RelatedServices } from "@/components/sections/ads/RelatedServices";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { SectionTitle } from "@/components/typography";
import {
  CHATGPT_ADS_CTA,
  CHATGPT_ADS_FAQS,
  CHATGPT_ADS_HERO,
  COMPLEMENT,
  HOW_IT_WORKS,
  JOURNEY,
  PREPARATION,
} from "@/content/chatgpt-ads-page";
import { ComplementEcosystem } from "./ComplementEcosystem";
import { ConversationDemo } from "./ConversationDemo";
import { FindWaysStudio, IndustryExamplesStudio, RoleProcessStudio } from "./ChatGptStudios";
import { JourneyScenes } from "./JourneyScenes";
import styles from "./ChatGptAdsPage.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * ChatGPT Ads Management: light, conversational layout. Product facts stay tied to
 * OpenAI’s published rules; Kosick is framed as planning and readiness only.
 */
export function ChatGptAdsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{CHATGPT_ADS_HERO.eyebrow}</p>
            <h1 className={styles.heroTitle}>
              <span>{CHATGPT_ADS_HERO.displayTitle}</span>{" "}
              <span className={styles.heroTitleMuted}>{CHATGPT_ADS_HERO.title}</span>
            </h1>
            <p className={styles.heroLead}>{CHATGPT_ADS_HERO.lead}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={CHATGPT_ADS_HERO.primary.href}>
                {CHATGPT_ADS_HERO.primary.label}
                <ArrowIcon />
              </Link>
              <a className={styles.secondary} href={CHATGPT_ADS_HERO.secondary.href}>
                {CHATGPT_ADS_HERO.secondary.label}
              </a>
            </div>
          </div>
          <ConversationDemo />
        </div>
      </header>

      <section className={styles.find} aria-labelledby="cg-find">
        <div className="container">
          <FindWaysStudio />
        </div>
      </section>

      <section className={styles.how} aria-labelledby="cg-how">
        <div className={`container ${styles.howGrid}`}>
          <div className={styles.howIntro}>
            <p className={styles.label}>{HOW_IT_WORKS.label}</p>
            <SectionTitle id="cg-how" className={styles.title}>
              {HOW_IT_WORKS.title}
            </SectionTitle>
            <p className={styles.lead}>{HOW_IT_WORKS.lead}</p>
            <p className={styles.availability}>{HOW_IT_WORKS.availability}</p>
          </div>
          <dl className={styles.facts}>
            {HOW_IT_WORKS.facts.map((fact) => (
              <div key={fact.title} className={styles.fact}>
                <dt>{fact.title}</dt>
                <dd>{fact.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.examplesSection} aria-labelledby="cg-examples">
        <div className="container">
          <IndustryExamplesStudio />
        </div>
      </section>

      <section className={styles.journey} aria-labelledby="cg-journey">
        <div className="container">
          <div className={styles.journeyHead}>
            <p className={styles.label}>{JOURNEY.label}</p>
            <SectionTitle id="cg-journey" className={styles.title}>
              {JOURNEY.title}
            </SectionTitle>
            <p className={styles.leadWide}>{JOURNEY.lead}</p>
          </div>
          <JourneyScenes />
        </div>
      </section>

      <section className={styles.prepare} aria-labelledby="cg-prepare">
        <div className="container">
          <div className={styles.prepareHead}>
            <p className={styles.label}>{PREPARATION.label}</p>
            <SectionTitle id="cg-prepare" className={styles.title}>
              {PREPARATION.title}
            </SectionTitle>
            <p className={styles.leadWide}>{PREPARATION.lead}</p>
          </div>
          <ol className={styles.prepareList}>
            {PREPARATION.items.map((item, index) => (
              <li key={item.title} className={styles.prepareItem}>
                <span className={styles.prepareIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={styles.prepareTitle}>{item.title}</h3>
                  <p className={styles.prepareBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.role} aria-labelledby="cg-role">
        <div className="container">
          <RoleProcessStudio />
        </div>
      </section>

      <section className={styles.complement} aria-labelledby="cg-complement">
        <div className={`container ${styles.complementGrid}`}>
          <div className={styles.complementCopy}>
            <SectionTitle id="cg-complement" className={styles.title}>
              {COMPLEMENT.title}
            </SectionTitle>
            <p className={styles.lead}>{COMPLEMENT.body}</p>
            <ul className={styles.complementPoints}>
              {COMPLEMENT.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <ComplementEcosystem />
        </div>
      </section>

      <RelatedServices title="Plan it with the channels you already run." current="/services/chatgpt-ads-management/" />

      <FaqAccordion eyebrow="" title="Frequently asked questions" items={CHATGPT_ADS_FAQS} />

      <PageCta cta={CHATGPT_ADS_CTA} />
    </main>
  );
}
