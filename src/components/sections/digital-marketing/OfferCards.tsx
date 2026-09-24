import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow, SectionTitle } from "@/components/typography";
import type { OfferCard } from "@/lib/wordpress/digital-marketing";
import styles from "./OfferCards.module.css";

type OfferCardsProps = {
  eyebrow: string;
  title: string;
  cards: OfferCard[];
};

export function OfferCards({ eyebrow, title, cards }: OfferCardsProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <Reveal variant="fadeUp" className={styles.intro}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle as="h2" className={styles.heading}>
            {title}
          </SectionTitle>
        </Reveal>

        <div className={styles.grid}>
          {cards.map((card, index) => {
            const key = `${card.title}-${card.href || card.image?.src || index}`;
            const body = (
              <>
                <div className={styles.media}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image.src} alt={card.image.alt || card.title} />
                </div>
                <div className={styles.label}>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  {card.subtitle ? <p className={styles.cardSub}>{card.subtitle}</p> : null}
                </div>
              </>
            );

            return (
              <Reveal key={key} variant="scale" delay={Math.min(index, 7) * 90}>
                {card.href ? (
                  <Link href={card.href} className={styles.card}>
                    {body}
                  </Link>
                ) : (
                  <article className={styles.card}>{body}</article>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
