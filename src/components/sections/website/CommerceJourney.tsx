"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Browser } from "./Browser";
import styles from "./CommerceJourney.module.css";

/*
 * Amsterdam Garden Centre, a Shopify store built by Kosick, followed through
 * the four moments of a purchase. Every screen is a screenshot of the live
 * store (amsterdamgardencentre.ca, captured Nov 2026), so nothing is mocked.
 */
const HOST = "amsterdamgardencentre.ca";
const SHOTS = "/images/website-projects/amsterdam-garden-centre";
const CHAPTERS = [
  {
    verb: "Discover",
    where: "Home page",
    path: "/",
    line: "The season's story up front, with clear ways into the shop and the garden centre.",
    image: { src: `${SHOTS}-home.jpg`, alt: "Amsterdam Garden Centre home page: Christmas In Bloom, with Get Directions" },
  },
  {
    verb: "Browse",
    where: "Collections",
    path: "/collections/hydrangeas",
    line: "Collections with filters by type, supplier and price, and a clean grid to scan.",
    image: { src: `${SHOTS}-collection.jpg`, alt: "The Hydrangeas collection with filters and a grid of products and prices" },
  },
  {
    verb: "Choose",
    where: "Product page",
    path: "/products/hydrangea-arborescens-annabelle",
    line: "Photo, price, quantity and pickup details together, with one clear button.",
    image: { src: `${SHOTS}-product.jpg`, alt: "Product page for Hydrangea arborescens 'Annabelle' with price, quantity and Add to Wheelbarrow" },
  },
  {
    verb: "Convert",
    where: "Cart & checkout",
    path: "/cart",
    line: "A tidy cart with the subtotal, a secure checkout button and related products.",
    image: { src: `${SHOTS}-cart.jpg`, alt: "The cart with one hydrangea, the subtotal, a Checkout button and Customers also bought" },
  },
] as const;

/** Time on each screen while playing. */
const STEP_MS = 4200;

export function CommerceJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState<boolean | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Paused by the visitor wins; otherwise play while on screen unless they prefer reduced motion
  const playing = visible && (paused === null ? !reduced : !paused);

  // Fill the current step's bar, then move to the next screen
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const start = performance.now() - progress * STEP_MS;
    const tick = (now: number) => {
      const p = Math.min((now - start) / STEP_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setProgress(0);
        setActive((current) => (current + 1) % CHAPTERS.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // progress is read once when (re)starting, so a resume continues where it stopped
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active]);

  function jump(index: number) {
    setActive(index);
    setProgress(0);
    if (paused === null && reduced) return; // Reduced motion: show the screen, don't start playback
    setPaused(false);
  }

  function fill(index: number) {
    if (index < active) return 1;
    if (index > active) return 0;
    return progress;
  }

  const current = CHAPTERS[active];

  return (
    <div className={styles.journey}>
      <ol className={styles.chapters}>
        {CHAPTERS.map((chapter, index) => (
          <li key={chapter.verb}>
            <button
              type="button"
              className={styles.chapter}
              aria-current={index === active ? "step" : undefined}
              onClick={() => jump(index)}
              style={{ "--p": fill(index) } as CSSProperties}
            >
              <span className={styles.bar} aria-hidden="true">
                <i />
              </span>
              <span className={styles.chapterHead}>
                <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.chapterVerb}>{chapter.verb}</span>
              </span>
              <span className={styles.chapterWhere}>{chapter.where}</span>
              <span className={styles.chapterLine}>{chapter.line}</span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={ref} className={styles.screen}>
        <Browser host={HOST} path={current.path === "/" ? undefined : current.path} ratio={16 / 10} className={styles.browser}>
          {CHAPTERS.map((chapter, index) => (
            <div key={chapter.verb} className={styles.shot} data-active={index === active} aria-hidden={index !== active}>
              <Image
                src={chapter.image.src}
                alt={chapter.image.alt}
                fill
                sizes="(min-width: 1000px) 60vw, 100vw"
                quality={85}
                priority={index === 0}
                className={styles.shotImage}
              />
            </div>
          ))}
          <button
            type="button"
            className={styles.control}
            onClick={() => setPaused(playing)}
            aria-label={playing ? "Pause the store tour" : "Play the store tour"}
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
            <span>{playing ? "Playing" : "Paused"}</span>
          </button>
        </Browser>
        <p className={styles.caption}>Amsterdam Garden Centre, a Shopify store built by Kosick. Screens from the live store.</p>
      </div>
    </div>
  );
}
