import styles from "./SectionSeparator.module.css";

export function SectionSeparator({ tight = false }: { tight?: boolean } = {}) {
  return (
    <hr
      className={`${styles.separator}${tight ? ` ${styles.tight}` : ""}`}
      aria-hidden="true"
    />
  );
}
