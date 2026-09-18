import { SectionDescription, SectionTitle } from "@/components/typography";
import type { HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeTestimonials.module.css";

type HomeTestimonialsProps = {
  content: HomePageContent["testimonials"];
};

export function HomeTestimonials({ content }: HomeTestimonialsProps) {
  return (
    <section
      className={`${shared.rail} ${styles.section}`}
      aria-labelledby="home-testimonials-title"
    >
      <div className={`${shared.introCentered} ${styles.intro}`}>
        <SectionTitle id="home-testimonials-title">{content.title}</SectionTitle>
        <SectionDescription>{content.lead}</SectionDescription>
      </div>
      <div className={styles.grid}>
        {content.items.map((item) => (
          <article key={item.logo} className={styles.card}>
            <h3 className={styles.logo}>{item.logo}</h3>
            <p className={styles.quote}>“{item.quote}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
