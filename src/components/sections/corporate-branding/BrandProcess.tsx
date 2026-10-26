"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./BrandProcess.module.css";

export type BrandProcessStep = {
  number: string;
  title: string;
  body: string;
  image?: { src: string; alt: string; position?: string } | null;
  /** Typographic visual used when a step has no photograph. */
  inputs?: string[];
};

type BrandProcessProps = {
  steps: BrandProcessStep[];
  /** Section heading, set above the step list in the left column. */
  intro?: ReactNode;
};

export function BrandProcess({ steps, intro }: BrandProcessProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = steps.length - 1;

  function select(index: number, focus = false) {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = index === last ? 0 : index + 1;
    const prev = index === 0 ? last : index - 1;
    const keys: Record<string, number> = {
      ArrowDown: next,
      ArrowRight: next,
      ArrowUp: prev,
      ArrowLeft: prev,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  }

  return (
    <div className={styles.process}>
      <div className={styles.lead}>
        {intro}
        <div className={styles.rail} role="tablist" aria-label="Branding process" aria-orientation="vertical">
          {steps.map((step, index) => (
            <button
              key={step.number}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={index === active}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className={styles.tabNumber}>{step.number}</span>
              <span className={styles.tabTitle}>{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {steps.map((step, index) => (
        <div
          key={step.number}
          id={`${baseId}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          className={styles.panel}
          hidden={index !== active}
        >
          <div className={styles.visual}>
            {step.image ? (
              <Image
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(min-width: 960px) 52vw, 100vw"
                className={styles.image}
                style={step.image.position ? { objectPosition: step.image.position } : undefined}
              />
            ) : (
              <div className={styles.brief}>
                <p className={styles.briefLabel}>What we look at first</p>
                <ol className={styles.briefList}>
                  {(step.inputs ?? []).map((input, inputIndex) => (
                    <li key={input}>
                      <span>{String(inputIndex + 1).padStart(2, "0")}</span>
                      {input}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className={styles.copy}>
            <p className={styles.number} aria-hidden="true">
              {step.number}
            </p>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.body}>{step.body}</p>
            <div className={styles.nav}>
              <span className={styles.count}>
                Step {index + 1} of {steps.length}
              </span>
              <div className={styles.navButtons}>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => select(index === 0 ? last : index - 1)}
                  aria-label={`Previous step: ${steps[index === 0 ? last : index - 1].title}`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M11 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => select(index === last ? 0 : index + 1)}
                  aria-label={`Next step: ${steps[index === last ? 0 : index + 1].title}`}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
