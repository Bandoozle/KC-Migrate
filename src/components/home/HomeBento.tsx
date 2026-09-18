import Link from "next/link";
import type { HomeBentoItem } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeBento.module.css";

type HomeBentoProps = {
  items: HomeBentoItem[];
};

const CARD_POSITION = [
  styles.card1,
  styles.card2,
  styles.card3,
  styles.card4,
  styles.card5,
  styles.card6,
] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function HomeBento({ items }: HomeBentoProps) {
  return (
    <section className={`${shared.rail} ${styles.section}`} aria-label="What we do">
      <div className={styles.grid}>
        {items.map((item, index) => {
          const n = index + 1;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.card} ${CARD_POSITION[index]}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.image}
                src={item.image}
                alt={item.alt}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              <span className={styles.overlay} aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {String(n).padStart(2, "0")}
              </span>
              <div className={styles.content}>
                <h3 className={styles.title}>
                  <span className={styles.titlePrimary}>{item.titlePrimary}</span>
                  <span className={styles.titleSecondary}>{item.titleSecondary}</span>
                </h3>
                <p className={styles.description}>{item.description}</p>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowIcon />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
