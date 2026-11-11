"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

/** True once the element has been on screen (with `threshold` of it visible). */
export function useSeen<T extends Element>(threshold = 0.35): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [seen, threshold]);

  return [ref, seen];
}

type StepperOptions = {
  /** Time on each state while playing. */
  interval?: number;
  /** Keep cycling (hero) or stop on the last state (stories). */
  loop?: boolean;
  /** Share of the component that must be visible before it starts. */
  threshold?: number;
};

/**
 * A set of states that plays through on its own once it's seen, until the
 * visitor chooses one. Server HTML and reduced motion show the first state
 * and never move.
 */
export function useStepper<T extends Element>(count: number, { interval = 3200, loop = false, threshold = 0.4 }: StepperOptions = {}) {
  const reduced = usePrefersReducedMotion();
  const [ref, seen] = useSeen<T>(threshold);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(false);
  const [paused, setPaused] = useState(false);
  const playing = seen && !reduced && !chosen && !paused;

  useEffect(() => {
    if (!playing) return;
    if (!loop && index >= count - 1) return;
    const id = window.setTimeout(() => setIndex((current) => (current + 1) % count), interval);
    return () => window.clearTimeout(id);
  }, [playing, index, count, interval, loop]);

  const select = useCallback((next: number) => {
    setChosen(true);
    setIndex(next);
  }, []);

  return { ref, index, select, playing, reduced, setPaused };
}

/** Arrow, Home and End keys move a selection along a row (or column) of buttons. */
export function handleArrowKeys(
  event: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  select: (next: number) => void,
  focusId: (next: number) => string,
) {
  const keys: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowDown: index + 1,
    ArrowLeft: index - 1,
    ArrowUp: index - 1,
    Home: 0,
    End: count - 1,
  };
  if (!(event.key in keys)) return;
  event.preventDefault();
  const next = (keys[event.key] + count) % count;
  select(next);
  document.getElementById(focusId(next))?.focus();
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Moves an SVG element along a path, between two distances measured along it.
 * Returns a cancel function. With `instant`, it jumps straight to the end.
 */
export function travelAlong(
  path: SVGPathElement,
  marker: SVGGraphicsElement,
  from: number,
  to: number,
  duration: number,
  instant = false,
): () => void {
  const place = (distance: number) => {
    const point = path.getPointAtLength(distance);
    marker.setAttribute("transform", `translate(${point.x} ${point.y})`);
  };
  if (instant || duration <= 0 || from === to) {
    place(to);
    return () => {};
  }
  let frame = 0;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    place(from + (to - from) * ease(t));
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}
