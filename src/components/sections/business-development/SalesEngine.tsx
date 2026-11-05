"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import styles from "./SalesEngine.module.css";

const STEP_MS = 2800;

const STAGES = [
  {
    name: "Position",
    detail: "Offer, pricing and target accounts.",
    work: ["Enterprise account strategy", "Channel partner programs & distribution strategy"],
  },
  {
    name: "Qualify",
    detail: "Pipeline built and scored in the CRM.",
    work: ["B2B pipeline architecture & CRM implementation", "Lead generation, qualification and outreach cadences"],
  },
  {
    name: "Negotiate",
    detail: "Proposals and terms structured to win.",
    work: ["Proposal development & RFP response optimization", "Sales team coaching on live opportunities"],
  },
  {
    name: "Close",
    detail: "High-value deals over the line.",
    work: ["Sales team training, coaching & performance systems", "Pipeline reporting your team can act on"],
  },
  {
    name: "Transition",
    detail: "Handed to delivery, then grown.",
    work: ["Key account management", "A sales engine your people run long after the engagement ends"],
  },
];

const BARS = [100, 80, 60, 42, 26];
const last = STAGES.length - 1;
const subscribeNever = () => () => {};

/**
 * Five stages on one line. It walks through them once when first seen, then
 * waits for the visitor; choosing a stage takes over. Before hydration, and with
 * reduced motion, the first stage is simply selected and nothing moves.
 */
export function SalesEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const chosen = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        if (!chosen.current) setPlaying(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setTimeout(() => {
      const next = Math.min(stage + 1, last);
      setStage(next);
      if (next === last) setPlaying(false);
    }, STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, reduced, stage]);

  function choose(index: number) {
    chosen.current = true;
    setPlaying(false);
    setStage(index);
  }

  const shown = hydrated ? stage : 0;

  return (
    <div ref={ref} className={styles.engine}>
      <div className={styles.railWrap}>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.trackFill} style={{ transform: `scaleX(${shown / last})` }} />
        </span>
        <ol className={styles.rail}>
        {STAGES.map((item, index) => (
          <li key={item.name} className={styles.railItem}>
            <button
              type="button"
              className={styles.node}
              aria-current={index === shown ? "step" : undefined}
              data-state={index < shown ? "done" : index === shown ? "active" : "next"}
              onClick={() => choose(index)}
            >
              <span className={styles.dot} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.nodeName}>{item.name}</span>
            </button>
          </li>
        ))}
        </ol>
      </div>

      <div className={styles.board}>
        <div className={styles.panels}>
          {STAGES.map((item, index) => (
            <div key={item.name} className={styles.panel} data-active={index === shown} aria-hidden={index !== shown}>
              <h3 className={styles.panelTitle}>{item.name}</h3>
              <p className={styles.panelDetail}>{item.detail}</p>
              <ul className={styles.work}>
                {item.work.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.funnel} aria-hidden="true">
          {STAGES.map((item, index) => (
            <span
              key={item.name}
              className={styles.bar}
              data-state={index < shown ? "done" : index === shown ? "active" : "next"}
              style={{ width: `${BARS[index]}%` }}
            >
              <span>{item.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
