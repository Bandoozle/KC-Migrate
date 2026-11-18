"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReelPlayer, type Reel } from "@/components/media/ReelPlayer";
import { SectionTitle } from "@/components/typography";
import "@/styles/industry-themes.css";
import styles from "./FeaturedReels.module.css";

type FeaturedReelsProps = {
  headingId: string;
  label: string;
  title: string;
  lead: string;
  reels: Reel[];
};

type ScrollState = { start: number; size: number; canPrev: boolean; canNext: boolean };

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

/**
 * Featured work on an industry page: a showcase of vertical reels. The heading stacks label, title and lead at
 * full width like the other sections. Each reel plays in its own 9:16 frame, one at a time; starting another
 * stops the first. The strip scrolls sideways and snaps, with a progress track and arrows beneath it, and keeps
 * working while a reel plays.
 */
export function FeaturedReels({ headingId, label, title, lead, reels }: FeaturedReelsProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scroll, setScroll] = useState<ScrollState>({ start: 0, size: 1, canPrev: false, canNext: true });

  const update = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const size = max <= 0 ? 1 : rail.clientWidth / rail.scrollWidth;
    const start = max <= 0 ? 0 : (rail.scrollLeft / max) * (1 - size);
    setScroll({ start, size, canPrev: rail.scrollLeft > 4, canNext: rail.scrollLeft < max - 4 });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    update();
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  function scrollByCards(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 12;
    const step = (card?.getBoundingClientRect().width ?? 240) + gap;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * step * 2, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.label}>{label}</p>
          <SectionTitle id={headingId} className={styles.title}>
            {title}
          </SectionTitle>
          <p className={styles.lead}>{lead}</p>
        </div>

        <ul ref={railRef} className={styles.rail} aria-label={`${title} reels`} tabIndex={0}>
          {reels.map((reel) => (
            <li key={reel.id} className={styles.card}>
              <ReelPlayer
                reel={reel}
                sizes="(min-width: 1100px) 300px, (min-width: 640px) 25vw, 62vw"
                playing={activeId === reel.id}
                onPlay={setActiveId}
              />
            </li>
          ))}
        </ul>

        <div className={styles.controls}>
          <div className={styles.track} aria-hidden="true">
            <span className={styles.thumb} style={{ left: `${scroll.start * 100}%`, width: `${scroll.size * 100}%` }} />
          </div>
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCards(-1)}
              disabled={!scroll.canPrev}
              aria-label="Previous reels"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => scrollByCards(1)}
              disabled={!scroll.canNext}
              aria-label="Next reels"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
