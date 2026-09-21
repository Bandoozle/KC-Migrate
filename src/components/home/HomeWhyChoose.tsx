"use client";

import { useEffect, useRef, useState } from "react";
import { SectionDescription, SectionTitle } from "@/components/typography";
import type { HomeCapabilityIcon, HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeWhyChoose.module.css";

type HomeWhyChooseProps = {
  content: HomePageContent["whyChoose"];
};

function CapabilityIcon({ kind }: { kind: HomeCapabilityIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (kind) {
    case "strategy":
      return (
        <svg {...common}>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
        </svg>
      );
    case "web":
      return (
        <svg {...common}>
          <polyline points="8 6 2 12 8 18" />
          <polyline points="16 6 22 12 16 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case "ai":
      return (
        <svg {...common}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      );
    case "crm":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "marketing":
      return (
        <svg {...common}>
          <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" />
          <path d="M16 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a8 8 0 0 1 0 12" />
        </svg>
      );
    case "seo":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="4" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="20" y1="20" x2="20" y2="14" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
      );
  }
}

function MetricValue({
  end,
  suffix,
  duration,
  play,
}: {
  end: number;
  suffix: string;
  duration: number;
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
    <span className={styles.metricValue} aria-hidden="true">
      {value}
      {suffix}
    </span>
  );
}

export function HomeWhyChoose({ content }: HomeWhyChooseProps) {
  const metricsRef = useRef<HTMLDivElement>(null);
  const [playMetrics, setPlayMetrics] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const root = metricsRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setPlayMetrics(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const capabilityItems = [...content.capabilities, ...content.capabilities];

  return (
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby="home-why-title">
      <div className={styles.layout}>
        <div className={styles.left}>
          <SectionTitle id="home-why-title">{content.title}</SectionTitle>
          <SectionDescription className={styles.lead}>{content.lead}</SectionDescription>

          <div className={styles.metrics} ref={metricsRef}>
            {content.metrics.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <span className="screen-reader-text">
                  {metric.end}
                  {metric.suffix} {metric.label}
                </span>
                <MetricValue
                  end={metric.end}
                  suffix={metric.suffix}
                  duration={metric.duration}
                  play={playMetrics}
                />
                <span className={styles.metricLabel}>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tiles}>
          {content.tiles.map((tile) => (
            <div key={`${tile.line1}-${tile.line2}`} className={styles.tile}>
              <span>{tile.line1}</span>
              <span>{tile.line2}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.capabilities}>
        <p className={styles.capabilitiesLead}>{content.capabilitiesLead}</p>
        <div className={styles.capabilitiesViewport}>
          <div
            className={`${styles.capabilitiesTrack} ${reduceMotion ? styles.capabilitiesStatic : ""}`}
          >
            {capabilityItems.map((item, index) => (
              <span key={`${item.label}-${index}`} className={styles.capabilityItem}>
                <CapabilityIcon kind={item.icon} />
                <span className={styles.capabilityLabel}>{item.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
