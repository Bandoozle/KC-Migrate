import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import type { IndustryId, IndustryImage } from "@/lib/industries";
import "@/styles/industry-themes.css";
import styles from "./IndustryIntro.module.css";

/*
 * The opening section of an industry page or service page. The copy is always
 * the same shape (a title, why it matters, what Kosick does), so each industry
 * composes it with its own photograph in its own way rather than as two
 * floating paragraphs.
 */
const COMPOSITION: Record<IndustryId, keyof typeof styles> = {
  hvac: "workbench",
  "medical-dental": "consultation",
  golf: "yardage",
  retail: "spread",
  "specialty-retail": "window",
  construction: "spec",
  travel: "route",
};

type IndustryIntroProps = {
  industry: IndustryId;
  headingId: string;
  label: string;
  title: string;
  paragraphs: string[];
  image: IndustryImage;
};

export function IndustryIntro({ industry, headingId, label, title, paragraphs, image }: IndustryIntroProps) {
  const [context, ...rest] = paragraphs;
  const composition = COMPOSITION[industry];

  return (
    <section className={`${styles.intro} ${styles[composition]} industry-${industry}`} aria-labelledby={headingId}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.head}>
          <p className={styles.label}>{label}</p>
          <SectionTitle id={headingId} className={styles.title}>
            {title}
          </SectionTitle>
        </div>
        <Reveal variant="fade" className={styles.media}>
          <div className={styles.frame}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 960px) 45vw, 100vw"
              className={styles.cover}
              style={image.position ? { objectPosition: image.position } : undefined}
            />
          </div>
        </Reveal>
        {context ? (
          <div className={styles.context}>
            <span className={styles.kicker}>Why it matters</span>
            <p>{context}</p>
          </div>
        ) : null}
        {rest.length > 0 ? (
          <div className={styles.answer}>
            <span className={styles.kicker}>What we do</span>
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
