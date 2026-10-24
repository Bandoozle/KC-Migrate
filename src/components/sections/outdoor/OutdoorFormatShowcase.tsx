"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./OutdoorFormatShowcase.module.css";

export type OutdoorFormat = {
  id: string;
  label: string;
  summary?: string;
  title?: string;
  price?: string;
  body?: string;
  tags: string[];
  spec?: string;
  cta?: { label: string; href: string } | null;
  image: { src: string; alt: string; position?: string };
};

type OutdoorFormatShowcaseProps = {
  formats: OutdoorFormat[];
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function OutdoorFormatShowcase({ formats }: OutdoorFormatShowcaseProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  return (
    <div className={styles.showcase}>
      <div className={styles.tabs} role="tablist" aria-label="Outdoor advertising formats">
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
              <span className={styles.tabIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.tabLabel}>{format.label}</span>
              {format.price ? <span className={styles.tabMeta}>{format.price}</span> : null}
            </button>
          );
        })}
      </div>

      <div className={styles.stage}>
        <div className={styles.view}>
          {formats.map((format, index) => (
            <div
              key={format.id}
              className={styles.frame}
              data-active={index === active ? "true" : "false"}
              aria-hidden={index === active ? undefined : true}
            >
              <Image
                src={format.image.src}
                alt={index === active ? format.image.alt : ""}
                fill
                sizes="(max-width: 999px) 100vw, 60vw"
                style={format.image.position ? { objectPosition: format.image.position } : undefined}
                priority={index === 0}
              />
            </div>
          ))}
          <p className={styles.viewLabel} aria-hidden="true">
            <span>{formats[active]?.label}</span>
          </p>
        </div>

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
                data-active={selected ? "true" : "false"}
                inert={!selected}
              >
                <div className={styles.panelHead}>
                  <h3 className={styles.panelTitle}>{format.title || format.label}</h3>
                  {format.price ? <p className={styles.price}>{format.price}</p> : null}
                </div>
                {format.summary ? <p className={styles.summary}>{format.summary}</p> : null}
                {format.body ? <p className={styles.body}>{format.body}</p> : null}
                {format.spec || format.tags.length > 0 ? (
                  <dl className={styles.facts}>
                    {format.spec ? (
                      <div>
                        <dt>Typical size</dt>
                        <dd>{format.spec}</dd>
                      </div>
                    ) : null}
                    {format.tags.length > 0 ? (
                      <div>
                        <dt>Highlights</dt>
                        <dd>
                          <ul className={styles.tags}>
                            {format.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}
                {format.cta ? (
                  <Link className={styles.cta} href={format.cta.href}>
                    {format.cta.label}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
