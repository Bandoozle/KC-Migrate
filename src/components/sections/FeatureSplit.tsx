import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
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
  /** One-time horizontal reveal. Skips the sticky feature stack. */
  motion?: "reveal";
};

type FeatureSplitProps = {
  feature: FeatureSplitData;
  /** When set, enables sticky layered scroll within a FeatureSplitStack. */
  stackIndex?: number;
};

const SENTENCE_CASE_ACRONYMS = new Set([
  "TV",
  "CTV",
  "SEO",
  "HVAC",
  "AI",
  "OOH",
  "PPC",
  "ROI",
  "CTA",
  "FAQ",
  "API",
  "UI",
  "UX",
]);

/**
 * Sentence case for titles/CTAs: "UNLOCK…" → "Unlock…", preserving acronyms (TV, SEO).
 */
function toSentenceCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  return trimmed.replace(/[A-Za-z][A-Za-z']*/g, (word, offset, full) => {
    const upper = word.toUpperCase();
    if (SENTENCE_CASE_ACRONYMS.has(upper)) return upper;
    const before = full.slice(0, offset);
    const isStart = !before.trim() || /[.!?]\s*$/.test(before);
    if (isStart) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  });
}

/**
 * Short feature labels: Title Case with acronyms — "TV CREATIVE" → "TV Creative".
 */
function toFeatureLabelCase(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  return trimmed.replace(/[A-Za-z][A-Za-z']*/g, (word) => {
    const upper = word.toUpperCase();
    if (SENTENCE_CASE_ACRONYMS.has(upper)) return upper;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function FeatureSplit({ feature, stackIndex }: FeatureSplitProps) {
  const bullets = feature.bullets ?? [];
  const mediaPosition = feature.mediaPosition ?? "right";
  const stacked = typeof stackIndex === "number";
  const textOnly = !feature.image?.src;
  const slide = !textOnly && !stacked;
  const textFrom = mediaPosition === "left" ? "right" : "left";
  const imageFrom = mediaPosition === "left" ? "left" : "right";
  const textDelay = mediaPosition === "left" ? 120 : 0;
  const imageDelay = mediaPosition === "left" ? 0 : 120;

  const copy = (
    <>
      {feature.eyebrow ? (
        <Eyebrow className={`kosick-feature-label ${styles.eyebrow}`}>
          {toFeatureLabelCase(feature.eyebrow)}
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
          {toSentenceCase(feature.cta.label)}
        </Link>
      ) : null}
    </>
  );

  const media = feature.image ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={feature.image.src} alt={feature.image.alt || feature.title} />
  ) : null;

  function slot(
    node: ReactNode,
    className: string,
    from: "left" | "right",
    delay: number,
  ) {
    if (textOnly) {
      return (
        <Reveal variant="fadeUp" className={className}>
          {node}
        </Reveal>
      );
    }
    if (!slide) return <div className={className}>{node}</div>;
    return (
      <Reveal variant={from} delay={delay} className={className}>
        {node}
      </Reveal>
    );
  }

  return (
    <section
      className={[
        "section",
        styles.section,
        feature.tone === "muted" ? styles.muted : "",
        stacked ? styles.stacked : "",
        textOnly ? styles.textOnly : "",
        slide ? styles.revealClip : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        stacked
          ? ({ ["--stack-index"]: stackIndex } as CSSProperties)
          : undefined
      }
      data-stack-index={stacked ? stackIndex : undefined}
    >
      <div className="container">
        <div
          className={[
            styles.featureGrid,
            mediaPosition === "left" ? styles.mediaLeft : styles.mediaRight,
          ].join(" ")}
        >
          {slot(copy, styles.copy, textFrom, textDelay)}
          {media ? slot(media, styles.media, imageFrom, imageDelay) : null}
        </div>
      </div>
    </section>
  );
}
