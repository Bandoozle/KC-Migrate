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
      src: "/images/business-development/sales-siwash-rock.jpg",
      alt: "Siwash Rock standing alone in calm water off Stanley Park",
      position: "48% 42%",
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
      src: "/images/business-development/sales-english-bay.jpg",
      alt: "English Bay at low tide, with the West End towers across the water",
      position: "50% 35%",
    },
  },
  {
    name: "Transition",
    detail: "Handed to delivery, then grown.",
    work: ["Key account management", "A sales engine your people run long after the engagement ends"],
    milestone: "Handed to delivery, then grown",
    image: {
      src: "/images/business-development/sales-transition-sunset.jpg",
      alt: "The sun setting over English Bay, with freighters at anchor on the horizon",
      position: "50% 42%",
    },
  },
] as const;

/**
 * Corporate sales as a dark editorial sequence: stages develop the photograph
 * and the operating detail — not a tab strip on a stock presentation shot.
 */
export function SalesEngine() {
  const { ref, index, select } = useStepper<HTMLDivElement>(STAGES.length, {
    interval: 3400,
    threshold: 0.35,
  });
  const active = STAGES[index];

  return (
    <div ref={ref} className={styles.engine} data-accent="sales">
      <div className={styles.frame}>
        <figure className={styles.media}>
          {STAGES.map((stage, stageIndex) => (
            <div
              key={stage.name}
              className={styles.photo}
              data-active={stageIndex === index}
              aria-hidden={stageIndex !== index}
            >
              <Image
                src={stage.image.src}
                alt={stage.image.alt}
                fill
                sizes="(min-width: 900px) 58vw, 100vw"
                style={{ objectFit: "cover", objectPosition: stage.image.position }}
                priority={stageIndex === 0}
              />
            </div>
          ))}
          <div className={styles.milestone} aria-live="polite">
            <p className={styles.milestoneLabel}>Milestone</p>
            <p className={styles.milestoneText}>{active.milestone}</p>
          </div>
        </figure>

        <div className={styles.copy} id="bd-sales-panels" aria-live="polite">
          <p className={styles.phase}>Corporate sales · Stage {String(index + 1).padStart(2, "0")}</p>
          <h3 className={styles.title}>{active.name}</h3>
          <p className={styles.detail}>{active.detail}</p>
          <ul className={styles.work}>
            {active.work.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <nav className={styles.spine} aria-label="Sales stages">
          <ol className={styles.stages}>
            {STAGES.map((stage, stageIndex) => (
              <li key={stage.name}>
                <button
                  id={`bd-sales-stage-${stageIndex}`}
                  type="button"
                  className={styles.stage}
                  aria-current={stageIndex === index ? "step" : undefined}
                  onClick={() => select(stageIndex)}
                  onKeyDown={(event) =>
                    handleArrowKeys(event, stageIndex, STAGES.length, select, (next) => `bd-sales-stage-${next}`)
                  }
                >
                  <span className={styles.stageName}>{stage.name}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
