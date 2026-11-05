"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import type { HomeHeroRotation } from "@/lib/wordpress/home";
import styles from "./HomeHero.module.css";

const INTERVAL_MS = 2000;
const LETTER_FLIP_MS = 420;
const LETTER_STAGGER_MS = 30;

type HomeHeroRotatorProps = {
  rotations: HomeHeroRotation[];
};

function exitDuration(letterCount: number) {
  return LETTER_FLIP_MS + Math.max(0, letterCount - 1) * LETTER_STAGGER_MS;
}

function FlipLetters({
  text,
  motionClass,
}: {
  text: string;
  motionClass: string;
}) {
  return (
    <span className={styles.letters} aria-hidden="true">
      {text.split("").map((char, index) => (
        <span
          key={`${text}-${index}-${char}`}
          className={`${styles.letterCell} ${motionClass}`}
          style={
            {
              "--i": index,
              "--flip-ms": `${LETTER_FLIP_MS}ms`,
              "--stagger-ms": `${LETTER_STAGGER_MS}ms`,
            } as CSSProperties
          }
        >
          <span className={styles.letterFace}>{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}

export function HomeHeroRotator({ rotations }: HomeHeroRotatorProps) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);

  const active = rotations[index] ?? rotations[0];
  const longestWord = rotations.reduce(
    (longest, item) => (item.word.length > longest.length ? item.word : longest),
    rotations[0]?.word ?? "",
  );
  const longestSubtitle = rotations.reduce(
    (longest, item) => (item.subtitle.length > longest.length ? item.subtitle : longest),
    rotations[0]?.subtitle ?? "",
  );

  useEffect(() => {
    if (reduced || paused || rotations.length < 2) return;

    const hold = window.setTimeout(() => setLeaving(true), INTERVAL_MS);
    return () => window.clearTimeout(hold);
  }, [index, paused, reduced, rotations.length]);

  useEffect(() => {
    if (!leaving || !active) return;

    const swap = window.setTimeout(() => {
      setIndex((current) => (current + 1) % rotations.length);
      setLeaving(false);
    }, exitDuration(active.word.length));

    return () => window.clearTimeout(swap);
  }, [leaving, rotations.length, active]);

  if (!active) return null;

  const motionClass = reduced ? styles.motionOff : leaving ? styles.leaving : styles.entering;

  return (
    <div
      className={styles.rotator}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h1 className={styles.title}>
        <span className={styles.titlePrefix}>THE ART OF</span>
        <span className={styles.wordSlot} aria-live="polite" aria-atomic="true">
          <span className={styles.wordSizer} aria-hidden="true">
            {longestWord}
          </span>
          <span className={styles.word}>
            <span className={styles.srOnly}>{active.word}</span>
            <FlipLetters text={active.word} motionClass={motionClass} />
          </span>
        </span>
      </h1>
      <p className={styles.subtitleSlot} aria-live="polite" aria-atomic="true">
        <span className={styles.subtitleSizer} aria-hidden="true">
          {longestSubtitle}
        </span>
        <span className={styles.subtitle}>{active.subtitle}</span>
      </p>
    </div>
  );
}
