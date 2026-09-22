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
        {cards.map((card, index) => {
          const key = `${card.title}-${card.href || card.image.src}-${index}`;
          const body = (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.image.src} alt={card.image.alt || card.title} />
              <span className={styles.label}>{card.title}</span>
            </>
          );

          return card.href ? (
            <Link key={key} href={card.href} className={styles.card}>
              {body}
            </Link>
          ) : (
            <article key={key} className={styles.card}>
              {body}
            </article>
          );
        })}
      </div>
    </section>
  );
}
