import { BodyText, Eyebrow, SectionTitle } from "@/components/typography";
import type { ServiceProcessSection } from "@/lib/wordpress/service-page-types";
import styles from "./ProcessSteps.module.css";

type ProcessStepsProps = {
  section: ServiceProcessSection;
};

export function ProcessSteps({ section }: ProcessStepsProps) {
  if (section.steps.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        {section.eyebrow || section.title ? (
          <div className={styles.intro}>
            {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
            {section.title ? (
              <SectionTitle as="h2" className={styles.heading}>
                {section.title}
              </SectionTitle>
            ) : null}
          </div>
        ) : null}

        <div className={styles.grid}>
          {section.steps.map((step) => (
            <article key={`${step.number}-${step.title}`} className={styles.step}>
              <p className={styles.number}>{step.number}</p>
              <h3 className={styles.title}>{step.title}</h3>
              {step.body ? <BodyText className={styles.body}>{step.body}</BodyText> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
