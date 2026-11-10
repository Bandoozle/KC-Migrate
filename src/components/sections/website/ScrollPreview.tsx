"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import controls from "./LoopVideo.module.css";
import styles from "./ScrollPreview.module.css";

type ScrollPreviewProps = {
  /** A full-page screenshot of the live site, captured at desktop width. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * A full-page scroll of a live site from a single tall screenshot: it glides
 * down the page, rests, and returns, inside the browser mockup. Sharper and far
 * lighter than a screen recording. It runs only while on screen; reduced motion
 * holds the top of the page until the visitor presses play.
 */
export function ScrollPreview({ src, alt, width, height }: ScrollPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const playing = visible && (userPaused === null ? !reduced : !userPaused);
  // Longer pages scroll for longer, so the pace reads the same on every site
  const seconds = Math.min(40, Math.max(14, (height / width) * 5.5));

  return (
    <>
      <div ref={ref} className={styles.window} data-playing={playing}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={styles.page}
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          style={{ animationDuration: `${seconds}s` }}
        />
      </div>
      <button
        type="button"
        className={controls.control}
        data-tone="dark"
        onClick={() => setUserPaused(playing)}
        aria-label={playing ? "Pause the page scroll" : "Play the page scroll"}
      >
        {playing ? (
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M4 3h3v10H4zM9 3h3v10H9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M4 2.5v11l9-5.5z" />
          </svg>
        )}
        <span className={controls.live} data-on={playing} aria-hidden="true" />
      </button>
    </>
  );
}
