"use client";

import { Children, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./MobileRail.module.css";

type MobileRailProps = {
  /** The list element to render; keeps the host's semantics (ul for sets, ol for sequences). */
  as?: "ul" | "ol" | "div";
  /** The host component's own list class, which still lays the items out above 640px. */
  className?: string;
  children: ReactNode;
  /** Card width on phones, as a share of the rail (default 84%: about 1.15 cards in view). */
  itemWidth?: string;
  /** Gap between cards on phones. */
  gap?: string;
  /** Position dots under the rail on phones; on by default when there are three or more cards. */
  dots?: boolean;
  /** Extra class on the wrapper, e.g. to colour the dots via `color`. */
  wrapperClassName?: string;
  "aria-label"?: string;
  /** Passed through for host styles that key off the item count. */
  "data-count"?: number;
  /** False renders the plain list (no rail, no dots), for layouts that read better stacked. */
  enabled?: boolean;
};

/**
 * Wraps an existing card list so it becomes a swipeable rail on phones and stays the host's
 * grid everywhere else. Native scroll and CSS scroll-snap do the work: no autoplay, no arrows,
 * vertical page scrolling is untouched, and keyboard focus scrolls cards into view.
 */
export function MobileRail({
  as: Tag = "ul",
  className,
  children,
  itemWidth,
  gap,
  dots,
  wrapperClassName,
  "aria-label": ariaLabel,
  "data-count": dataCount,
  enabled = true,
}: MobileRailProps) {
  const ref = useRef<HTMLUListElement & HTMLOListElement & HTMLDivElement>(null);
  const count = Children.toArray(children).length;
  const showDots = enabled && (dots ?? count >= 3);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth + 1) return;
    const first = el.firstElementChild as HTMLElement | null;
    const second = first?.nextElementSibling as HTMLElement | null;
    const step = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setActive(atEnd ? count - 1 : Math.round(el.scrollLeft / Math.max(1, step)));
  }, [count]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !showDots) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [showDots, sync]);

  const style = {
    ...(itemWidth ? { "--rail-item": itemWidth } : {}),
    ...(gap ? { "--rail-gap": gap } : {}),
  } as CSSProperties;

  return (
    <div className={wrapperClassName} style={style}>
      <Tag ref={ref} className={enabled ? [className, styles.rail].filter(Boolean).join(" ") : className} aria-label={ariaLabel} data-count={dataCount}>
        {children}
      </Tag>
      {showDots ? (
        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <span key={index} className={styles.dot} data-active={index === active ? "true" : undefined} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
