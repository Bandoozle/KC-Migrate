import Link from "next/link";
import { BodyText, CardTitle } from "@/components/typography";
import styles from "./ArticleListing.module.css";

export type ArticleListItem = {
  title: string;
  excerpt: string;
  href: string;
  image: { src: string; alt: string } | null;
};

type ArticleListingProps = {
  articles: ArticleListItem[];
};

export function ArticleListing({ articles }: ArticleListingProps) {
  if (articles.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        {articles.map((article) => (
          <article key={article.href} className={styles.card}>
            {article.image ? (
              <Link href={article.href} className={styles.media} tabIndex={-1} aria-hidden>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image.src} alt="" />
              </Link>
            ) : null}
            <div className={styles.copy}>
              <CardTitle as="h2" className={styles.title}>
                <Link href={article.href}>{article.title}</Link>
              </CardTitle>
              {article.excerpt ? (
                <BodyText className={styles.excerpt}>{article.excerpt}</BodyText>
              ) : null}
              <Link href={article.href} className={styles.more}>
                Read More
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
