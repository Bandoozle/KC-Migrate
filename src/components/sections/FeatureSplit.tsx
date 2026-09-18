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
      <div
        className={[
          "container",
          styles.grid,
          mediaPosition === "left" ? styles.mediaLeft : styles.mediaRight,
        ].join(" ")}
      >
        <div className={styles.copy}>
          {feature.eyebrow ? (
            <Eyebrow className={styles.eyebrow}>{feature.eyebrow}</Eyebrow>
          ) : null}
          <SectionTitle as="h2" className={styles.title}>
            {feature.title}
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
    </section>
  );
}
