"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/**
 * A white pill that slides to the selected tab instead of jumping. It measures
 * the selected tab inside the tab list and follows it on resize and scroll.
 * Until it has measured (server HTML, no JavaScript) the tab's own active
 * background shows instead, so nothing is ever missing.
 */
export function useSlidingPill<T extends HTMLElement>(active: number) {
  const listRef = useRef<T>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const tab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!tab) return;
      setBox({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [active]);

  // Only slide after the first placement, so the pill never glides in from the corner on load
  useLayoutEffect(() => {
    if (!box || animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [box, animate]);

  const pillStyle: CSSProperties | undefined = box
    ? { width: box.w, height: box.h, transform: `translate(${box.x}px, ${box.y}px)` }
    : undefined;

  /** For the tab list: absent until measured, "set" once placed, "slide" when moves animate. */
  const pillState = box ? (animate ? "slide" : "set") : undefined;
  return { listRef, pillStyle, pillState };
}
