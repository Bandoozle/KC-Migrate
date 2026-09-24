import { BodyText, CardTitle, Eyebrow, SectionTitle, SubsectionTitle } from "@/components/typography";
import type { ServiceNarrativeSection } from "@/lib/wordpress/service-page-types";
import styles from "./EditorialColumns.module.css";

type EditorialColumnsProps = {
  section: ServiceNarrativeSection;
};

function Callout({ text }: { text: string }) {
  const pattern = /demand capture|visibility|follow-up/gi;
  const parts = text.split(pattern);
  pattern.lastIndex = 0;
  const marks = text.match(pattern) ?? [];

  return (
    <p className={styles.calloutText}>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {marks[index] ? <strong>{marks[index]}</strong> : null}
        </span>
      ))}
    </p>
  );
}

export function EditorialColumns({ section }: EditorialColumnsProps) {
  if (!section.title || section.columns.length === 0) return null;

  const cards = section.cards ?? [];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.intro}>
          {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
          <SectionTitle as="h2" className={styles.heading}>
            {section.title}
          </SectionTitle>
          {section.intro ? <BodyText className={styles.introBody}>{section.intro}</BodyText> : null}
        </div>

        {cards.length > 0 ? (
          <ul className={styles.cards}>
            {cards.map((card, index) => (
              <li key={card.title} className={styles.card}>
                <span className={styles.number} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className={styles.label}>{card.label}</p>
                <CardTitle as="h3" className={styles.cardTitle}>
                  {card.title}
                </CardTitle>
                <BodyText className={styles.cardBody}>{card.body}</BodyText>
              </li>
            ))}
          </ul>
        ) : null}

        {section.statement ? (
          <div className={styles.callout}>
            <Callout text={section.statement} />
          </div>
        ) : null}

        <div className={styles.columns}>
          {section.columns.map((column) => (
            <div key={column.title} className={styles.column}>
              <SubsectionTitle as="h3" className={styles.columnTitle}>
                {column.title}
              </SubsectionTitle>
              <BodyText className={styles.columnBody}>{column.body}</BodyText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
