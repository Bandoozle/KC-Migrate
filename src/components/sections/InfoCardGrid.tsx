import Link from "next/link";
import { BodyText, Eyebrow, SectionTitle } from "@/components/typography";
import type { ServiceInfoCard, ServiceIntroAction } from "@/lib/wordpress/service-page-types";
import styles from "./InfoCardGrid.module.css";

type InfoCardGridProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  actions?: ServiceIntroAction[];
  cards: ServiceInfoCard[];
  tone?: "default" | "muted";
};

export function InfoCardGrid({
  eyebrow,
  title,
  body,
  actions = [],
  cards,
  tone = "default",
}: InfoCardGridProps) {
  if (cards.length === 0 && !eyebrow && !title && !body && actions.length === 0) {
    return null;
  }

  return (
    <section
      className={[
        "section",
        styles.section,
        tone === "muted" ? styles.muted : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container">
        {eyebrow || title || body || actions.length > 0 ? (
          <div className={styles.intro}>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            {title ? (
              <SectionTitle as="h2" className={styles.heading}>
                {title}
              </SectionTitle>
            ) : null}
            {body ? <BodyText className={styles.introBody}>{body}</BodyText> : null}
            {actions.length > 0 ? (
              <div className={styles.actions}>
                {actions.map((action, index) => (
                  <Link
                    key={`${action.label}-${action.href}`}
                    href={action.href}
                    className={index === 0 ? styles.actionPrimary : styles.actionSecondary}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {cards.length > 0 ? (
          <div className={styles.grid}>
            {cards.map((card) => (
              <article key={card.title} className={styles.card}>
                {card.iconSvg ? (
                  <div
                    className={styles.icon}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: card.iconSvg }}
                  />
                ) : null}
                <h3 className={styles.cardTitle}>{card.title}</h3>
                {card.body ? <BodyText className={styles.body}>{card.body}</BodyText> : null}
                {card.items && card.items.length > 0 ? (
                  <ul className={styles.list}>
                    {card.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
