"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./HeroBanner.module.css";

export type HeroBannerSlide = {
  src: string;
  alt: string;
  kind?: "image" | "video";
};

type HeroBannerProps = {
  slides: HeroBannerSlide[];
  title: string;
  eyebrow?: string;
  subtitle?: string;
  cta?: { label: string; href: string } | null;
};

export function HeroBanner({
  slides,
  title,
  eyebrow,
  subtitle,
  cta,
}: HeroBannerProps) {
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

  return (
    <section className={styles.hero} aria-label={title}>
      {items.length > 0 ? (
        <div className={styles.slides}>
          {items.map((slide, index) => (
            <div
              key={`${slide.src}-${index}`}
              className={[styles.slide, index === active ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
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
      ) : (
        <div className={styles.fallbackBg} />
      )}

      <div className={styles.overlay}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          {cta ? (
            <Link href={cta.href} className={styles.cta}>
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
