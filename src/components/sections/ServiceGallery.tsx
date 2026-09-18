import { BodyText, SectionTitle } from "@/components/typography";
import type { ServiceGallerySection } from "@/lib/wordpress/service-page-types";
import styles from "./ServiceGallery.module.css";

type ServiceGalleryProps = {
  section: ServiceGallerySection;
};

export function ServiceGallery({ section }: ServiceGalleryProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SectionTitle as="h2">{section.title}</SectionTitle>
          {section.body ? <BodyText>{section.body}</BodyText> : null}
          {section.labels && section.labels.length > 0 ? (
            <ul className={styles.labels}>
              {section.labels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={styles.media}>
          {section.images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={image.src} src={image.src} alt={image.alt || section.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
