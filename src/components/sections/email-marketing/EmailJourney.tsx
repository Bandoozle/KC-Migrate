"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { eyebrowLabel } from "@/lib/eyebrow";
import styles from "./EmailMarketingPage.module.css";

type EmailJourneyProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  steps: string[];
  cta: { label: string; href: string } | null;
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

export function EmailJourney({ eyebrow, title, body, steps, cta }: EmailJourneyProps) {
  const baseId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  function stop() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function choose(index: number) {
    stop();
    setActive(index);
  }

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || steps.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let step = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || timerRef.current) return;
        timerRef.current = window.setInterval(() => {
          step += 1;
          if (step >= steps.length) {
            stop();
            return;
          }
          setActive(step);
        }, 1700);
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [steps.length]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    event.preventDefault();
    const last = steps.length - 1;
    const nextIndex =
      event.key === "Home" ? 0 : event.key === "End" ? last : event.key === "ArrowRight" ? active + 1 : active - 1;
    const next = (nextIndex + steps.length) % steps.length;
    choose(next);
    document.getElementById(`${baseId}-step-${next}`)?.focus();
  }

  const kicker = eyebrowLabel(eyebrow, title);

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.journey}`}
      aria-labelledby={`${baseId}-title`}
      onPointerDown={stop}
      onFocusCapture={stop}
    >
      <div className="container">
        <div className={styles.journeyIntro}>
          {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
          <h2 id={`${baseId}-title`} className={styles.journeyTitle}>
            {title}
          </h2>
          {body ? <p className={styles.journeyBody}>{body}</p> : null}
        </div>
        <div
          className={styles.steps}
          role="group"
          aria-label="Customer journey"
          onKeyDown={onKeyDown}
        >
          {steps.map((step, index) => {
            const selected = index === active;
            return (
              <button
                key={step}
                id={`${baseId}-step-${index}`}
                type="button"
                className={styles.step}
                aria-pressed={selected}
                onClick={() => choose(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </button>
            );
          })}
        </div>
        {cta ? (
          <Link className={styles.ghost} href={cta.href}>
            {cta.label}
            <ArrowIcon />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
