"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import styles from "./ExitNarrative.module.css";

const PHOTO_SRC = "/images/business-development/exit-harbour-sunset.jpg";

/**
 * Sunset photograph as a composed visual plane with restrained scroll parallax.
 */
export function ExitPhoto() {
  const frameRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return;

    let frameId = 0;
    const update = () => {
      const rect = frame.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = (view - rect.top) / (view + rect.height);
      const shift = Math.max(-1, Math.min(1, progress * 2 - 1)) * 3;
      image.style.transform = `translate3d(0, ${shift}%, 0) scale(1.05)`;
      frameId = 0;
    };

    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [reduced]);

  return (
    <figure ref={frameRef} className={styles.photo} aria-hidden="true">
      <div
        ref={imageRef}
        className={styles.photoInner}
        style={{ backgroundImage: `url(${PHOTO_SRC})` }}
      />
      <figcaption className={styles.photoCaption}>Vancouver harbour · Golden hour</figcaption>
    </figure>
  );
}
