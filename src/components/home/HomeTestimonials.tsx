"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { SectionDescription, SectionTitle } from "@/components/typography";
import type { HomePageContent, HomeTestimonial } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeTestimonials.module.css";

type HomeTestimonialsProps = {
  content: HomePageContent["testimonials"];
};

const QUOTE_CLAMP_CHARS = 180;

function StarRow({ rating }: { rating: number }) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: rating }, (_, index) => (
        <svg
          key={index}
          className={styles.star}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M12 2.5l2.74 5.55 6.13.89-4.43 4.32 1.05 6.1L12 16.9l-5.49 2.89 1.05-6.1L3.13 8.94l6.13-.89L12 2.5z"
          />
        </svg>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <span className={styles.source}>
      <svg
        className={styles.googleIcon}
        viewBox="0 0 24 24"
        width="14"
        height="14"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Posted on Google
    </span>
  );
}

function TestimonialCard({ item }: { item: HomeTestimonial }) {
  const [expanded, setExpanded] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const [quoteHeight, setQuoteHeight] = useState<number | undefined>(undefined);
  const needsClamp = item.quote.length > QUOTE_CLAMP_CHARS;

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 24;
    const collapsedHeight = lineHeight * 4;
    const fullHeight = el.scrollHeight;
    const nextHeight =
      !needsClamp || expanded ? fullHeight : Math.min(collapsedHeight, fullHeight);

    setQuoteHeight(nextHeight);
  }, [expanded, item.quote, needsClamp]);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const onResize = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 24;
      const collapsedHeight = lineHeight * 4;
      const fullHeight = el.scrollHeight;
      setQuoteHeight(
        !needsClamp || expanded ? fullHeight : Math.min(collapsedHeight, fullHeight),
      );
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, needsClamp]);

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <StarRow rating={item.rating} />
        <GoogleMark />
      </div>
      <h3 className={styles.name}>{item.name}</h3>
      {item.affiliation ? <p className={styles.affiliation}>{item.affiliation}</p> : null}
      <div
        className={styles.quoteWrap}
        style={quoteHeight != null ? { height: quoteHeight } : undefined}
      >
        <p ref={quoteRef} className={styles.quote}>
          “{item.quote}”
        </p>
      </div>
      {needsClamp ? (
        <button
          type="button"
          className={styles.readMore}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : (
        <span className={styles.readMoreSpacer} aria-hidden="true" />
      )}
    </article>
  );
}

export function HomeTestimonials({ content }: HomeTestimonialsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    // Subpixel tolerance so ends feel definitive
    setCanScrollLeft(left > 2);
    setCanScrollRight(left < maxScroll - 2);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [content.items.length]);

  const scrollByPage = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    if (direction < 0 && !canScrollLeft) return;
    if (direction > 0 && !canScrollRight) return;
    const amount = Math.max(track.clientWidth * 0.9, 280);
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section
      className={`${shared.rail} ${styles.section}`}
      aria-labelledby="home-testimonials-title"
    >
      <div className={`${shared.introCentered} ${styles.intro}`}>
        <SectionTitle id="home-testimonials-title">{content.title}</SectionTitle>
        <SectionDescription>{content.lead}</SectionDescription>
      </div>

      <div className={styles.carousel}>
        <div
          ref={trackRef}
          className={styles.track}
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          tabIndex={0}
        >
          <span id={labelId} className={styles.srOnly}>
            Customer reviews
          </span>
          {content.items.map((item) => (
            <div key={`${item.name}-${item.quote.slice(0, 24)}`} className={styles.slide}>
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.control} ${canScrollLeft ? "" : styles.controlDisabled}`}
            aria-label="Previous reviews"
            aria-disabled={!canScrollLeft}
            disabled={!canScrollLeft}
            onClick={() => scrollByPage(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.control} ${canScrollRight ? "" : styles.controlDisabled}`}
            aria-label="Next reviews"
            aria-disabled={!canScrollRight}
            disabled={!canScrollRight}
            onClick={() => scrollByPage(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
