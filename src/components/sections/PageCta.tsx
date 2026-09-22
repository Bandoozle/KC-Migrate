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

function PhoneIcon() {
  return (
    <svg
      className={styles.phoneIcon}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.61 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.18a2 2 0 0 1 2.11-.45c.84.28 1.72.49 2.62.61A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

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
              <PhoneIcon />
              <span>{cta.phone.label}</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
