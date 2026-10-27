import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { InternalPageHero } from "@/components/sections/InternalPageHero";
import { SiteMapArticles } from "@/components/sections/site-map/SiteMapArticles";
import { SiteMapDirectory } from "@/components/sections/site-map/SiteMapDirectory";
import styles from "@/components/sections/site-map/SiteMap.module.css";
import { SectionTitle } from "@/components/typography";
import { getSiteMapContent } from "@/lib/wordpress/site-map";

export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/site-map/");
}

export default async function SiteMapPage() {
  const content = await getSiteMapContent();
  // WordPress lists pages and feature articles as separate headed lists
  const articleSection = content.sections.find((section) => /article/i.test(section.title));
  const pages = content.sections.filter((section) => section !== articleSection).flatMap((section) => section.links);
  const articles = articleSection?.links ?? [];

  return (
    <main>
      <InternalPageHero
        plain
        compact
        eyebrow="Site Map"
        titlePrimary="Explore Kosick Communications."
        description="Find services, marketing programs, company information and resources across the site."
      />

      <section className={styles.directorySection} aria-labelledby="sm-pages">
        <div className="container">
          <div className={styles.head}>
            <SectionTitle as="h2" id="sm-pages" className={styles.title}>
              Pages
            </SectionTitle>
          </div>
          <SiteMapDirectory links={pages} />
        </div>
      </section>

      {articles.length > 0 ? (
        <section className={styles.articlesSection} aria-labelledby="sm-articles">
          <div className="container">
            <div className={styles.head}>
              <p className={styles.label}>Insights</p>
              <SectionTitle as="h2" id="sm-articles" className={styles.title}>
                Featured articles
              </SectionTitle>
              <p className={styles.lead}>Guides and perspectives from our team, grouped by topic.</p>
            </div>
            <SiteMapArticles links={articles} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
