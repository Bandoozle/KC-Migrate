"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./MicrositeHero.module.css";

export type MicrositeHeroSlide = {
  src: string;
  alt: string;
};

type MicrositeHeroProps = {
  slides: MicrositeHeroSlide[];
  intervalMs?: number;
  /** Accessible name for the hero region. */
  label: string;
  /** Centered text stack (Comfortmaker / Mexico). */
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  /** Centered logo overlay (Uncorked). */
  logo?: { src: string; alt: string };
  /** Eyebrow accent color override. */
  eyebrowColor?: string;
  children?: ReactNode;
};

export function MicrositeHero({
  slides,
  intervalMs = 7000,
  label,
  eyebrow,
  title,
  subtitle,
  logo,
  eyebrowColor = "#b99b6f",
  children,
}: MicrositeHeroProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <section className={styles.hero} aria-label={label}>
      <div className={styles.slides}>
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-${index}`}
            className={[styles.slide, index === active ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={index !== active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.src} alt={slide.alt || label} className={styles.image} />
          </div>
        ))}
      </div>

      <div className={styles.overlay}>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo.src} alt={logo.alt} className={styles.logo} />
        ) : (
          <div className={styles.copy}>
            {eyebrow ? (
              <p className={styles.eyebrow} style={{ color: eyebrowColor }}>
                {eyebrow}
              </p>
            ) : null}
            {title ? <h1 className={styles.title}>{title}</h1> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            {children}
          </div>
        )}
        {logo && (title || children) ? (
          <span className={styles.srOnly}>{title || label}</span>
        ) : null}
      </div>
    </section>
  );
}
