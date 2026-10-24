"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./VideoFormatShowcase.module.css";

export type VideoDevice = "tv" | "laptop" | "tablet" | "phone";

export type VideoFormat = {
  id: string;
  label: string;
  meta: string;
  body: string;
  devices: VideoDevice[];
  visual: "photo" | "article" | "phone";
  image?: { src: string; alt: string; position?: string };
  /** Shown inside the phone diagram. Published size, not a measured placement. */
  spec?: string;
};

type VideoFormatShowcaseProps = {
  formats: VideoFormat[];
};

const DEVICES: Array<{ id: VideoDevice; label: string }> = [
  { id: "tv", label: "TV" },
  { id: "laptop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "phone", label: "Mobile" },
];

function DeviceIcon({ id }: { id: VideoDevice }) {
  if (id === "tv") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="5" width="18" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 20h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "laptop") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="4" y="5" width="16" height="10" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M2.5 18h19" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "tablet") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="5" y="3" width="14" height="18" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="8" y="2.5" width="8" height="19" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function VideoFormatShowcase({ formats }: VideoFormatShowcaseProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = formats[active];

  function select(index: number, focus = false) {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = formats.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    select(keys[event.key], true);
  }

  if (!current) return null;

  return (
    <div className={styles.showcase}>
      <div className={styles.tabs} role="tablist" aria-label="Digital video formats">
        {formats.map((format, index) => {
          const selected = index === active;
          return (
            <button
              key={format.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${format.id}`}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${format.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => onKey(event, index)}
            >
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.tabLabel}>{format.label}</span>
              <span className={styles.tabMeta}>{format.meta}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.stageColumn}>
        <div className={styles.stage}>
          {formats.map((format, index) => {
            const selected = index === active;
            return (
              <div
                key={format.id}
                className={styles.visual}
                data-active={selected}
                aria-hidden={!selected}
              >
                {format.visual === "photo" && format.image ? (
                  <Image
                    src={format.image.src}
                    alt={selected ? format.image.alt : ""}
                    fill
                    sizes="(min-width: 960px) 720px, 100vw"
                    className={styles.shot}
                    style={{ objectPosition: format.image.position || "center" }}
                  />
                ) : null}
                {format.visual === "article" ? (
                  <div className={styles.pageDiagram}>
                    <div className={styles.pageBar} aria-hidden="true" />
                    <div className={styles.pageBody}>
                      <span className={styles.line} />
                      <span className={`${styles.line} ${styles.lineShort}`} />
                      <div className={styles.unit}>
                        <span>Video</span>
                      </div>
                      <span className={styles.line} />
                      <span className={`${styles.line} ${styles.lineShort}`} />
                    </div>
                    <p className={styles.diagramLabel}>Placement diagram</p>
                  </div>
                ) : null}
                {format.visual === "phone" ? (
                  <div className={styles.diagram}>
                    <div className={styles.handset}>
                      <span className={styles.handsetSpec}>{format.spec}</span>
                      <span className={styles.handsetNote}>Portrait</span>
                    </div>
                    <p className={styles.diagramLabel}>Placement diagram</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <ul className={styles.devices} aria-hidden="true">
          {DEVICES.map((device) => (
            <li key={device.id} className={styles.device} data-on={current.devices.includes(device.id)}>
              <DeviceIcon id={device.id} />
              <span>{device.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.panels}>
          {formats.map((format, index) => {
            const selected = index === active;
            return (
              <div
                key={format.id}
                id={`${baseId}-panel-${format.id}`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${format.id}`}
                className={styles.panel}
                data-active={selected}
                aria-hidden={!selected}
                inert={!selected}
              >
                <h3 className={styles.panelTitle}>{format.label}</h3>
                <p className={styles.panelBody}>{format.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
