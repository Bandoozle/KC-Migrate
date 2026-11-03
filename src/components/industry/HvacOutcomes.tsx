import type { JSX } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import type { Application, ApplicationIcon, Benefit, BenefitVisual } from "@/lib/industries";
import styles from "./HvacOutcomes.module.css";

/*
 * HVAC service pages: benefits and real-world applications.
 * The first benefit leads as a large panel and the other two support it. Each
 * benefit can carry a small UI diagram that shows the outcome rather than
 * restating it; the diagrams are decorative and hidden from assistive tech.
 */

function CallsVisual() {
  return (
    <div className={`${styles.visual} ${styles.calls}`} aria-hidden="true">
      <div className={styles.phone}>
        <span className={styles.phoneBar} />
        <span className={styles.phoneLine} />
        <span className={`${styles.phoneLine} ${styles.short}`} />
        <span className={styles.phoneCall}>Call now</span>
        <span className={styles.phoneBook}>Book online</span>
      </div>
      <div className={styles.meters}>
        <div className={styles.meter}>
          <span className={styles.meterLabel}>Same visitors</span>
          <span className={styles.meterTrack}>
            <span className={`${styles.meterFill} ${styles.meterVisitors}`} />
          </span>
        </div>
        <div className={styles.meter}>
          <span className={styles.meterLabel}>Calls &amp; bookings</span>
          <span className={styles.meterTrack}>
            <span className={`${styles.meterFill} ${styles.meterCalls}`} />
          </span>
        </div>
      </div>
    </div>
  );
}

function CampaignsVisual() {
  return (
    <div className={`${styles.visual} ${styles.campaigns}`} aria-hidden="true">
      <ul className={styles.sources}>
        <li>Search</li>
        <li>Social</li>
        <li>Co-op</li>
      </ul>
      <svg className={styles.routes} viewBox="0 0 64 96" preserveAspectRatio="none">
        <path d="M0 13 C 32 13, 32 48, 64 48" />
        <path d="M0 48 L 64 48" />
        <path d="M0 83 C 32 83, 32 48, 64 48" />
      </svg>
      <span className={styles.landing}>
        <span className={styles.landingDot} />
        Offer page
      </span>
    </div>
  );
}

function EditorVisual() {
  return (
    <div className={`${styles.visual} ${styles.editor}`} aria-hidden="true">
      <span className={styles.editorHead}>Seasonal offer</span>
      <span className={styles.editorField}>
        Furnace tune-up
        <span className={styles.caret} />
      </span>
      <span className={styles.editorRow}>
        Rebate banner
        <span className={styles.toggle}>
          <span />
        </span>
      </span>
      <span className={styles.publish}>Publish</span>
    </div>
  );
}

const VISUALS: Record<BenefitVisual, () => JSX.Element> = {
  calls: CallsVisual,
  campaigns: CampaignsVisual,
  editor: EditorVisual,
};

const ICON_PATHS: Record<ApplicationIcon, JSX.Element> = {
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </>
  ),
  rebate: (
    <>
      <path d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1l8 8a1.4 1.4 0 0 1 0 2l-7.1 7.1a1.4 1.4 0 0 1-2 0z" />
      <circle cx="8.2" cy="8.2" r="1.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4M9 14.8l2 2 4-4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
};

const FALLBACK_ICONS: ApplicationIcon[] = ["phone", "rebate", "calendar", "pin"];

function AppIcon({ name }: { name: ApplicationIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[name]}
      </g>
    </svg>
  );
}

type HvacOutcomesProps = {
  benefits: Benefit[];
  applications: Application[];
};

export function HvacOutcomes({ benefits, applications }: HvacOutcomesProps) {
  return (
    <section className={styles.outcomes} aria-labelledby="svc-benefits">
      <div className="container">
        <p className={styles.label}>Benefits</p>
        <SectionTitle id="svc-benefits" className={styles.title}>
          What it changes for you.
        </SectionTitle>

        <ul className={styles.stage} data-count={benefits.length}>
          {benefits.map((benefit, index) => {
            const Visual = benefit.visual ? VISUALS[benefit.visual] : null;
            return (
              <Reveal
                key={benefit.title}
                as="li"
                delay={index * 110}
                className={`${styles.slot} ${index === 0 ? styles.featured : ""}`}
              >
                <article className={styles.benefit} data-visual={benefit.visual ?? "none"}>
                  <div className={styles.benefitCopy}>
                    <span className={styles.outcomeTag}>Outcome {String(index + 1).padStart(2, "0")}</span>
                    <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                    <p className={styles.benefitBody}>{benefit.body}</p>
                  </div>
                  {Visual ? <Visual /> : null}
                </article>
              </Reveal>
            );
          })}
        </ul>

        <div className={styles.apps}>
          <p className={styles.appsKicker}>Where this shows up</p>
          <h3 className={styles.appsTitle}>Real-world applications</h3>
          <ul className={styles.appGrid}>
            {applications.map((item, index) => {
              const entry = typeof item === "string" ? { title: null, body: item, icon: undefined } : item;
              const icon = entry.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length];
              return (
                <Reveal key={entry.body} as="li" delay={index * 80} className={styles.appSlot}>
                  <div className={styles.app}>
                    <span className={styles.appIcon}>
                      <AppIcon name={icon} />
                    </span>
                    {entry.title ? <h4 className={styles.appTitle}>{entry.title}</h4> : null}
                    <p className={styles.appBody}>{entry.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
