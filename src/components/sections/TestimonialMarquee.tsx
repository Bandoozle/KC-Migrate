"use client";

import { useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import styles from "./TestimonialMarquee.module.css";

export type TestimonialQuote = {
  quote: string;
  name: string;
  role?: string;
};

type TestimonialMarqueeProps = {
  items: TestimonialQuote[];
};

/**
 * Continuous quote strip. Renders nothing when there are no quotes,
 * so a page cannot show a fabricated testimonial.
 */
export function TestimonialMarquee({ items }: TestimonialMarqueeProps) {
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);

  if (items.length === 0) return null;

  const quotes = items.map((item) => (
    <figure key={`${item.name}-${item.quote.slice(0, 24)}`} className={styles.quote}>
      <blockquote>{item.quote}</blockquote>
      <figcaption>
        {item.name}
        {item.role ? <span>{item.role}</span> : null}
      </figcaption>
    </figure>
  ));

  return (
    <section className={styles.section} aria-label="Testimonials">
      <div className={styles.bar}>
        <div className={styles.viewport} data-paused={paused || undefined}>
          <div className={reduced ? styles.staticTrack : styles.track}>
            <div className={styles.group}>{quotes}</div>
            {reduced ? null : (
              <div className={styles.group} aria-hidden="true">
                {quotes}
              </div>
            )}
          </div>
        </div>
        {reduced ? null : (
          <button
            type="button"
            className={styles.pause}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Play quotes" : "Pause quotes"}
          </button>
        )}
      </div>
    </section>
  );
}
