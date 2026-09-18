import Link from "next/link";
import { MetaText, PageTitle } from "@/components/typography";
import {
  formatArticleDate,
  type ArticleContent,
} from "@/lib/wordpress/post";
import styles from "./ArticlePageView.module.css";

type ArticlePageViewProps = {
  content: ArticleContent;
};

export function ArticlePageView({ content }: ArticlePageViewProps) {
  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <MetaText as="p" className={styles.meta}>
              <time dateTime={content.date}>{formatArticleDate(content.date)}</time>
            </MetaText>
            <PageTitle as="h1" className={styles.title}>
              {content.title}
            </PageTitle>
            {content.excerpt ? (
              <p className={styles.dek}>{content.excerpt}</p>
            ) : null}
          </div>
        </header>

        {content.featuredImage ? (
          <div className={styles.featured}>
            <div className={`container ${styles.featuredInner}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.featuredImage.src}
                alt={content.featuredImage.alt}
                width={content.featuredImage.width}
                height={content.featuredImage.height}
                className={styles.featuredImage}
              />
            </div>
          </div>
        ) : null}

        <div className={`container ${styles.bodyWrap}`}>
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
          />

          <p className={styles.back}>
            <Link href="/feature-articles/">← Feature Articles</Link>
          </p>
        </div>
      </article>
    </main>
  );
}
