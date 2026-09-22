"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BodyText, SectionIntro } from "@/components/typography";
import type { ServiceProcessSection } from "@/lib/wordpress/service-page-types";
import styles from "./ProcessSteps.module.css";

type ProcessStepsProps = {
  section: ServiceProcessSection;
};

const BORDER_MS = 720;
const CONNECTOR_MS = 380;
const PAUSE_MS = 1600;
const BORDER_RADIUS = 12;
const BORDER_INSET = 0.75;

function formatStepNumber(value: string, index: number): string {
  const digits = value.replace(/\D/g, "");
  if (digits) return digits.padStart(2, "0");
  return String(index + 1).padStart(2, "0");
}

function cycleDurationMs(stepCount: number): number {
  if (stepCount <= 0) return PAUSE_MS;
  const borders = stepCount * BORDER_MS;
  const connectors = Math.max(0, stepCount - 1) * CONNECTOR_MS;
  return borders + connectors + PAUSE_MS;
}

/**
 * Rounded-rect outline whose path starts at the connector entry point:
 * - left-center for horizontal card rows
 * - top-center for vertical mobile stack
 * Drawn clockwise so stroke-dashoffset reveals from that point around the card.
 */
function cardOutlinePath(
  width: number,
  height: number,
  start: "left" | "top",
): string {
  const x = BORDER_INSET;
  const y = BORDER_INSET;
  const right = width - BORDER_INSET;
  const bottom = height - BORDER_INSET;
  const radius = Math.min(
    BORDER_RADIUS,
    (right - x) / 2,
    (bottom - y) / 2,
  );

  if (start === "top") {
    const midX = width / 2;
    return [
      `M ${midX} ${y}`,
      `L ${right - radius} ${y}`,
      `A ${radius} ${radius} 0 0 1 ${right} ${y + radius}`,
      `L ${right} ${bottom - radius}`,
      `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
      `L ${x + radius} ${bottom}`,
      `A ${radius} ${radius} 0 0 1 ${x} ${bottom - radius}`,
      `L ${x} ${y + radius}`,
      `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
      `L ${midX} ${y}`,
    ].join(" ");
  }

  const midY = height / 2;
  return [
    `M ${x} ${midY}`,
    `L ${x} ${y + radius}`,
    `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}`,
    `L ${right - radius} ${y}`,
    `A ${radius} ${radius} 0 0 1 ${right} ${y + radius}`,
    `L ${right} ${bottom - radius}`,
    `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom}`,
    `L ${x + radius} ${bottom}`,
    `A ${radius} ${radius} 0 0 1 ${x} ${bottom - radius}`,
    `L ${x} ${midY}`,
  ].join(" ");
}

function ProcessCard({
  number,
  title,
  body,
  index,
  cycle,
  playing,
  reduced,
}: {
  number: string;
  title: string;
  body?: string;
  index: number;
  cycle: number;
  playing: boolean;
  reduced: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [verticalStack, setVerticalStack] = useState(false);
  const delay = index * (BORDER_MS + CONNECTOR_MS);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const sync = () => setVerticalStack(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const outline =
    size.w > 0 && size.h > 0
      ? cardOutlinePath(size.w, size.h, verticalStack ? "top" : "left")
      : "";

  return (
    <article
      ref={cardRef}
      className={styles.card}
      style={
        {
          "--draw-delay": reduced ? "0ms" : `${delay}ms`,
          "--draw-duration": reduced ? "0ms" : `${BORDER_MS}ms`,
        } as CSSProperties
      }
      data-playing={playing ? "true" : "false"}
      data-reduced={reduced ? "true" : "false"}
    >
      {outline ? (
        <svg
          key={`border-${cycle}-${verticalStack ? "v" : "h"}`}
          className={styles.borderSvg}
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          aria-hidden="true"
        >
          <path className={styles.borderTrack} d={outline} pathLength={100} />
          <path className={styles.borderStroke} d={outline} pathLength={100} />
        </svg>
      ) : null}

      <div className={styles.cardInner}>
        <span className={styles.number}>{number}</span>
        <h3 className={`card-title ${styles.title}`}>{title}</h3>
        {body ? <BodyText className={styles.body}>{body}</BodyText> : null}
      </div>
    </article>
  );
}

function ProcessConnector({
  index,
  cycle,
  playing,
  reduced,
}: {
  index: number;
  cycle: number;
  playing: boolean;
  reduced: boolean;
}) {
  const delay = index * (BORDER_MS + CONNECTOR_MS) + BORDER_MS;

  return (
    <div
      className={styles.connector}
      aria-hidden="true"
      data-playing={playing ? "true" : "false"}
      data-reduced={reduced ? "true" : "false"}
      style={
        {
          "--draw-delay": reduced ? "0ms" : `${delay}ms`,
          "--draw-duration": reduced ? "0ms" : `${CONNECTOR_MS}ms`,
        } as CSSProperties
      }
    >
      <span key={`connector-${cycle}`} className={styles.connectorLine} />
    </div>
  );
}

export function ProcessSteps({ section }: ProcessStepsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [reduced, setReduced] = useState(false);
  const stepCount = section.steps.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      setPlaying(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (!playing || reduced || stepCount === 0) return;

    const duration = cycleDurationMs(stepCount);
    const timeout = window.setTimeout(() => {
      setCycle((current) => current + 1);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [playing, reduced, stepCount, cycle]);

  if (stepCount === 0) return null;

  return (
    <section ref={rootRef} className={`section ${styles.section}`}>
      <div className="container">
        <SectionIntro
          align="center"
          title={section.title?.trim() || "Our Process"}
          description="See how we turn strategy into measurable results."
        />

        <ol className={styles.track}>
          {section.steps.map((step, index) => {
            const isLast = index === stepCount - 1;
            return (
              <li key={`${step.number}-${step.title}-${index}`} className={styles.step}>
                <ProcessCard
                  number={formatStepNumber(step.number, index)}
                  title={step.title}
                  body={step.body}
                  index={index}
                  cycle={cycle}
                  playing={playing}
                  reduced={reduced}
                />
                {!isLast ? (
                  <ProcessConnector
                    index={index}
                    cycle={cycle}
                    playing={playing}
                    reduced={reduced}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
