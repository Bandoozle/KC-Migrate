"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./AudioSession.module.css";

export type AudioLane = {
  name: string;
  detail: string;
  shape: "voice" | "bed" | "hits" | "master";
};

const BARS = 96;

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

/** Deterministic bar heights (0–1) so server and client render the same waveform. */
function waveform(shape: AudioLane["shape"], seed: number) {
  const random = seeded(seed);
  return Array.from({ length: BARS }, (_, index) => {
    const t = index / BARS;
    const noise = random();
    if (shape === "voice") {
      const phrase = Math.sin(t * Math.PI * 7) > -0.35 ? 1 : 0.06;
      return Math.max(0.05, phrase * (0.35 + noise * 0.65));
    }
    if (shape === "bed") return 0.38 + Math.sin(t * Math.PI) * 0.22 + noise * 0.12;
    if (shape === "hits") return index % 13 === 4 || index % 29 === 11 ? 0.55 + noise * 0.45 : 0.04 + noise * 0.05;
    return 0.55 + noise * 0.4;
  });
}

type AudioSessionProps = {
  lanes: AudioLane[];
};

export function AudioSession({ lanes }: AudioSessionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLive(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.session} data-live={live || undefined}>
      <div className={styles.ruler} aria-hidden="true">
        <span />
        <ol className={styles.marks}>
          {["00:00", "00:10", "00:20", "00:30"].map((mark) => (
            <li key={mark}>{mark}</li>
          ))}
        </ol>
      </div>
      <ul className={styles.lanes}>
        {lanes.map((lane, laneIndex) => (
          <li key={lane.name} className={styles.lane} style={{ "--lane": laneIndex } as CSSProperties}>
            <div className={styles.laneHead}>
              <span className={styles.laneName}>{lane.name}</span>
              <span className={styles.laneDetail}>{lane.detail}</span>
            </div>
            <svg
              className={styles.wave}
              viewBox={`0 0 ${BARS * 4} 40`}
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              {waveform(lane.shape, laneIndex * 7919 + 17).map((height, index) => {
                const h = Math.max(1.5, height * 38);
                return <rect key={index} x={index * 4} y={20 - h / 2} width="2.4" height={h} rx="1" />;
              })}
            </svg>
          </li>
        ))}
      </ul>
      <span className={styles.playhead} aria-hidden="true" />
    </div>
  );
}
