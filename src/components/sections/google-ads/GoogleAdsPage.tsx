import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RelatedServices } from "@/components/sections/ads/RelatedServices";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { SectionTitle } from "@/components/typography";
import {
  AI_SEARCH,
  GOOGLE_ADS_CTA,
  GOOGLE_ADS_FAQS,
  GOOGLE_ADS_HERO,
  GOOGLE_ADS_PROCESS,
  MANAGEMENT,
  MEASUREMENT,
  SAMPLE_AD,
  TARGETING,
  WHY_GOOGLE_ADS,
} from "@/content/google-ads-page";
import { FormatStudio } from "./FormatStudio";
import { HeroScene } from "./HeroScene";
import { TargetingStudio } from "./TargetingStudio";
import styles from "./GoogleAdsPage.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
      />
    </svg>
  );
}

/**
 * Google Ads Management: bright and search-led. One fictional advertiser (a Vancouver
 * heating company) runs through every illustration, from the hero search to the
 * format studio, the targeting map and the click-to-sale filmstrip.
 */
export function GoogleAdsPage() {
  return (
    <main className={styles.page}>
      {/* Hero: headline beside a real search photograph with the ad journey layered over it */}
      <header className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              <span>{GOOGLE_ADS_HERO.displayTitle}</span>{" "}
              <span className={styles.heroTitleMuted}>{GOOGLE_ADS_HERO.title}</span>
            </h1>
            <p className={styles.heroLead}>{GOOGLE_ADS_HERO.lead}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={GOOGLE_ADS_HERO.primary.href}>
                {GOOGLE_ADS_HERO.primary.label}
                <ArrowIcon />
              </Link>
              <a className={styles.secondary} href={GOOGLE_ADS_HERO.secondary.href}>
                <PhoneIcon />
                {GOOGLE_ADS_HERO.secondary.label}
              </a>
            </div>
            <ul className={styles.formats} aria-label="Campaign types we manage">
              {GOOGLE_ADS_HERO.formats.map((format) => (
                <li key={format}>{format}</li>
              ))}
            </ul>
          </div>
          <HeroScene />
        </div>
      </header>

      {/* Why: a large photograph of the job the search turned into, beside the case for search */}
      <section className={styles.why} aria-labelledby="ga-why">
        <div className={`container ${styles.whyGrid}`}>
          <Reveal variant="fade" className={styles.whyPhoto}>
            <Image src={WHY_GOOGLE_ADS.photo.src} alt={WHY_GOOGLE_ADS.photo.alt} fill sizes="(min-width: 1000px) 46vw, 100vw" className={styles.cover} />
          </Reveal>
          <div className={styles.whyCopy}>
            <SectionTitle id="ga-why" className={styles.title}>
              {WHY_GOOGLE_ADS.title}
            </SectionTitle>
            <p className={styles.lead}>{WHY_GOOGLE_ADS.lead}</p>
            <dl className={styles.reasons}>
              {WHY_GOOGLE_ADS.points.map((point) => (
                <div key={point.title}>
                  <dt>{point.title}</dt>
                  <dd>{point.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Campaign types: a dark studio so the examples read as screens */}
      <section className={styles.studio} aria-labelledby="ga-types">
        <div className="container">
          <div className={styles.studioHead}>
            <SectionTitle id="ga-types" className={styles.titleOnDark}>
              Five ways to appear on Google.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Search captures demand, Display and YouTube build it, Shopping sells products directly and Performance Max
              runs one set of goals across Google’s channels. Choose a format to see where it appears.
            </p>
          </div>
          <FormatStudio />
        </div>
      </section>

      <section className={styles.targeting} aria-labelledby="ga-targeting">
        <div className="container">
          <div className={styles.intro}>
            <SectionTitle id="ga-targeting" className={styles.title}>
              {TARGETING.title}
            </SectionTitle>
            <p className={styles.lead}>{TARGETING.lead}</p>
          </div>
          <TargetingStudio />
        </div>
      </section>

      {/* Measurement: click → visit → inquiry → sale */}
      <section className={styles.measure} aria-labelledby="ga-measure">
        <div className="container">
          <div className={styles.intro}>
            <SectionTitle id="ga-measure" className={styles.title}>
              {MEASUREMENT.title}
            </SectionTitle>
            <p className={styles.lead}>{MEASUREMENT.lead}</p>
          </div>
          <ol className={styles.film}>
            <Reveal as="li" className={styles.frame} delay={0}>
              <div className={`${styles.frameVisual} ${styles.frameUi}`} aria-hidden="true">
                <span className={styles.miniAd}>
                  <b>Sponsored</b>
                  <span>{SAMPLE_AD.headline}</span>
                </span>
                <span className={styles.cursor} />
              </div>
              <span className={styles.frameName}>{MEASUREMENT.steps[0].name}</span>
              <span className={styles.frameDetail}>{MEASUREMENT.steps[0].detail}</span>
            </Reveal>
            <Reveal as="li" className={styles.frame} delay={100}>
              <div className={styles.frameVisual}>
                <Image src={MEASUREMENT.photos.visit.src} alt={MEASUREMENT.photos.visit.alt} fill sizes="(min-width: 1000px) 24vw, 80vw" className={styles.cover} />
              </div>
              <span className={styles.frameName}>{MEASUREMENT.steps[1].name}</span>
              <span className={styles.frameDetail}>{MEASUREMENT.steps[1].detail}</span>
            </Reveal>
            <Reveal as="li" className={styles.frame} delay={200}>
              <div className={`${styles.frameVisual} ${styles.frameUi}`} aria-hidden="true">
                <span className={styles.miniForm}>
                  <b>Book a free estimate</b>
                  <span className={styles.field}>Jordan M.</span>
                  <span className={styles.field}>North Vancouver</span>
                  <span className={styles.sent}>Request sent</span>
                </span>
              </div>
              <span className={styles.frameName}>{MEASUREMENT.steps[2].name}</span>
              <span className={styles.frameDetail}>{MEASUREMENT.steps[2].detail}</span>
            </Reveal>
            <Reveal as="li" className={styles.frame} delay={300}>
              <div className={styles.frameVisual}>
                <Image src={MEASUREMENT.photos.sale.src} alt={MEASUREMENT.photos.sale.alt} fill sizes="(min-width: 1000px) 24vw, 80vw" className={styles.cover} />
              </div>
              <span className={styles.frameName}>{MEASUREMENT.steps[3].name}</span>
              <span className={styles.frameDetail}>{MEASUREMENT.steps[3].detail}</span>
            </Reveal>
          </ol>
        </div>
      </section>

      {/* Management: intro beside three reporting panels */}
      <section className={styles.manage} aria-labelledby="ga-manage">
        <div className={`container ${styles.manageGrid}`}>
          <div className={styles.manageIntro}>
            <SectionTitle id="ga-manage" className={styles.title}>
              {MANAGEMENT.title}
            </SectionTitle>
            <p className={styles.lead}>{MANAGEMENT.lead}</p>
            <div className={styles.manageDiagram} aria-hidden="true">
              <div className={styles.manageDiagramCard}>
                <span className={styles.manageDiagramLabel}>This week</span>
                <ul>
                  <li data-tone="blue">Search terms reviewed</li>
                  <li data-tone="blue">Negatives added</li>
                  <li data-tone="yellow">Budget shifted</li>
                </ul>
              </div>
              <span className={styles.manageDiagramArrow} />
              <div className={styles.manageDiagramCard}>
                <span className={styles.manageDiagramLabel}>This month</span>
                <div className={styles.manageDiagramMetrics}>
                  <span>
                    <small>Spend</small>
                    <b>$4.8k</b>
                  </span>
                  <span>
                    <small>Leads</small>
                    <b>48</b>
                  </span>
                  <span>
                    <small>Cost / lead</small>
                    <b>$100</b>
                  </span>
                </div>
                <p>What changed, and what comes next.</p>
              </div>
            </div>
          </div>
          <ul className={styles.rhythmCards}>
            {MANAGEMENT.rhythm.map((item) => (
              <li key={item.label} className={styles.rhythmCard} data-tone={item.tone}>
                <div className={styles.rhythmCardHead}>
                  <span className={styles.rhythmIcon} aria-hidden="true" />
                  <span className={styles.rhythmLabel}>{item.label}</span>
                </div>
                <p className={styles.rhythmBody}>{item.what}</p>
                {"keep" in item && item.keep ? (
                  <div className={styles.termRow} aria-hidden="true">
                    {item.keep.map((term) => (
                      <span key={term} className={styles.termKeep}>
                        {term}
                      </span>
                    ))}
                    {item.drop?.map((term) => (
                      <span key={term} className={styles.termDrop}>
                        {term}
                      </span>
                    ))}
                  </div>
                ) : null}
                {"stats" in item && item.stats ? (
                  <div className={styles.statRow} aria-hidden="true">
                    {item.stats.map((stat) => (
                      <span key={stat.label} className={styles.stat}>
                        <small>{stat.label}</small>
                        <b>{stat.value}</b>
                      </span>
                    ))}
                  </div>
                ) : null}
                {"split" in item && item.split ? (
                  <div className={styles.budgetRow} aria-hidden="true">
                    {item.split.map((slice) => (
                      <span key={slice.label} className={styles.budgetSlice} style={{ flexGrow: slice.share }}>
                        <b>{slice.share}%</b>
                        <small>{slice.label}</small>
                      </span>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.aiBand} aria-labelledby="ga-ai">
        <div className={`container ${styles.aiBandInner}`}>
          <div className={styles.aiCopy}>
            <SectionTitle id="ga-ai" className={styles.title}>
              {AI_SEARCH.title}
            </SectionTitle>
            <p className={styles.lead}>{AI_SEARCH.body}</p>
            <p className={styles.aiNote}>{AI_SEARCH.note}</p>
          </div>
          <div className={styles.aiAside}>
            <ul className={styles.ticks}>
              {AI_SEARCH.practice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.aiDiagram} aria-hidden="true">
              <div className={styles.aiOverview}>
                <span className={styles.aiOverviewLabel}>AI Overview</span>
                <p>Most furnaces last 15 to 20 years. Signs it is time to replace yours include rising bills and uneven heat.</p>
                <span className={styles.aiOverviewAd}>
                  <b>Sponsored</b>
                  {SAMPLE_AD.headline}
                </span>
              </div>
              <span className={styles.aiDiagramArrow} />
              <div className={styles.aiSignalStrip}>
                <span>Landing page</span>
                <span>Product feed</span>
                <span>Creative</span>
                <span>Conversions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process: one sentence per stage, read across */}
      <section className={styles.process} aria-labelledby="ga-process">
        <div className="container">
          <SectionTitle id="ga-process" className={styles.title}>
            How we run your account.
          </SectionTitle>
          <ol className={styles.steps}>
            {GOOGLE_ADS_PROCESS.map((step, index) => (
              <Reveal key={step.name} as="li" delay={index * 90} className={styles.step}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.stepName}>{step.name}</span>
                <span className={styles.stepBody}>{step.body}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <RelatedServices title="Google Ads works best alongside the rest of your marketing." current="/services/google-ads-management/" />

      <FaqAccordion eyebrow="" title="Frequently asked questions" items={GOOGLE_ADS_FAQS} />

      <PageCta cta={GOOGLE_ADS_CTA} />
    </main>
  );
}
