import Link from "next/link";
import { BodyText, Eyebrow, SectionTitle } from "@/components/typography";
import type { ServicePromoBand } from "@/lib/wordpress/service-page-types";
import styles from "./PromoBand.module.css";

type PromoBandProps = {
  band: ServicePromoBand;
};

export function PromoBand({ band }: PromoBandProps) {
  return (
    <section
      className={`section ${styles.section}`}
      style={
        band.backgroundImage
          ? { backgroundImage: `url(${band.backgroundImage})` }
          : undefined
      }
    >
      <div className={styles.overlay} aria-hidden />
      <div className={`container ${styles.inner}`}>
        <div className={styles.card}>
          {band.eyebrow ? <Eyebrow>{band.eyebrow}</Eyebrow> : null}
          <SectionTitle as="h2" className={styles.title}>
            {band.title}
          </SectionTitle>
          {band.body ? <BodyText className={styles.body}>{band.body}</BodyText> : null}
          {band.cta ? (
            <Link href={band.cta.href} className={styles.cta}>
              {band.cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
