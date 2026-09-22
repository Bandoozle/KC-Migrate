import Link from "next/link";
import { BodyText, Eyebrow, SectionIntro, SectionTitle } from "@/components/typography";
import type { ServiceInfoCard, ServiceIntroAction } from "@/lib/wordpress/service-page-types";
import styles from "./InfoCardGrid.module.css";

type InfoCardGridProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  actions?: ServiceIntroAction[];
  cards: ServiceInfoCard[];
  tone?: "default" | "muted";
  /** Desktop column count. Defaults to 4, or 3 when there are exactly 3/6 cards. */
  columns?: 2 | 3 | 4;
  introAlign?: "left" | "center";
  /** Tighter padding/gaps for checklist capability cards. */
  density?: "default" | "compact";
};

export function InfoCardGrid({
  eyebrow,
  title,
  body,
  actions = [],
  cards,
  tone = "default",
  columns,
  introAlign = "left",
  density = "default",
}: InfoCardGridProps) {
  if (cards.length === 0 && !eyebrow && !title && !body && actions.length === 0) {
    return null;
  }

  const resolvedColumns =
    columns ?? (cards.length === 3 || cards.length === 6 ? 3 : 4);
  const hasIntro = Boolean(eyebrow || title || body || actions.length > 0);
  const useCenteredIntro = introAlign === "center" && !eyebrow && actions.length === 0;
  const isCompact = density === "compact";

  return (
    <section
      className={[
        "section",
        styles.section,
        tone === "muted" ? styles.muted : "",
        isCompact ? styles.compact : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="container">
        {hasIntro ? (
          useCenteredIntro && title ? (
            <SectionIntro align="center" title={title} description={body} />
          ) : (
            <div
              className={[
                styles.intro,
                introAlign === "center" ? styles.introCentered : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
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
          )
        ) : null}

        {cards.length > 0 ? (
          <div
            className={[
              styles.grid,
              resolvedColumns === 3 ? styles.cols3 : "",
              resolvedColumns === 2 ? styles.cols2 : "",
              resolvedColumns === 4 ? styles.cols4 : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {cards.map((card, index) => (
              <article
                key={card.id ?? `${card.title}-${index}`}
                className={[
                  styles.card,
                  card.image?.src ? styles.cardWithImage : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {card.image?.src ? (
                  <div className={styles.media}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image.src}
                      alt={card.image.alt || card.title}
                    />
                  </div>
                ) : null}
                <div className={styles.cardBody}>
                  {card.iconSvg ? (
                    <div
                      className={styles.icon}
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: card.iconSvg }}
                    />
                  ) : null}
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  {card.body ? (
                    <BodyText className={styles.body}>{card.body}</BodyText>
                  ) : null}
                  {card.items && card.items.length > 0 ? (
                    <ul className={styles.list}>
                      {card.items.map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
