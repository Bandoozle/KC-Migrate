"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { BodyText, CardTitle, MetaText, SectionDescription, SectionTitle } from "@/components/typography";
import styles from "./ArticleListing.module.css";

export type ArticleListItem = {
  title: string;
  excerpt: string;
  href: string;
  image: { src: string; alt: string } | null;
  /** Plain title, excerpt, and article text used for search. */
  searchText: string;
  /** Theme ids derived from the title and excerpt. */
  topics: string[];
  /** Small card label. Falls back to the WordPress "Latest" category. */
  label: string;
};

type ArticleListingProps = {
  articles: ArticleListItem[];
  heading?: string;
  description?: string;
};

const PAGE_SIZE = 9;

export function ArticleListing({ articles, heading, description }: ArticleListingProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const signature = articles.map((article) => article.href).join("|");

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [signature]);

  if (articles.length === 0) return null;

  const shown = articles.slice(0, visible);
  const remaining = articles.length - shown.length;

  return (
    <section className={`section ${styles.section}`}>
      {heading ? (
        <div className={`container ${styles.intro}`}>
          <SectionTitle as="h2">{heading}</SectionTitle>
          {description ? <SectionDescription>{description}</SectionDescription> : null}
        </div>
      ) : null}
      <div className={`container ${styles.grid}`}>
        {shown.map((article, index) => (
          <Reveal
            key={article.href}
            as="article"
            variant="fadeUp"
            delay={Math.min(index % 3, 2) * 90}
            className={styles.card}
          >
            <Link href={article.href} className={styles.cardLink}>
              <div className={styles.media}>
                {article.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.image.src} alt="" />
                ) : null}
              </div>
              <div className={styles.body}>
                {article.label ? <MetaText className={styles.label}>{article.label}</MetaText> : null}
                <CardTitle as="h3" className={styles.title}>
                  {article.title}
                </CardTitle>
                {article.excerpt ? (
                  <BodyText className={styles.excerpt}>{article.excerpt}</BodyText>
                ) : null}
                <span className={styles.more}>
                  Read More
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      {remaining > 0 ? (
        <div className={`container ${styles.moreWrap}`}>
          <button type="button" className={styles.loadMore} onClick={() => setVisible((count) => count + PAGE_SIZE)}>
            Load more
          </button>
        </div>
      ) : null}
    </section>
  );
}
