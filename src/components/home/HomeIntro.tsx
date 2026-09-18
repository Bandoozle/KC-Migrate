import { SectionDescription, SectionTitle } from "@/components/typography";
import type { HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeIntro.module.css";

type HomeIntroProps = {
  content: HomePageContent["whatWeDoIntro"];
};

export function HomeIntro({ content }: HomeIntroProps) {
  return (
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby="home-intro-title">
      <div className={styles.intro}>
        <SectionTitle id="home-intro-title">{content.title}</SectionTitle>
        <SectionDescription className={styles.description}>
          {content.description}
        </SectionDescription>
      </div>
    </section>
  );
}
