import Link from "next/link";
import { BodyText, Eyebrow, SectionTitle } from "@/components/typography";
import styles from "./FeatureSplit.module.css";

export type FeatureSplitData = {
  eyebrow?: string;
  title: string;
  body?: string;
  bullets?: string[];
  cta?: { label: string; href: string } | null;
  image?: { src: string; alt: string } | null;
  mediaPosition?: "left" | "right";
  tone?: "default" | "muted";
};

type FeatureSplitProps = {
  feature: FeatureSplitData;
};

/** Convert ALL-CAPS WP labels like "LINEAR TELEVISION" → "Linear television". */
function toSentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  }
  return trimmed;
}

export function FeatureSplit({ feature }: FeatureSplitProps) {
  const bullets = feature.bullets ?? [];
  const mediaPosition = feature.mediaPosition ?? "right";

  return (
    <section
      className={[
        "section",
        styles.section,
        feature.tone === "muted" ? styles.muted : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.featureContainer}>
        <div
          className={[
            styles.featureGrid,
            mediaPosition === "left" ? styles.mediaLeft : styles.mediaRight,
          ].join(" ")}
        >
          <div className={styles.copy}>
            {feature.eyebrow ? (
              <Eyebrow className={`kosick-feature-label ${styles.eyebrow}`}>
                {toSentenceCase(feature.eyebrow)}
              </Eyebrow>
            ) : null}
            <SectionTitle as="h2" className={styles.title}>
              {toSentenceCase(feature.title)}
            </SectionTitle>
            {feature.body ? <BodyText className={styles.body}>{feature.body}</BodyText> : null}
            {bullets.length > 0 ? (
              <ul className={styles.list}>
                {bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {feature.cta ? (
              <Link href={feature.cta.href} className={styles.cta}>
                {feature.cta.label}
              </Link>
            ) : null}
          </div>

          {feature.image ? (
            <div className={styles.media}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={feature.image.src} alt={feature.image.alt || feature.title} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
