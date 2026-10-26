"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./OutdoorFormatShowcase.module.css";

export type OutdoorFormat = {
  id: string;
  label: string;
  /** One sentence shown under the image. */
  line: string;
  /** Optional single metadata line, such as a starting price. */
  meta?: string;
  image: { src: string; alt: string; position?: string };
};

type OutdoorFormatShowcaseProps = {
  formats: OutdoorFormat[];
};

/** A numbered text navigation over one large image and one short text block. */
export function OutdoorFormatShowcase({ formats }: OutdoorFormatShowcaseProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = formats[active];
  if (!current) return null;

  function go(index: number, focus = false) {
    const next = (index + formats.length) % formats.length;
    setActive(next);
    const tab = tabRefs.current[next];
    if (focus) tab?.focus();
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: formats.length - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key], true);
  }

  return (
    <div className={styles.showcase}>
      <div className={styles.tabs} role="tablist" aria-label="Outdoor advertising formats">
        {formats.map((format, index) => (
          <button
            key={format.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${baseId}-tab-${format.id}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => go(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            <span className={styles.tabNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.tabLabel}>{format.label}</span>
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${current.id}`} className={styles.panel}>
        <div key={current.id} className={styles.view}>
          <Image
            src={current.image.src}
            alt={current.image.alt}
            fill
            sizes="(min-width: 1290px) 1290px, 100vw"
            className={styles.shot}
            style={current.image.position ? { objectPosition: current.image.position } : undefined}
          />
        </div>
        <div className={styles.caption}>
          <h3 className={styles.name}>{current.label}</h3>
          <p className={styles.line}>{current.line}</p>
          {current.meta ? <p className={styles.meta}>{current.meta}</p> : null}
        </div>
      </div>
    </div>
  );
}
