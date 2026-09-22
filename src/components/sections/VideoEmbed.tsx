import { Eyebrow, SectionTitle } from "@/components/typography";
import type { ServiceVideoSection } from "@/lib/wordpress/service-page-types";
import styles from "./VideoEmbed.module.css";

type VideoEmbedProps = {
  section: ServiceVideoSection;
};

const LABEL_ACRONYMS = new Set([
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

/** "tv creative" / "TV CREATIVE" → "TV Creative". */
function toFeatureLabelCase(value: string): string {
  return value.trim().replace(/[A-Za-z][A-Za-z']*/g, (word) => {
    const upper = word.toUpperCase();
    if (LABEL_ACRONYMS.has(upper)) return upper;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

export function VideoEmbed({ section }: VideoEmbedProps) {
  if (!section.src) return null;

  const eyebrow = section.eyebrow ? toFeatureLabelCase(section.eyebrow) : null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {eyebrow || section.title ? (
          <div className={styles.intro}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {section.title ? (
              <SectionTitle as="h2" className={styles.heading}>
                {section.title}
              </SectionTitle>
            ) : null}
          </div>
        ) : null}
        <div className={styles.frame}>
          <iframe
            src={section.src}
            title={section.title || eyebrow || "Video"}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
