"use client";

import { useId, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { eyebrowLabel } from "@/lib/eyebrow";
import { useSlidingPill } from "@/components/sections/useSlidingPill";
import styles from "./TelevisionExplorer.module.css";
import { TelevisionVisual, type TelevisionVisualKind } from "./TelevisionVisual";

export type TelevisionLineupItem = {
  id: string;
  label: string;
  /** A few words under the service name in the selector. */
  tagline: string;
  /** The published one-line description of the service. */
  summary: string;
  /** A second sentence that says what the service involves. */
  detail?: string;
  cta: { label: string; href: string } | null;
  visual: TelevisionVisualKind;
};

type TelevisionLineupProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
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

/**
 * Television services explorer: the four services on the left, and for the
 * chosen one a visual and a short explanation on the right. Every panel is
 * rendered in one grid cell, so switching never changes the section height.
 */
export function TelevisionLineup({ eyebrow, title, lead, items }: TelevisionLineupProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const { listRef, pillStyle, pillState } = useSlidingPill<HTMLDivElement>(active);
  if (items.length === 0) return null;

  const tabId = (index: number) => `${baseId}-tab-${items[index]?.id}`;
  const panelId = (index: number) => `${baseId}-panel-${items[index]?.id}`;

  function move(next: number) {
    const index = (next + items.length) % items.length;
    setActive(index);
    document.getElementById(tabId(index))?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    move(keys[event.key]);
  }

  const kicker = eyebrowLabel(eyebrow, title);

  return (
    <section className={`section ${styles.explorer}`} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        <header className={styles.intro}>
          {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
          <SectionTitle id={`${baseId}-title`} className={styles.title}>
            {title}
          </SectionTitle>
          {lead ? <SectionDescription className={styles.lead}>{lead}</SectionDescription> : null}
        </header>

        <div className={styles.layout}>
          <div
            ref={listRef}
            className={styles.list}
            role="tablist"
            aria-label="Television services"
            aria-orientation="vertical"
            data-pill={pillState}
            onKeyDown={onKeyDown}
          >
            <span className={styles.marker} style={pillStyle} aria-hidden="true" />
            {items.map((entry, index) => {
              const selected = index === active;
              return (
                <button
                  key={entry.id}
                  id={tabId(index)}
                  className={styles.tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId(index)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.tabIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.tabText}>
                    <span className={styles.tabLabel}>{entry.label}</span>
                    <span className={styles.tabTagline}>{entry.tagline}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className={styles.panels}>
            {items.map((entry, index) => {
              const selected = index === active;
              return (
                <div
                  key={entry.id}
                  id={panelId(index)}
                  className={styles.panel}
                  role="tabpanel"
                  aria-labelledby={tabId(index)}
                  data-active={selected}
                  inert={!selected}
                >
                  <div className={styles.monitor}>
                    <TelevisionVisual kind={entry.visual} label={entry.label} />
                  </div>
                  <div className={styles.copy}>
                    <h3 className={styles.copyTitle}>{entry.label}</h3>
                    {entry.summary ? <p className={styles.summary}>{entry.summary}</p> : null}
                    {entry.detail ? <p className={styles.detail}>{entry.detail}</p> : null}
                    {entry.cta ? (
                      <Link className={styles.link} href={entry.cta.href}>
                        {entry.cta.label}
                        <ArrowIcon />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
