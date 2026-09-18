import Link from "next/link";
import { BodyText, PageTitle, SectionTitle } from "@/components/typography";
import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { HeroCarousel } from "@/components/sections/digital-marketing/HeroCarousel";
import type { ResourceGuideContent } from "@/lib/wordpress/resource-guide-types";
import styles from "./ResourceGuidePageView.module.css";

type ResourceGuidePageViewProps = {
  content: ResourceGuideContent;
};

export function ResourceGuidePageView({ content }: ResourceGuidePageViewProps) {
  const hasSlides = content.hero.slides.length > 0;

  return (
    <main>
      {hasSlides ? (
        <HeroCarousel slides={content.hero.slides} title={content.hero.title} />
      ) : null}

      <section className={`section ${styles.titleSection}`}>
        <div className={`container ${styles.titleInner}`}>
          <PageTitle as="h1" className={styles.pageTitle}>
            {content.hero.title}
          </PageTitle>
          {content.hero.subtitle ? (
            <SectionTitle as="h2" className={styles.subtitle}>
              {content.hero.subtitle}
            </SectionTitle>
          ) : null}
        </div>
      </section>

      {content.intro ? (
        <section className={`section ${styles.introSection}`}>
          <div className={`container ${styles.introInner}`}>
            {content.intro.body.split(/\n\n+/).map((paragraph) => (
              <BodyText key={paragraph.slice(0, 48)} className={styles.introBody}>
                {paragraph}
              </BodyText>
            ))}
            {content.intro.cta ? (
              <Link href={content.intro.cta.href} className={styles.introCta}>
                {content.intro.cta.label}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {content.sections.map((section, index) => (
        <FeatureSplit
          key={section.title}
          feature={{
            eyebrow: section.spec,
            title: section.title,
            body: section.body,
            bullets: [],
            cta: section.cta,
            image: section.image,
            mediaPosition: index % 2 === 0 ? "right" : "left",
            tone: index % 2 === 1 ? "muted" : "default",
          }}
        />
      ))}
    </main>
  );
}
