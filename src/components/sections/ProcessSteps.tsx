import { BodyText, Eyebrow, SectionTitle } from "@/components/typography";
import type { ServiceProcessSection } from "@/lib/wordpress/service-page-types";
import styles from "./ProcessSteps.module.css";

type ProcessStepsProps = {
  section: ServiceProcessSection;
};

function formatStepNumber(value: string, index: number): string {
  const digits = value.replace(/\D/g, "");
  if (digits) return digits.padStart(2, "0");
  return String(index + 1).padStart(2, "0");
}

export function ProcessSteps({ section }: ProcessStepsProps) {
  if (section.steps.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        {section.eyebrow || section.title ? (
          <header className={styles.intro}>
            {section.eyebrow ? (
              <Eyebrow className={styles.eyebrow}>{section.eyebrow}</Eyebrow>
            ) : null}
            {section.title ? (
              <SectionTitle as="h2" className={styles.heading}>
                {section.title}
              </SectionTitle>
            ) : null}
          </header>
        ) : null}

        <ol className={styles.grid}>
          {section.steps.map((step, index) => (
            <li key={`${step.number}-${step.title}`} className={styles.step}>
              <span className={styles.number}>
                {formatStepNumber(step.number, index)}
              </span>
              <h3 className={`card-title ${styles.title}`}>{step.title}</h3>
              {step.body ? <BodyText className={styles.body}>{step.body}</BodyText> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
