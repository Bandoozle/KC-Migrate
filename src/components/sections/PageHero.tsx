import { PageTitle } from "@/components/typography";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  title: string;
  backgroundImage?: string | null;
  align?: "center" | "left";
};

export function PageHero({
  title,
  backgroundImage,
  align = "center",
}: PageHeroProps) {
  return (
    <section
      className={[styles.hero, align === "left" ? styles.left : styles.center].join(" ")}
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : undefined
      }
    >
      <div className={styles.overlay}>
        <div className={`container ${styles.inner}`}>
          <PageTitle as="h1" className={styles.title}>
            {title}
          </PageTitle>
        </div>
      </div>
    </section>
  );
}
