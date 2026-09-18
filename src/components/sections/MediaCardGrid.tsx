import Link from "next/link";
import { BodyText, SectionTitle } from "@/components/typography";
import type { ServiceMediaCardSection } from "@/lib/wordpress/service-page-types";
import styles from "./MediaCardGrid.module.css";

type MediaCardGridProps = {
  section: ServiceMediaCardSection;
};

export function MediaCardGrid({ section }: MediaCardGridProps) {
  if (section.cards.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        {section.title ? (
          <SectionTitle as="h2" className={styles.heading}>
            {section.title}
          </SectionTitle>
        ) : null}
        <div className={styles.grid}>
          {section.cards.map((card) => {
            const media = card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image.src}
                alt={card.image.alt || card.title}
                className={styles.image}
              />
            ) : null;

            const title = <h3 className={styles.cardTitle}>{card.title}</h3>;
            const body = card.body ? (
              <BodyText className={styles.body}>{card.body}</BodyText>
            ) : null;

            if (card.href) {
              const external = /^https?:\/\//i.test(card.href);
              return (
                <article key={card.title} className={styles.card}>
                  <Link
                    href={card.href}
                    className={styles.cardLink}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {media}
                    {title}
                  </Link>
                  {body}
                </article>
              );
            }

            return (
              <article key={card.title} className={styles.card}>
                {media}
                {title}
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
