"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./PartnerLandscape.module.css";

export type PartnerLogo = { src: string; name: string };
export type PartnerGroup = { title: string; logos: PartnerLogo[] };

type PartnerLandscapeProps = {
  groups: PartnerGroup[];
};

export function PartnerLandscape({ groups }: PartnerLandscapeProps) {
  const baseId = useId();
  const tabs = ["All", ...groups.map((group) => group.title)];
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = active === 0 ? groups.flatMap((group) => group.logos) : (groups[active - 1]?.logos ?? []);

  function select(index: number, focus = false) {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  }

  return (
    <div className={styles.landscape}>
      <div className={styles.bar}>
        <div className={styles.tabs} role="tablist" aria-label="Partner categories">
          {tabs.map((label, index) => (
            <button
              key={label}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={index === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          {visible.length} {visible.length === 1 ? "partner" : "partners"}
        </p>
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className={styles.canvas}
        style={{ "--n": visible.length } as CSSProperties}
      >
        <ul key={active} className={styles.grid}>
          {visible.map((logo) => (
            <li key={logo.src} className={styles.cell}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.name} className={styles.logo} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
