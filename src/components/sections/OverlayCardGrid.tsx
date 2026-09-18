import Link from "next/link";
import styles from "./OverlayCardGrid.module.css";

export type OverlayCard = {
  title: string;
  href: string | null;
  image: { src: string; alt: string };
};

type OverlayCardGridProps = {
  cards: OverlayCard[];
};

export function OverlayCardGrid({ cards }: OverlayCardGridProps) {
  if (cards.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        {cards.map((card) => {
          const body = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image.src} alt={card.image.alt || card.title} />
              <span className={styles.label}>{card.title}</span>
            </>
          );

          return card.href ? (
            <Link key={card.title} href={card.href} className={styles.card}>
              {body}
            </Link>
          ) : (
            <article key={card.title} className={styles.card}>
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
