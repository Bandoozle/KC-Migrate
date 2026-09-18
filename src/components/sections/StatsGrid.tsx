"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow, MetaText, SectionTitle } from "@/components/typography";
import type { ServiceStatsSection } from "@/lib/wordpress/service-page-types";
import styles from "./StatsGrid.module.css";

type StatsGridProps = {
  section: ServiceStatsSection;
};

function StatValue({
  end,
  prefix = "",
  suffix = "",
  duration = 2.5,
  play,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  play: boolean;
}) {
  const [value, setValue] = useState(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!play) return;
    if (reducedRef.current || duration <= 0) {
      setValue(end);
      return;
    }

    const started = performance.now();
    const durationMs = duration * 1000;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / durationMs);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(end * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setValue(end);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [play, end, duration]);

  return (
    <span className={styles.value} aria-hidden="true">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

export function StatsGrid({ section }: StatsGridProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  if (section.items.length === 0) return null;

  return (
    <section ref={rootRef} className={`section ${styles.section}`}>
      <div className="container">
        {section.eyebrow || section.title ? (
          <div className={styles.intro}>
            {section.eyebrow ? <Eyebrow className={styles.eyebrow}>{section.eyebrow}</Eyebrow> : null}
            {section.title ? (
              <SectionTitle as="h2" className={styles.heading}>
                {section.title}
              </SectionTitle>
            ) : null}
          </div>
        ) : null}

        <div className={styles.grid}>
          {section.items.map((item) => (
            <article key={item.label} className={styles.item}>
              <StatValue
                end={item.end}
                prefix={item.prefix}
                suffix={item.suffix}
                duration={item.duration}
                play={play}
              />
              <span className={styles.srOnly}>
                {item.prefix || ""}
                {item.end}
                {item.suffix || ""} {item.label}
              </span>
              <MetaText className={styles.label}>{item.label}</MetaText>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
