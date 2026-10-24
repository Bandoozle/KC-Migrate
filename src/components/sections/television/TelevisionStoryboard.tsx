"use client";

import { useId, useState } from "react";
import styles from "./TelevisionAdvertisingPage.module.css";
import {
  PRODUCTION_CAPTIONS,
  TelevisionProductionVisual,
  type TelevisionNetworkGroup,
  type TelevisionProductionVisualKind,
} from "./TelevisionProductionVisual";

export type TelevisionFrame = {
  src: string;
  alt: string;
  /** On-screen text that appears over this shot in the finished spot. */
  super?: string;
};

export type TelevisionProductionStep = {
  id: string;
  label: string;
  title: string;
  body?: string;
  detail?: string;
  visual: TelevisionProductionVisualKind;
};

type TelevisionStoryboardProps = {
  title: string;
  body?: string;
  steps: TelevisionProductionStep[];
  frames: TelevisionFrame[];
  footage: TelevisionFrame[];
  networks: TelevisionNetworkGroup[];
};

const stepNumber = (index: number) => String(index + 1).padStart(2, "0");

export function TelevisionStoryboard({ title, body, steps, frames, footage, networks }: TelevisionStoryboardProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const interactive =
    steps.length > 1 &&
    steps.every((step) => step.body) &&
    steps.every((step) => step.visual !== "networks" || networks.some((group) => group.names.length > 0));
  const current = steps[active] ?? steps[0];

  function move(next: number) {
    const index = (next + steps.length) % steps.length;
    setActive(index);
    document.getElementById(`${baseId}-tab-${steps[index]?.id}`)?.focus();
  }

  const heading = (
    <div className={styles.storyCopy}>
      <h2 id={`${baseId}-title`} className={styles.storyTitle}>
        {title}
      </h2>
      {body ? <p className={styles.storyBody}>{body}</p> : null}
    </div>
  );

  if (!interactive || !current) {
    return (
      <section className={`section ${styles.story}`} aria-labelledby={`${baseId}-title`}>
        <div className={`container ${styles.storyLayout}`}>
          {heading}
          <figure className={styles.storyScreen}>
            <div className={styles.storyMonitor}>
              <TelevisionProductionVisual kind="footage" frames={frames} footage={footage} networks={networks} />
            </div>
            <figcaption>{PRODUCTION_CAPTIONS.footage}</figcaption>
          </figure>
          <ol className={`${styles.frames} ${styles.timeline}`} aria-label="Commercial production steps">
            {steps.map((step, index) => (
              <li key={step.id} className={styles.frame}>
                <span>{stepNumber(index)}</span>
                <span>{step.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${styles.story}`} aria-labelledby={`${baseId}-title`}>
      <div className={`container ${styles.storyLayout}`}>
        {heading}
        <div
          className={styles.frames}
          role="tablist"
          aria-label="Commercial production steps"
          onKeyDown={(event) => {
            const keys: Record<string, number> = {
              ArrowRight: active + 1,
              ArrowDown: active + 1,
              ArrowLeft: active - 1,
              ArrowUp: active - 1,
              Home: 0,
              End: steps.length - 1,
            };
            if (event.key in keys) {
              event.preventDefault();
              move(keys[event.key]);
            }
          }}
        >
          {steps.map((step, index) => {
            const selected = index === active;
            return (
              <button
                key={step.id}
                id={`${baseId}-tab-${step.id}`}
                type="button"
                role="tab"
                className={styles.frame}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${step.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
              >
                <span>{stepNumber(index)}</span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
        <figure className={styles.storyScreen}>
          <div className={styles.storyMonitor} key={current.id}>
            <TelevisionProductionVisual kind={current.visual} frames={frames} footage={footage} networks={networks} />
          </div>
          <figcaption>{PRODUCTION_CAPTIONS[current.visual]}</figcaption>
        </figure>
        <div className={styles.storyDetails}>
          {steps.map((step, index) => {
            const selected = index === active;
            return (
              <div
                key={step.id}
                id={`${baseId}-panel-${step.id}`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${step.id}`}
                className={styles.storyDetail}
                data-active={selected}
                inert={!selected}
              >
                <p className={styles.storyStepIndex}>
                  Step {stepNumber(index)} of {stepNumber(steps.length - 1)}
                </p>
                <h3 className={styles.storyStepTitle}>{step.title}</h3>
                <p className={styles.storyStepBody}>{step.body}</p>
                {step.detail ? <p className={styles.storyStepDetail}>{step.detail}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
