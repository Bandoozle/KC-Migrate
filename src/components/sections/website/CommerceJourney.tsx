"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { Browser, RECORDINGS, recordingCropClass } from "./Browser";
import styles from "./CommerceJourney.module.css";

/*
 * The Skinfolio store, recorded live, split into the four moments of a
 * purchase. The chapters are timestamps in that one recording, so every
 * frame shown is the real store.
 */
const CHAPTERS = [
  { verb: "Discover", where: "Home page", line: "The brand up front, with a clear way into the shop.", start: 0, end: 4.9 },
  { verb: "Browse", where: "Categories and ranges", line: "Products grouped to scan, with add-to-cart on every card.", start: 5, end: 21.9 },
  { verb: "Choose", where: "Product page", line: "Details, price and options together in one view.", start: 22, end: 24.4 },
  { verb: "Convert", where: "Checkout cues", line: "Secure checkout and related products, right below the button.", start: 24.5, end: 32.4 },
] as const;

const { src, host, ratio, label } = RECORDINGS.skinfolio;

export function CommerceJourney() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [time, setTime] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  let active = 0;
  CHAPTERS.forEach((chapter, index) => {
    if (time >= chapter.start) active = index;
  });

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = visible && (paused === null ? !reduced : !paused);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (shouldPlay) node.play().catch(() => setPlaying(false));
    else node.pause();
  }, [shouldPlay]);

  // Smooth progress while playing; timeupdate alone only fires a few times a second
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      if (videoRef.current) setTime(videoRef.current.currentTime);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  function jump(index: number) {
    const node = videoRef.current;
    if (!node) return;
    node.currentTime = CHAPTERS[index].start + 0.05;
    setTime(CHAPTERS[index].start);
    if (paused === null && reduced) return; // Reduced motion: show the frame, don't start playback
    setPaused(false);
  }

  function progress(index: number) {
    const chapter = CHAPTERS[index];
    if (time >= chapter.end) return 1;
    if (time <= chapter.start) return 0;
    return (time - chapter.start) / (chapter.end - chapter.start);
  }

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
              style={{ "--p": progress(index) } as CSSProperties}
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

      <div className={styles.screen}>
        <Browser host={host} path={` / ${CHAPTERS[active].where.toLowerCase()}`} ratio={ratio} className={styles.browser}>
          <video
            ref={videoRef}
            className={recordingCropClass}
            src={`${src}#t=0.1`}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
            onSeeked={(event) => setTime(event.currentTarget.currentTime)}
          />
          <button
            type="button"
            className={styles.control}
            onClick={() => setPaused(playing)}
            aria-label={playing ? "Pause the store recording" : "Play the store recording"}
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
            <span>{playing ? "Recording" : "Paused"}</span>
          </button>
        </Browser>
        <p className={styles.caption}>Skinfolio Medesthetics, recorded on the live store.</p>
      </div>
    </div>
  );
}
