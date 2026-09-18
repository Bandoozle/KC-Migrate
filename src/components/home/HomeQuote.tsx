import type { HomePageContent } from "@/lib/wordpress/home";
import styles from "./HomeQuote.module.css";

type HomeQuoteProps = {
  content: HomePageContent["quote"];
};

export function HomeQuote({ content }: HomeQuoteProps) {
  return (
    <section className={styles.section} aria-label="Featured quote">
      <div className={styles.inner}>
        <div className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 512 512" width="36" height="36" fill="currentColor">
            <path d="M464 32H336c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48zm-288 0H48C21.5 32 0 53.5 0 80v128c0 26.5 21.5 48 48 48h80v64c0 35.3-28.7 64-64 64h-8c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h8c88.4 0 160-71.6 160-160V80c0-26.5-21.5-48-48-48z" />
          </svg>
        </div>
        <blockquote className={styles.quote}>
          <p>“{content.text}”</p>
        </blockquote>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.photo}
          src={content.photoSrc}
          alt={content.photoAlt}
          width={80}
          height={80}
          loading="lazy"
          decoding="async"
        />
        <p className={styles.attribution}>
          <strong>{content.name}</strong>
          <span>{content.role}</span>
        </p>
      </div>
    </section>
  );
}
