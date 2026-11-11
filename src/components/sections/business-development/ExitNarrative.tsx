"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { handleArrowKeys, useStepper } from "./bd-motion";
import styles from "./ExitNarrative.module.css";

const EXIT_PATH = [
  { name: "Build value", detail: "Valuation and benchmarks set the baseline." },
  { name: "Reduce owner dependence", detail: "Leadership and systems that run without you." },
  { name: "Prepare", detail: "Due diligence and the data room ready." },
  { name: "Position", detail: "Buyers, investors or successors identified." },
  { name: "Transition", detail: "A clean, well-timed handover." },
];

/**
 * Exit, told over one photograph: the path from years ahead to handover runs
 * along the bottom, and the view moves a little closer to the horizon at each
 * step. `children` is the section's heading block.
 */
export function ExitNarrative({ children }: { children: ReactNode }) {
  const { ref, index, select } = useStepper<HTMLDivElement>(EXIT_PATH.length, { interval: 2800, threshold: 0.35 });

  return (
    <div ref={ref} className={styles.exit} style={{ "--stage": index } as CSSProperties}>
      <div className={styles.media} aria-hidden="true">
        <div className={styles.image}>
          <Image
            src="/images/business-development/exit-harbour-sunset.jpg"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "45% 55%" }}
          />
        </div>
        <div className={styles.shade} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>{children}</div>

        <div className={styles.path}>
          <div className={styles.ends} aria-hidden="true">
            <span>Years ahead</span>
            <span>Handover</span>
          </div>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.trackFill} style={{ transform: `scaleX(${(index + 1) / EXIT_PATH.length})` }} />
          </span>
          <ol className={styles.steps}>
            {EXIT_PATH.map((step, stepIndex) => (
              <li key={step.name} className={styles.step} data-state={stepIndex < index ? "done" : stepIndex === index ? "active" : "next"}>
                <button
                  id={`bd-exit-step-${stepIndex}`}
                  type="button"
                  className={styles.stepButton}
                  aria-pressed={stepIndex === index}
                  onClick={() => select(stepIndex)}
                  onKeyDown={(event) => handleArrowKeys(event, stepIndex, EXIT_PATH.length, select, (next) => `bd-exit-step-${next}`)}
                >
                  <span className={styles.stepName}>{step.name}</span>
                  <span className={styles.stepDetail}>{step.detail}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
