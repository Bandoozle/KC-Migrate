import Link from "next/link";
import { BodyText, PageTitle } from "@/components/typography";
import styles from "./SimpleMessage.module.css";

type SimpleMessageProps = {
  title: string;
  description?: string;
  actions?: Array<{ label: string; href: string; primary?: boolean }>;
};

export function SimpleMessage({ title, description, actions = [] }: SimpleMessageProps) {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <PageTitle as="h1">{title}</PageTitle>
        {description ? <BodyText className={styles.description}>{description}</BodyText> : null}
        {actions.length > 0 ? (
          <div className={styles.actions}>
            {actions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className={action.primary ? styles.primary : styles.secondary}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
