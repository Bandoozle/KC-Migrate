import Link from "next/link";
import { SectionDescription, SectionTitle } from "@/components/typography";
import styles from "./PageCta.module.css";

export type PageCtaData = {
  title: string;
  description?: string;
  primary: { label: string; href: string };
  phone?: { label: string; href: string } | null;
};

type PageCtaProps = {
  cta: PageCtaData;
};

export function PageCta({ cta }: PageCtaProps) {
  if (!cta.title && !cta.primary.label) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {cta.title ? (
          <SectionTitle as="h2" className={styles.title}>
            {cta.title}
          </SectionTitle>
        ) : null}
        {cta.description ? (
          <SectionDescription className={styles.description}>
            {cta.description}
          </SectionDescription>
        ) : null}
        <div className={styles.actions}>
          {cta.primary.label ? (
            <Link href={cta.primary.href} className={styles.primary}>
              {cta.primary.label}
            </Link>
          ) : null}
          {cta.phone?.label ? (
            <a href={cta.phone.href} className={styles.phone}>
              {cta.phone.label}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
