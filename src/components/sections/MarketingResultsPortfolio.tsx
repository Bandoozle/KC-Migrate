"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import {
  MARKETING_SOLUTIONS,
  arrangeMarketingResults,
  solutionLabel,
  splitMarketingResults,
  type MarketingResultWork,
  type MarketingSolutionId,
  type WorkFrame,
} from "@/lib/content/marketing-results-work";
import { labelCase } from "@/lib/eyebrow";
import styles from "./MarketingResultsPortfolio.module.css";

const INITIAL_COUNT = 6;

type FilterId = MarketingSolutionId | "all";

function ProjectPhoto({
  item,
  className,
  sizes,
  priority = false,
}: {
  item: MarketingResultWork;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={className}>
      <Image
        src={item.image.src}
        alt={item.image.alt || item.displayTitle}
        fill
        sizes={sizes}
        priority={priority}
        quality={85}
        className={styles.photo}
        style={{ objectPosition: item.imagePosition }}
      />
    </div>
  );
}

function ProjectCopy({ item }: { item: MarketingResultWork }) {
  return (
    <div className={styles.copy}>
      <p className={styles.kicker}>{labelCase(solutionLabel(item))}</p>
      <h3 className={styles.title}>{item.displayTitle}</h3>
      <p className={styles.summary}>{item.summary}</p>
      {item.href ? (
        <Link href={item.href} className={styles.discuss}>
          Discuss this work
        </Link>
      ) : null}
    </div>
  );
}

function collectionRows(items: Array<{ item: MarketingResultWork; frame: WorkFrame }>) {
  const rows: Array<{ reversed: boolean; items: typeof items }> = [];
  for (let index = 0; index < items.length; index += 2) {
    const pair = items.slice(index, index + 2);
    rows.push({
      reversed: pair.length === 2 && (index / 2) % 2 === 1,
      items: pair,
    });
  }
  return rows;
}

export function MarketingResultsPortfolio({ work }: { work: MarketingResultWork[] }) {
  const reduced = usePrefersReducedMotion();
  const { featured, collection } = useMemo(() => splitMarketingResults(work), [work]);
  const [filter, setFilter] = useState<FilterId>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const usedSolutions = MARKETING_SOLUTIONS.filter((solution) =>
    collection.some((item) => item.solutions.includes(solution.id)),
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? collection
        : collection.filter((item) => item.solutions.includes(filter)),
    [collection, filter],
  );

  const arranged = useMemo(() => arrangeMarketingResults(filtered), [filtered]);
  const visible = arranged.slice(0, visibleCount);
  const hiddenCount = arranged.length - visible.length;

  const selectFilter = (next: FilterId) => {
    setFilter(next);
    setVisibleCount(INITIAL_COUNT);
  };

  if (featured.length === 0) return null;

  return (
    <div className={reduced ? styles.reduced : undefined}>
      <section className={styles.stageSection} aria-labelledby="featured-work-heading">
        <div className={styles.rail}>
          <h2 id="featured-work-heading" className={styles.srOnly}>
            Featured work
          </h2>
          <div className={styles.stage}>
            {featured.map((item, index) => (
              <article key={item.id} className={styles.panel} data-project={item.id}>
                <ProjectPhoto
                  item={item}
                  className={styles.panelMedia}
                  sizes="(max-width: 767px) 100vw, (max-width: 1179px) 50vw, 34vw"
                  priority={index === 0}
                />
                <ProjectCopy item={item} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.collectionSection}`} aria-labelledby="collection-heading">
        <div className={styles.rail}>
          <div className={styles.collectionHead}>
            <div>
              <h2 id="collection-heading" className={styles.collectionTitle}>
                The collection
              </h2>
              <p className={styles.collectionMeta}>
                {filter === "all"
                  ? `${collection.length} more projects`
                  : `${filtered.length} projects`}
              </p>
            </div>
            <div className={styles.filters} role="toolbar" aria-label="Filter projects by solution">
              <button
                type="button"
                className={filter === "all" ? styles.filterActive : styles.filter}
                aria-pressed={filter === "all"}
                onClick={() => selectFilter("all")}
              >
                All
              </button>
              {usedSolutions.map((solution) => (
                <button
                  key={solution.id}
                  type="button"
                  className={filter === solution.id ? styles.filterActive : styles.filter}
                  aria-pressed={filter === solution.id}
                  onClick={() => selectFilter(solution.id)}
                >
                  {solution.short}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mosaic} aria-live="polite">
            {collectionRows(visible).map((row) => (
              <div
                key={row.items[0].item.id}
                className={row.reversed ? styles.rowReverse : styles.rowForward}
              >
                {row.items.map(({ item }, cardIndex) => {
                  const wide = row.reversed ? cardIndex === 1 : cardIndex === 0;
                  const media = (
                    <ProjectPhoto
                      item={item}
                      className={styles.tileMedia}
                      sizes={wide ? "(max-width: 767px) 100vw, 62vw" : "(max-width: 767px) 100vw, 34vw"}
                    />
                  );
                  const caption = (
                    <div className={styles.tileCopy}>
                      <p className={styles.tileKicker}>{labelCase(solutionLabel(item))}</p>
                      <h3 className={styles.tileTitle}>{item.displayTitle}</h3>
                      <p className={styles.tileSummary}>{item.summary}</p>
                    </div>
                  );
                  const card = (
                    <>
                      {media}
                      {caption}
                    </>
                  );

                  return (
                    <article key={item.id} className={styles.tile} data-project={item.id}>
                      {item.href ? (
                        <Link href={item.href} className={styles.tileLink}>
                          {card}
                        </Link>
                      ) : (
                        <div className={styles.tileLink}>{card}</div>
                      )}
                    </article>
                  );
                })}
              </div>
            ))}
          </div>

          {hiddenCount > 0 ? (
            <button type="button" className={styles.more} onClick={() => setVisibleCount(arranged.length)}>
              Load more
              <span className={styles.moreCount}>{hiddenCount} remaining</span>
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
