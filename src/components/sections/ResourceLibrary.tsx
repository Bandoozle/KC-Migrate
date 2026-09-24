"use client";

import Link from "next/link";
import { useEffect, useState, type PointerEvent } from "react";
import { ArticleListing, type ArticleListItem } from "@/components/sections/ArticleListing";
import { BodyText, CardTitle, MetaText, PageTitle, SectionDescription } from "@/components/typography";
import { RESOURCE_FILTERS } from "@/lib/content/resource-topics";
import styles from "./ResourceLibrary.module.css";

type ResourceLibraryProps = {
  articles: ArticleListItem[];
};

function usePerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia("(max-width: 1024px)");
    const update = () => {
      if (mobile.matches) setPerView(1);
      else if (tablet.matches) setPerView(2);
      else setPerView(3);
    };
    update();
    mobile.addEventListener("change", update);
    tablet.addEventListener("change", update);
    return () => {
      mobile.removeEventListener("change", update);
      tablet.removeEventListener("change", update);
    };
  }, []);

  return perView;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d={direction === "next" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ResourceLibrary({ articles }: ResourceLibraryProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("featured");
  const [index, setIndex] = useState(0);
  const perView = usePerView();

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = articles.filter((article) => {
    const matchesTopic = filter === "featured" || article.topics.includes(filter);
    const matchesQuery = !normalizedQuery || article.searchText.includes(normalizedQuery);
    return matchesTopic && matchesQuery;
  });

  const maxStart = Math.max(0, filtered.length - perView);
  const start = Math.min(index, maxStart);
  const canSlide = filtered.length > perView;

  useEffect(() => {
    setIndex(0);
  }, [filter, normalizedQuery, perView]);

  const step = (delta: number) => {
    setIndex((current) => {
      const limit = Math.max(0, filtered.length - perView);
      if (limit === 0) return 0;
      const next = current + delta;
      if (next > limit) return 0;
      if (next < 0) return limit;
      return next;
    });
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const startX = Number(event.currentTarget.dataset.x || 0);
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 48) return;
    step(delta < 0 ? 1 : -1);
  };

  return (
    <>
      <section className={styles.featured} aria-labelledby="resources-title">
        <div className={`container ${styles.featuredInner}`}>
          <div className={styles.featuredHeader}>
            <PageTitle id="resources-title" className={styles.title}>
              Feature Articles
            </PageTitle>
            <SectionDescription className={styles.subtitle}>
              Insights, strategies, and practical marketing guidance to help your business grow.
            </SectionDescription>
          </div>

          <div className={styles.featuredControls}>
            <form className={styles.search} role="search" onSubmit={(event) => event.preventDefault()}>
              <label className={styles.searchLabel} htmlFor="resource-search">
                Search resources
              </label>
              <input
                id="resource-search"
                className={styles.searchInput}
                type="search"
                value={query}
                placeholder="What are you looking for?"
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className={styles.searchIcon} aria-hidden="true">
                <SearchIcon />
              </span>
            </form>

            <div className={styles.filters} role="toolbar" aria-label="Resource categories">
              {RESOURCE_FILTERS.map((item) => {
                const selected = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={selected ? `${styles.filter} ${styles.filterActive}` : styles.filter}
                    aria-pressed={selected}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className={styles.carousel}>
              <div
                className={styles.viewport}
                onPointerDown={(event) => {
                  event.currentTarget.dataset.x = String(event.clientX);
                }}
                onPointerUp={onPointerUp}
              >
                <div
                  className={styles.track}
                  style={{
                    transform: `translateX(calc(${start} * -1 * ((100% - ${(perView - 1) * 1.25}rem) / ${perView} + ${perView > 1 ? "1.25rem" : "0px"})))`,
                  }}
                >
                  {filtered.map((article) => (
                    <article key={article.href} className={styles.card} style={{ flexBasis: `calc((100% - ${(perView - 1) * 1.25}rem) / ${perView})` }}>
                      <Link href={article.href} className={styles.cardLink}>
                        <div className={styles.media}>
                          {article.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={article.image.src} alt="" />
                          ) : null}
                        </div>
                        <div className={styles.cardBody}>
                          <MetaText className={styles.label}>{article.label}</MetaText>
                          <CardTitle as="h2">{article.title}</CardTitle>
                          {article.excerpt ? (
                            <BodyText className={styles.excerpt}>{article.excerpt}</BodyText>
                          ) : null}
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
              {canSlide ? (
                <div className={styles.controls}>
                  <button type="button" className={styles.arrow} aria-label="Previous resources" onClick={() => step(-1)}>
                    <ArrowIcon direction="prev" />
                  </button>
                  <button type="button" className={styles.arrow} aria-label="Next resources" onClick={() => step(1)}>
                    <ArrowIcon direction="next" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className={styles.empty} role="status">
              No resources match that search. Try another keyword or category.
            </p>
          )}
        </div>
      </section>

      <ArticleListing
        articles={filtered}
        heading="All resources"
        description="Browse the full library of Kosick articles, guides, and marketing insights."
      />
    </>
  );
}
