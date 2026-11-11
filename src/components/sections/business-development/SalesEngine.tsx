"use client";

import Image from "next/image";
import { handleArrowKeys, useStepper } from "./bd-motion";
import styles from "./SalesEngine.module.css";

const UPLOADS = "/wp-content/uploads";

const STAGES = [
  {
    name: "Position",
    detail: "Offer, pricing and target accounts.",
    work: ["Enterprise account strategy", "Channel partner programs & distribution strategy"],
    milestone: "Offer and target accounts set",
    image: {
      src: `${UPLOADS}/2023/06/vancouver-agency.jpg`,
      alt: "Vancouver waterfront and skyline across False Creek at sunset",
      position: "50% 42%",
    },
  },
  {
    name: "Qualify",
    detail: "Pipeline built and scored in the CRM.",
    work: ["B2B pipeline architecture & CRM implementation", "Lead generation, qualification and outreach cadences"],
    milestone: "Scored in the CRM",
    image: {
      src: `${UPLOADS}/2024/10/corporate-events.webp`,
      alt: "An audience listening to speakers at a corporate presentation",
      position: "62% 45%",
    },
  },
  {
    name: "Negotiate",
    detail: "Proposals and terms structured to win.",
    work: ["Proposal development & RFP response optimization", "Sales team coaching on live opportunities"],
    milestone: "Proposal and terms structured",
    image: {
      src: `${UPLOADS}/2025/08/IMG_2596-scaled.jpg`,
      alt: "A speaker addressing an audience from a lit stage",
      position: "55% 40%",
    },
  },
  {
    name: "Close",
    detail: "High-value deals over the line.",
    work: ["Sales team training, coaching & performance systems", "Pipeline reporting your team can act on"],
    milestone: "Over the line",
    image: {
      src: "/images/business-development/legal-heritage-building-flag.jpg",
      alt: "Ivy-covered heritage building with a Canadian flag against a clear sky",
      position: "50% 35%",
    },
  },
  {
    name: "Transition",
    detail: "Handed to delivery, then grown.",
    work: ["Key account management", "A sales engine your people run long after the engagement ends"],
    milestone: "Handed to delivery, then grown",
    image: {
      src: `${UPLOADS}/2023/06/real-estate.jpeg`,
      alt: "A bright living room opening onto a calm waterfront view",
      position: "55% 48%",
    },
  },
] as const;

/**
 * Five stages of a sale, told as an editorial feature: a stage index, a
 * photograph that shifts with the selection, and the stage written large.
 * Plays once when it comes into view; choosing a stage takes over.
 */
export function SalesEngine() {
  const { ref, index, select } = useStepper<HTMLDivElement>(STAGES.length, { interval: 3200, threshold: 0.4 });

  return (
    <div ref={ref} className={styles.engine} data-accent="sales">
      <nav className={styles.index} aria-label="Sales stages">
        <ol className={styles.stages}>
          {STAGES.map((stage, stageIndex) => (
            <li key={stage.name}>
              <button
                id={`bd-sales-stage-${stageIndex}`}
                type="button"
                className={styles.stage}
                aria-current={stageIndex === index ? "step" : undefined}
                aria-controls="bd-sales-panels"
                onClick={() => select(stageIndex)}
                onKeyDown={(event) =>
                  handleArrowKeys(event, stageIndex, STAGES.length, select, (next) => `bd-sales-stage-${next}`)
                }
              >
                {stage.name}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.spread}>
        <div className={styles.media} aria-hidden="true">
          {STAGES.map((stage, stageIndex) => (
            <div key={stage.name} className={styles.photo} data-active={stageIndex === index}>
              <Image
                src={stage.image.src}
                alt=""
                fill
                sizes="(min-width: 900px) 48vw, 100vw"
                style={{ objectFit: "cover", objectPosition: stage.image.position }}
                priority={stageIndex === 0}
              />
            </div>
          ))}
        </div>

        <div id="bd-sales-panels" className={styles.panels} aria-live="polite">
          {STAGES.map((stage, stageIndex) => {
            const open = stageIndex === index;
            return (
              <article key={stage.name} className={styles.panel} data-active={open} aria-hidden={!open}>
                <p className={styles.mark}>
                  {String(stageIndex + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}
                </p>
                <h3 className={styles.title}>{stage.name}</h3>
                <p className={styles.detail}>{stage.detail}</p>
                <div className={styles.work}>
                  {stage.work.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className={styles.outcome}>{stage.milestone}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
