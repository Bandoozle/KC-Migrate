"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { eyebrowLabel } from "@/lib/eyebrow";
import styles from "./TelevisionAdvertisingPage.module.css";
import { TelevisionVisual, type TelevisionVisualKind } from "./TelevisionVisual";

export type TelevisionStill = {
  src: string;
  alt: string;
};

export type TelevisionLineupItem = {
  id: string;
  label: string;
  /** Short card sentence shown beside the preview. */
  summary: string;
  /** Supporting row below the stage. */
  title?: string;
  body?: string;
  bullets: string[];
  cta: { label: string; href: string } | null;
  visual: TelevisionVisualKind;
  still?: TelevisionStill | null;
};

type TelevisionLineupProps = {
  eyebrow?: string;
  title: string;
  items: TelevisionLineupItem[];
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function TelevisionLineup({ eyebrow, title, items }: TelevisionLineupProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;

  function move(next: number) {
    const index = (next + items.length) % items.length;
    setActive(index);
    document.getElementById(`${baseId}-tab-${items[index]?.id}`)?.focus();
  }

  const showSupport = Boolean(item.title || item.body || item.bullets.length > 0 || item.cta);
  const kicker = eyebrowLabel(eyebrow, title);

  return (
    <section className={`section ${styles.lineup}`} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
        <SectionTitle id={`${baseId}-title`} className={styles.lineupTitle}>
          {title}
        </SectionTitle>
        <div className={styles.stage}>
          <div
            className={styles.tuner}
            role="tablist"
            aria-label="Television services"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                event.preventDefault();
                move(active + 1);
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                event.preventDefault();
                move(active - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                move(0);
              } else if (event.key === "End") {
                event.preventDefault();
                move(items.length - 1);
              }
            }}
          >
            {items.map((entry, index) => {
              const selected = index === active;
              return (
                <button
                  key={entry.id}
                  id={`${baseId}-tab-${entry.id}`}
                  className={styles.channel}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.channelIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.channelLabel}>{entry.label}</span>
                </button>
              );
            })}
          </div>
          <div id={`${baseId}-panel`} className={styles.program} role="tabpanel" aria-labelledby={`${baseId}-tab-${item.id}`}>
            {item.summary ? (
              <SectionDescription className={styles.programSummary}>{item.summary}</SectionDescription>
            ) : null}
            <div className={styles.monitor}>
              <TelevisionVisual kind={item.visual} label={item.label} still={item.still} />
            </div>
            {showSupport ? (
              <div className={styles.support}>
                <div className={styles.supportHead}>
                  {item.title ? <h3 className={styles.programTitle}>{item.title}</h3> : null}
                  {item.cta ? (
                    <Link className={styles.solid} href={item.cta.href}>
                      {item.cta.label}
                      <ArrowIcon />
                    </Link>
                  ) : null}
                </div>
                <div className={styles.supportBody}>
                  {item.body ? <p className={styles.supportText}>{item.body}</p> : null}
                  {item.bullets.length > 0 ? (
                    <ul className={styles.points}>
                      {item.bullets.map((bullet, index) => (
                        <li key={bullet}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
