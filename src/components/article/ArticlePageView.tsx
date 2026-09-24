import Link from "next/link";
import { ArticleTableOfContents } from "@/components/article/ArticleTableOfContents";
import { MotionImage, Reveal } from "@/components/motion/Reveal";
import { MetaText, PageTitle } from "@/components/typography";
import { articleTocMinimum } from "@/lib/content/article-toc";
import {
  formatArticleDate,
  type ArticleContent,
} from "@/lib/wordpress/post";
import styles from "./ArticlePageView.module.css";

type ArticlePageViewProps = {
  content: ArticleContent;
};

export function ArticlePageView({ content }: ArticlePageViewProps) {
  const showToc = content.toc.length >= articleTocMinimum();

  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <header className={styles.header}>
          <div className={`container ${styles.headerInner}`}>
            <p className={styles.back}>
              <Link href="/feature-articles/">← Back to Feature Articles</Link>
            </p>
            <div className={styles.heroCopy}>
              <Reveal variant="fadeUp">
                <MetaText as="p" className={styles.meta}>
                  <time dateTime={content.date}>{formatArticleDate(content.date)}</time>
                </MetaText>
              </Reveal>
              <Reveal variant="fadeUp" delay={80}>
                <PageTitle as="h1" className={styles.title}>
                  {content.title}
                </PageTitle>
              </Reveal>
              {content.excerpt ? (
                <Reveal variant="fadeUp" delay={160}>
                  <p className={styles.dek}>{content.excerpt}</p>
                </Reveal>
              ) : null}
            </div>
          </div>
        </header>

        {content.featuredImage ? (
          <div className={styles.featured}>
            <div className={`container ${styles.featuredInner}`}>
              <MotionImage
                src={content.featuredImage.src}
                alt={content.featuredImage.alt}
                width={content.featuredImage.width}
                height={content.featuredImage.height}
                className={styles.featuredImage}
              />
            </div>
          </div>
        ) : null}

        <div className={`container ${showToc ? styles.reading : styles.bodyWrap}`}>
          {showToc ? <ArticleTableOfContents items={content.toc} /> : null}
          <div className={showToc ? styles.articleContent : undefined}>
            <Reveal variant="fade">
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
              />
            </Reveal>

            <p className={styles.back}>
              <Link href="/feature-articles/">← Back to Feature Articles</Link>
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
