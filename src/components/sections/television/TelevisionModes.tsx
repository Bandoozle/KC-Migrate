"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { TV_MODES } from "@/content/television-page";
import { handleArrowKeys } from "@/components/sections/business-development/bd-motion";
import styles from "./TelevisionModes.module.css";

type ModeId = (typeof TV_MODES.modes)[number]["id"];

/**
 * Broadcast and Connected TV side by side: a photograph and headline for each,
 * then the same four questions answered for both, row by row. On phones a
 * switch shows one format at a time. A real table underneath, for screen readers.
 */
export function TelevisionModes() {
  const baseId = useId();
  const [shown, setShown] = useState<ModeId>("broadcast");
  const ids = TV_MODES.modes.map((mode) => mode.id);

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        <header className={styles.intro}>
          <h2 id={`${baseId}-title`} className={styles.title}>
            {TV_MODES.title}
          </h2>
          <p className={styles.lead}>{TV_MODES.lead}</p>
        </header>

        {/* Phones only: choose which format to read */}
        <div className={styles.switch} role="group" aria-label="Show format">
          {TV_MODES.modes.map((mode, index) => (
            <button
              key={mode.id}
              id={`${baseId}-switch-${mode.id}`}
              type="button"
              className={styles.switchButton}
              aria-pressed={shown === mode.id}
              onClick={() => setShown(mode.id)}
              onKeyDown={(event) =>
                handleArrowKeys(event, index, ids.length, (next) => setShown(ids[next]), (next) => `${baseId}-switch-${ids[next]}`)
              }
            >
              {mode.label}
            </button>
          ))}
        </div>

        <table className={styles.compare} data-shown={shown}>
          <caption className={styles.srOnly}>Broadcast TV and Connected TV compared</caption>
          <thead>
            <tr>
              <td className={styles.corner} />
              {TV_MODES.modes.map((mode) => (
                <th key={mode.id} scope="col" className={styles.head} data-mode={mode.id}>
                  <span className={styles.media}>
                    <Image
                      src={mode.image.src}
                      alt={mode.image.alt}
                      fill
                      sizes="(max-width: 899px) 100vw, 38vw"
                      style={{ objectFit: "cover", objectPosition: mode.image.position }}
                    />
                    <span className={styles.badge}>{mode.label}</span>
                  </span>
                  <span className={styles.headline}>{mode.headline}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TV_MODES.aspects.map((aspect) => (
              <tr key={aspect.id} className={styles.row}>
                <th scope="row" className={styles.aspect}>
                  {aspect.label}
                </th>
                {TV_MODES.modes.map((mode) => (
                  <td key={mode.id} className={styles.cell} data-mode={mode.id}>
                    {mode.rows[aspect.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
