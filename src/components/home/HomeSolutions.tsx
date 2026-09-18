import Link from "next/link";
import { CardTitle, MetaText, SectionDescription, SectionTitle } from "@/components/typography";
import type { HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeSolutions.module.css";

type HomeSolutionsProps = {
  content: HomePageContent["solutions"];
};

function LearnMoreArrow() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function HomeSolutions({ content }: HomeSolutionsProps) {
  return (
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby="home-solutions-title">
      <div className={styles.intro}>
        <SectionTitle id="home-solutions-title">{content.title}</SectionTitle>
        <SectionDescription className={styles.subtitle}>{content.subtitle}</SectionDescription>
      </div>
      <div className={styles.grid}>
        {content.items.map((item, index) => (
          <Link key={item.href} href={item.href} className={styles.card}>
            <div className={styles.media}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.image}
                src={item.image}
                alt={item.alt}
                loading={index < 4 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
            <div className={styles.content}>
              <div className={styles.copy}>
                <CardTitle as="h3" className={styles.cardTitle}>
                  {item.title}
                </CardTitle>
                <MetaText as="p" className={styles.description}>
                  {item.description}
                </MetaText>
              </div>
              <span className={styles.link}>
                Learn more <LearnMoreArrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
