import { BodyText, SectionTitle } from "@/components/typography";
import styles from "./SectionLead.module.css";

type SectionLeadProps = {
  title: string;
  body?: string;
};

export function SectionLead({ title, body }: SectionLeadProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <SectionTitle as="h2">{title}</SectionTitle>
        {body ? <BodyText className={styles.body}>{body}</BodyText> : null}
      </div>
    </section>
  );
}
