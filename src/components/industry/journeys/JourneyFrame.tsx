"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { SectionDescription, SectionTitle } from "@/components/typography";
import type { IndustryId } from "@/lib/industries/types";
import "@/styles/industry-themes.css";
import styles from "./JourneyFrame.module.css";

const STEP_MS = 3200;
/** The finished state gets a longer look before the journey starts again. */
const LAST_STEP_MS = 4500;
/** After a tap, the chosen step stays long enough to read before the loop carries on. */
const TAP_HOLD_MS = 8000;

const subscribeNever = () => () => {};

/** Reveal a part of a scene from step `n` onward. Scene CSS rewinds it while `data-on` is false. */
export function on(stage: number, n: number) {
  return { "data-on": stage >= n };
}

/** Show a layer only during step `n` (or any of several). */
export function show(stage: number, ...steps: number[]) {
  return { "data-show": steps.includes(stage) };
}

/** A real project photograph filling its positioned parent. Decorative: the section text carries the meaning. */
export function Photo({ src, position, className }: { src: string; position?: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes="(max-width: 999px) 92vw, 520px"
      className={className}
      style={{ objectFit: "cover", objectPosition: position }}
    />
  );
}

export type JourneyStep = { label: string; body: string };

type JourneyFrameProps = {
  industry: IndustryId;
  title: string;
  lead: string;
  /** What the visual shows, for assistive technology. The visual itself is decorative. */
  summary: string;
  steps: JourneyStep[];
  /** Which side the compact visual sits on from 1000px. */
  side: "left" | "right";
  /** "list" keeps every explanation in view; "tabs" shows one at a time under a row of steps. */
  story: "list" | "tabs";
  children: (stage: number) => ReactNode;
};

/**
 * The section below an industry hero: copy beside a compact visual built from
 * real work. It loops while on screen. Hovering a step or the visual holds it, a
 * tap holds it briefly, and Pause stops it. Server HTML, no JavaScript and reduced
 * motion show the finished journey.
 */
export function JourneyFrame({ industry, title, lead, summary, steps, side, story, children }: JourneyFrameProps) {
  const last = steps.length - 1;
  const headingId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [tapHold, setTapHold] = useState<{ ms: number } | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.6,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const running = inView && !reduced && !hovering && !focused && !paused;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(
      () => {
        setTapHold(null);
        setStage((current) => (current >= last ? 0 : current + 1));
      },
      tapHold?.ms ?? (stage === last ? LAST_STEP_MS : STEP_MS),
    );
    return () => window.clearTimeout(id);
  }, [running, stage, last, tapHold]);

  function select(index: number) {
    setTouched(true);
    setStage(index);
  }

  const shown = !hydrated || (reduced && !touched) ? last : stage;

  return (
    <section
      className={`industry-${industry} ${styles.section}`}
      data-look={industry}
      data-side={side}
      data-story={story}
      aria-labelledby={headingId}
    >
      <div className={`container ${styles.grid}`} role="group" aria-label={summary}>
        <div className={styles.intro}>
          <SectionTitle id={headingId} className={styles.title}>
            {title}
          </SectionTitle>
          <SectionDescription className={styles.lead}>{lead}</SectionDescription>
        </div>

        <div
          ref={ref}
          className={styles.stage}
          aria-hidden="true"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setHovering(true);
          }}
          onPointerLeave={() => setHovering(false)}
        >
          <div className={styles.scene}>{children(shown)}</div>
        </div>

        <div className={styles.story}>
          <ol
            className={styles.steps}
            style={{ "--steps": steps.length } as CSSProperties}
            onPointerLeave={() => setHovering(false)}
            onFocus={(event) => {
              if (event.target.matches(":focus-visible")) setFocused(true);
            }}
            onBlur={() => setFocused(false)}
          >
            {steps.map((step, index) => (
              <li key={step.label}>
                <button
                  type="button"
                  className={styles.step}
                  aria-current={index === shown ? "step" : undefined}
                  data-state={index < shown ? "done" : index === shown ? (running && !tapHold ? "playing" : "active") : "next"}
                  style={{ "--step-ms": `${index === last ? LAST_STEP_MS : STEP_MS}ms` } as CSSProperties}
                  onClick={() => {
                    select(index);
                    setTapHold({ ms: TAP_HOLD_MS });
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHovering(true);
                    select(index);
                  }}
                >
                  <span className={styles.bar}>
                    <span className={styles.fill} />
                  </span>
                  <span className={styles.label}>{step.label}</span>
                  <span className={styles.stepBody}>{step.body}</span>
                </button>
              </li>
            ))}
          </ol>

          {/* One explanation at a time; each keeps its place so the page never jumps */}
          <div className={styles.captions}>
            {steps.map((step, index) => (
              <p key={step.label} className={styles.caption} data-active={index === shown}>
                {step.body}
              </p>
            ))}
          </div>

          {/* The loop never ends on its own, so it needs a way to stop. Reduced motion has nothing to pause. */}
          {hydrated && !reduced ? (
            <button type="button" className={styles.control} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
              <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
                <path fill="currentColor" d={paused ? "M2 1l9 5-9 5z" : "M2 1h3v10H2zM7 1h3v10H7z"} />
              </svg>
              {paused ? "Play animation" : "Pause animation"}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
