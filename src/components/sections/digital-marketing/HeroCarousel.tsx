"use client";

import { useEffect, useState } from "react";
import styles from "./HeroCarousel.module.css";
import type { SmartSliderSlide } from "@/lib/wordpress/shared";

type HeroCarouselProps = {
  slides: Array<SmartSliderSlide | { src: string; alt: string; kind?: "image" | "video" }>;
  title: string;
};

export function HeroCarousel({ slides, title }: HeroCarouselProps) {
  const items = slides.map((slide) => ({
    ...slide,
    kind: slide.kind ?? "image",
  }));
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <section className={styles.hero} aria-label={title}>
        <div className={styles.fallback}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.slides}>
        {items.map((slide, index) => (
          <div
            className={[styles.slide, index === active ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
            key={`${slide.src}-${index}`}
            aria-hidden={index !== active}
          >
            {slide.kind === "video" ? (
              <video
                className={styles.image}
                src={slide.src}
                autoPlay
                muted
                loop
                playsInline
                preload={index === active ? "auto" : "metadata"}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slide.src} alt={slide.alt || title} className={styles.image} />
            )}
          </div>
        ))}
      </div>
      <div className={styles.overlay}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </section>
  );
}
