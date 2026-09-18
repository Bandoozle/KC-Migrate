import { SectionTitle } from "@/components/typography";
import type { ServicePartnerLogos } from "@/lib/wordpress/service-page-types";
import styles from "./PartnerLogoGrid.module.css";

type PartnerLogoGridProps = {
  section: ServicePartnerLogos;
};

export function PartnerLogoGrid({ section }: PartnerLogoGridProps) {
  if (section.logos.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        {section.title ? (
          <SectionTitle as="h2" className={styles.heading}>
            {section.title}
          </SectionTitle>
        ) : null}
        <div className={styles.grid}>
          {section.logos.map((logo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt || section.title}
              className={styles.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
