import { MicrositeHero } from "@/components/microsites/MicrositeHero";
import { MicrositeRelatedBand } from "@/components/microsites/MicrositeRelatedBand";
import { micrositeFont } from "@/components/microsites/microsite-font";
import type { MexicoItineraryContent } from "@/lib/wordpress/microsites";
import styles from "./MexicoItineraryPageView.module.css";

type MexicoItineraryPageViewProps = {
  content: MexicoItineraryContent;
};

function InfoIcon({ kind }: { kind: "luggage" | "passport" | "hotel" | "table" }) {
  if (kind === "passport") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
        <path
          fill="currentColor"
          d="M6 2h9a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h9a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6zm4.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm0 7c2.2 0 4 1.12 4 2.5V17H6.5v-.5C6.5 15.12 8.3 14 10.5 14z"
        />
      </svg>
    );
  }
  if (kind === "hotel") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
        <path
          fill="currentColor"
          d="M4 11V4h2v2h12V4h2v7h1v9h-2v-2H5v2H3v-9h1zm2 0h12V8H6v3zm0 5h3v-2H6v2zm5 0h3v-2h-3v2zm5 0h3v-2h-3v2z"
        />
      </svg>
    );
  }
  if (kind === "table") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
        <path
          fill="currentColor"
          d="M3 6h18v3H3V6zm2 5h4v7H7v-5H5v-2zm6 0h4v2h-2v5h-2v-7zm6 0h4v2h-2v5h-2v-7z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.iconSvg}>
      <path
        fill="currentColor"
        d="M3 7a2 2 0 0 1 2-2h9l1 2h4a2 2 0 0 1 2 2v2H3V7zm0 4h18v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6zm3 2v2h2v-2H6z"
      />
    </svg>
  );
}

export function MexicoItineraryPageView({ content }: MexicoItineraryPageViewProps) {
  return (
    <main className={`${styles.main} ${micrositeFont.variable}`}>
      <MicrositeHero
        label={content.introTitle}
        slides={content.hero.slides}
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <section className={styles.intro}>
        <h2 className={styles.dateLine}>{content.dateLine}</h2>
        <h2 className={styles.introTitle}>{content.introTitle}</h2>
        <p className={styles.introBody}>{content.introBody}</p>

        <div className={styles.infoGrid}>
          {content.infoBoxes.map((box) => (
            <article key={box.title} className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <InfoIcon kind={box.icon} />
              </div>
              <h3 className={styles.infoTitle}>{box.title}</h3>
              <p className={styles.infoBody}>{box.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.schedule}>
        <div className={styles.scheduleLeft}>
          <h2 className={styles.scheduleTitle}>{content.scheduleTitle}</h2>
          <ul className={styles.dayList}>
            {content.scheduleDays.map((day) => (
              <li key={day.day} className={styles.day}>
                <div className={styles.dayBadge}>
                  <InfoIcon kind={day.icon} />
                </div>
                <div>
                  <h3 className={styles.dayTitle}>{day.day}</h3>
                  {day.items.map((item) => (
                    <p key={item} className={styles.dayItem}>
                      {item}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.scheduleRight}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.scheduleImage.src}
            alt={content.scheduleImage.alt}
            className={styles.scheduleImage}
          />
          <p className={styles.scheduleClosing}>{content.scheduleClosing}</p>
        </div>
      </section>

      <section className={styles.enjoy}>
        <h2 className={styles.enjoyTitle}>{content.enjoyTitle}</h2>
      </section>

      <MicrositeRelatedBand tiles={content.related} />
    </main>
  );
}
