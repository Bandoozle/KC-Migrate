import { ComfortmakerRegistrationForm } from "@/components/microsites/ComfortmakerRegistrationForm";
import { MicrositeHero } from "@/components/microsites/MicrositeHero";
import { MicrositeRelatedBand } from "@/components/microsites/MicrositeRelatedBand";
import { micrositeFont } from "@/components/microsites/microsite-font";
import type { ComfortmakerContent } from "@/lib/wordpress/microsites";
import styles from "./ComfortmakerPageView.module.css";

type ComfortmakerPageViewProps = {
  content: ComfortmakerContent;
};

export function ComfortmakerPageView({ content }: ComfortmakerPageViewProps) {
  return (
    <main className={`${styles.main} ${micrositeFont.variable}`}>
      <MicrositeHero
        label={content.hero.title}
        slides={content.hero.slides}
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        subtitle={content.hero.subtitle}
      />

      <section className={styles.dateSection}>
        <h2 className={styles.dateLine}>{content.dateLine}</h2>
      </section>

      <section className={styles.formSection} aria-label="Conference registration">
        <ComfortmakerRegistrationForm />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.neeLogo}
          src={content.neeLogo.src}
          alt={content.neeLogo.alt}
        />
      </section>

      <section className={styles.leadGen}>
        <h2 className={styles.leadGenTitle}>{content.leadGenTitle}</h2>
      </section>

      <MicrositeRelatedBand tiles={content.related} />
    </main>
  );
}
