"use client";

import Image from "next/image";
import { useState, type CSSProperties, type ReactNode } from "react";
import styles from "./BrandAnatomy.module.css";

type Region = { x: number; y: number; w: number; h: number };

export type AnatomyPart = {
  label: string;
  body: string;
  /** Percent box on the sheet image. */
  region: Region;
};

type BrandAnatomyProps = {
  image: { src: string; alt: string };
  parts: AnatomyPart[];
  caption: ReactNode;
};

export function BrandAnatomy({ image, parts, caption }: BrandAnatomyProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const shown = hovered ?? pinned;
  const region = shown === null ? null : parts[shown]?.region;

  const spot = region
    ? ({
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.w}%`,
        height: `${region.h}%`,
      } satisfies CSSProperties)
    : undefined;

  return (
    <div className={styles.anatomy}>
      <figure className={styles.figure}>
        <div className={styles.sheet}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1100px) 420px, (min-width: 700px) 50vw, 100vw"
            className={styles.image}
          />
          {parts.map((part, index) => (
            <span
              key={part.label}
              className={styles.marker}
              data-active={shown === index ? "true" : undefined}
              style={{ left: `${part.region.x + part.region.w}%`, top: `${part.region.y}%` }}
              aria-hidden="true"
            >
              {index + 1}
            </span>
          ))}
          <span className={styles.spot} data-visible={region ? "true" : undefined} style={spot} aria-hidden="true" />
        </div>
        <figcaption className={styles.caption}>{caption}</figcaption>
      </figure>

      <ol className={styles.legend} onMouseLeave={() => setHovered(null)}>
        {parts.map((part, index) => (
          <li key={part.label}>
            <button
              type="button"
              className={styles.part}
              aria-pressed={pinned === index}
              onMouseEnter={() => setHovered(index)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={() => setPinned(pinned === index ? null : index)}
            >
              <span className={styles.partNumber}>{index + 1}</span>
              <span className={styles.partText}>
                <span className={styles.partLabel}>{part.label}</span>
                <span className={styles.partBody}>{part.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
