import { Eyebrow, SectionTitle } from "@/components/typography";
import type { ServiceVideoSection } from "@/lib/wordpress/service-page-types";
import styles from "./VideoEmbed.module.css";

type VideoEmbedProps = {
  section: ServiceVideoSection;
};

export function VideoEmbed({ section }: VideoEmbedProps) {
  if (!section.src) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {section.eyebrow || section.title ? (
          <div className={styles.intro}>
            {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
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
            title={section.title || section.eyebrow || "Video"}
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
