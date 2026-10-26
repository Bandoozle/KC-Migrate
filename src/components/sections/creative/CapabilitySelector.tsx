"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./CapabilitySelector.module.css";

export type Capability = {
  key: string;
  tab: string;
  title: string;
  body: string;
  points: string[];
  image: { src: string; alt: string; position?: string };
  anchor: { href: string; label: string };
};

type CapabilitySelectorProps = {
  capabilities: Capability[];
};

export function CapabilitySelector({ capabilities }: CapabilitySelectorProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = capabilities.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className={styles.selector}>
      <div className={styles.tabs} role="tablist" aria-label="Creative capabilities">
        {capabilities.map((item, index) => (
          <button
            key={item.key}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${baseId}-tab-${index}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index)}
            onMouseEnter={() => select(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            <span className={styles.tabNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.tabLabel}>{item.tab}</span>
          </button>
        ))}
      </div>

      {capabilities.map((item, index) => (
        <div
          key={item.key}
          id={`${baseId}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${index}`}
          className={styles.panel}
          hidden={index !== active}
        >
          <div className={styles.visual}>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 960px) 58vw, 100vw"
              className={styles.image}
              style={item.image.position ? { objectPosition: item.image.position } : undefined}
            />
          </div>
          <div className={styles.copy}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
            <ul className={styles.points}>
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <a className={styles.anchor} href={item.anchor.href}>
              {item.anchor.label}
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
