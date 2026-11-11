"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { TV_JOURNEY } from "@/content/television-page";
import { handleArrowKeys } from "@/components/sections/business-development/bd-motion";
import styles from "./TelevisionJourney.module.css";

const STAGE_FRAMES = [
  "/images/television/trane-poster.png",
  "/images/television/spot-interface.png",
  "/images/television/spot-scene.png",
  "/images/television/spot-title.png",
  "/images/television/spot-end.png",
];

export function TelevisionJourney() {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const stage = TV_JOURNEY.stages[index];
  const frame = STAGE_FRAMES[index] ?? STAGE_FRAMES[0];

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <div className={`container ${styles.inner}`}>
        <header className={styles.intro}>
          <h2 id={`${baseId}-title`} className={styles.title}>
            {TV_JOURNEY.title}
          </h2>
          <p className={styles.lead}>{TV_JOURNEY.lead}</p>
        </header>

        <div className={styles.layout}>
          <ol className={styles.rail} aria-label="Campaign process">
            {TV_JOURNEY.stages.map((item, itemIndex) => {
              const state =
                itemIndex < index ? "done" : itemIndex === index ? "active" : "next";
              return (
                <li key={item.id} className={styles.step} data-state={state}>
                  <button
                    id={`${baseId}-step-${item.id}`}
                    type="button"
                    className={styles.stepButton}
                    aria-pressed={itemIndex === index}
                    onClick={() => setIndex(itemIndex)}
                    onKeyDown={(event) =>
                      handleArrowKeys(
                        event,
                        itemIndex,
                        TV_JOURNEY.stages.length,
                        setIndex,
                        (next) => `${baseId}-step-${TV_JOURNEY.stages[next].id}`,
                      )
                    }
                  >
                    <span className={styles.num} aria-hidden="true">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.stepLabel}>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={styles.detail} aria-live="polite">
            <div className={styles.frame}>
              <Image
                key={frame}
                src={frame}
                alt=""
                fill
                sizes="(max-width: 899px) 100vw, 48vw"
                className={styles.frameImage}
              />
            </div>
            <div className={styles.copy}>
              <p className={styles.stageIndex}>
                Stage {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.stageTitle}>{stage.title}</h3>
              <p className={styles.stageBody}>{stage.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
