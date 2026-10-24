"use client";

import { useId, useState } from "react";
import { Eyebrow, SectionTitle } from "@/components/typography";
import styles from "./EmailMarketingPage.module.css";

export type CapabilityStage = {
  id: string;
  title: string;
  body: string;
  kind: "campaign" | "sequence" | "criteria" | "report";
  lines: string[];
  image: { src: string; alt: string } | null;
};

type EmailCapabilityStudioProps = {
  eyebrow?: string;
  title: string;
  stages: CapabilityStage[];
};

export function EmailCapabilityStudio({ eyebrow, title, stages }: EmailCapabilityStudioProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const stage = stages[active] ?? stages[0];
  if (!stage) return null;

  function move(next: number) {
    const count = stages.length;
    const index = (next + count) % count;
    setActive(index);
    document.getElementById(`${baseId}-tab-${stages[index]?.id}`)?.focus();
  }

  return (
    <section className={`section ${styles.studioSection}`} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <SectionTitle id={`${baseId}-title`}>{title}</SectionTitle>
        <div className={styles.studio}>
          <div
            className={styles.tablist}
            role="tablist"
            aria-label="Email marketing capabilities"
            onKeyDown={(event) => {
              if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                event.preventDefault();
                move(active + 1);
              } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                event.preventDefault();
                move(active - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                setActive(0);
              } else if (event.key === "End") {
                event.preventDefault();
                setActive(stages.length - 1);
              }
            }}
          >
            {stages.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  id={`${baseId}-tab-${item.id}`}
                  className={styles.tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          <div
            id={`${baseId}-panel`}
            className={`${styles.stage} ${stage.kind === "campaign" ? styles.stagePhoto : ""}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${stage.id}`}
          >
            {stage.kind === "campaign" && stage.image ? (
              <figure className={styles.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={stage.image.src} alt={stage.image.alt} />
                <figcaption>{stage.body}</figcaption>
              </figure>
            ) : null}

            {stage.kind === "sequence" ? (
              <div className={styles.stageCopy}>
                <p className={styles.stageBody}>{stage.body}</p>
                {stage.lines.length > 0 ? (
                  <ol className={styles.sequence}>
                    {stage.lines.map((line, index) => (
                      <li key={line}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}

            {stage.kind === "criteria" ? (
              <div className={styles.stageCopy}>
                <p className={styles.stageBody}>{stage.body}</p>
                {stage.lines.length > 0 ? (
                  <ol className={styles.criteria}>
                    {stage.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                ) : null}
              </div>
            ) : null}

            {stage.kind === "report" ? (
              <div className={styles.stageCopy}>
                <p className={styles.stageBody}>{stage.body}</p>
                {stage.lines.length > 0 ? (
                  <ul className={styles.reportLines}>
                    {stage.lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
