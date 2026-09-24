"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./HeroBanner.module.css";

export type HeroBannerSlide = {
  src: string;
  alt: string;
  kind?: "image" | "video";
};

type HeroCta = { label: string; href: string };

type HeroBannerProps = {
  slides: HeroBannerSlide[];
  title: string;
  /** Muted second headline line. Enables the service-hero treatment when set. */
  titleSecondary?: string;
  eyebrow?: string;
  subtitle?: string;
  cta?: HeroCta | null;
  secondaryCta?: (HeroCta & { icon?: "phone" }) | null;
  /** Rich left-aligned service hero. Defaults on when a second title line is present. */
  variant?: "default" | "service";
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.61 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.18a2 2 0 0 1 2.11-.45c.84.28 1.72.49 2.62.61A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}

export function HeroBanner({
  slides,
  title,
  titleSecondary,
  eyebrow,
  subtitle,
  cta,
  secondaryCta,
  variant,
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

  const isService = variant === "service" || Boolean(titleSecondary);
  const heading = [title, titleSecondary].filter(Boolean).join(" ");

  return (
    <section
      className={[styles.hero, isService ? styles.service : ""].filter(Boolean).join(" ")}
      aria-label={heading}
    >
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
                <img src={slide.src} alt={slide.alt || heading} className={styles.image} />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.fallbackBg} />
      )}

      <div className={styles.overlay}>
        <div className={isService ? `container ${styles.copy}` : styles.copy}>
          {eyebrow ? (
            <Reveal variant="fadeUp">
              <p className={styles.eyebrow}>{eyebrow}</p>
            </Reveal>
          ) : null}
          <Reveal variant="fadeUp" delay={eyebrow ? 80 : 0}>
            <h1 className={styles.title}>
              <span>{title}</span>
              {titleSecondary ? (
                <span className={styles.titleSecondary}>{titleSecondary}</span>
              ) : null}
            </h1>
          </Reveal>
          {subtitle ? (
            <Reveal variant="fadeUp" delay={160}>
              <p className={styles.subtitle}>{subtitle}</p>
            </Reveal>
          ) : null}
          {isService && (cta || secondaryCta) ? (
            <Reveal variant="fadeUp" delay={240}>
              <div className={styles.actions}>
              {cta ? (
                <Link href={cta.href} className={styles.primary}>
                  {cta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                secondaryCta.href.startsWith("tel:") ||
                secondaryCta.href.startsWith("mailto:") ? (
                  <a href={secondaryCta.href} className={styles.secondary}>
                    {secondaryCta.icon === "phone" ? <PhoneIcon /> : null}
                    <span>{secondaryCta.label}</span>
                  </a>
                ) : (
                  <Link href={secondaryCta.href} className={styles.secondary}>
                    {secondaryCta.icon === "phone" ? <PhoneIcon /> : null}
                    <span>{secondaryCta.label}</span>
                  </Link>
                )
              ) : null}
            </div>
            </Reveal>
          ) : cta ? (
            <Reveal variant="fadeUp" delay={160}>
              <Link href={cta.href} className={styles.cta}>
                {cta.label}
              </Link>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
