"use client";

import Image from "next/image";
import { useState } from "react";
import { handleArrowKeys } from "./bd-motion";
import styles from "./DealFile.module.css";

const MATTERS = [
  {
    title: "Corporate structure",
    detail: "Entities, ownership and governance set up for the deal.",
    work: "Corporate restructuring & governance advisory",
  },
  {
    title: "Documentation",
    detail: "Contracts drafted, reviewed and negotiated.",
    work: "Contract drafting, review & negotiation strategy",
  },
  {
    title: "Due diligence",
    detail: "Records organized before anyone asks.",
    work: "Due diligence preparation & data room management",
  },
  {
    title: "Compliance",
    detail: "Regulatory risk identified and addressed.",
    work: "Regulatory compliance audits & risk mitigation",
  },
  {
    title: "Agreements",
    detail: "Partnership and joint venture terms structured, and intellectual property protected.",
    work: "Joint venture, partnership & IP agreement structuring",
  },
] as const;

/**
 * Legal & compliance as an editorial dossier: heritage photograph as the
 * institutional plane, matters as calm expanding entries — not a numbered
 * accordion or checklist overlay.
 */
export function DealFile() {
  const [active, setActive] = useState(0);
  const current = MATTERS[active];

  return (
    <div className={styles.dossier} data-accent="legal">
      <figure className={styles.visual}>
        <Image
          src="/images/business-development/legal-heritage-building-flag.jpg"
          alt="An ivy-covered heritage office building in Vancouver with a Canadian flag on the roof"
          fill
          sizes="(min-width: 960px) 48vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "42% 28%" }}
          priority
        />
        <figcaption className={styles.place}>Heritage Vancouver</figcaption>
        <div className={styles.matterCard} aria-live="polite">
          <p className={styles.matterLabel}>Matter</p>
          {/* The card names the service; the open entry beside it gives the summary, so nothing is said twice */}
          <p className={styles.matterTitle}>{current.work}</p>
        </div>
      </figure>

      <div className={styles.entries}>
        <ol className={styles.list}>
          {MATTERS.map((matter, index) => {
            const open = index === active;
            return (
              <li key={matter.title} className={styles.entry} data-active={open}>
                <h3 className={styles.entryHeading}>
                  <button
                    id={`bd-deal-${index}`}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={`bd-deal-more-${index}`}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) =>
                      handleArrowKeys(event, index, MATTERS.length, setActive, (next) => `bd-deal-${next}`)
                    }
                  >
                    {matter.title}
                  </button>
                </h3>
                <div id={`bd-deal-more-${index}`} className={styles.more}>
                  <div className={styles.moreInner}>
                    <p className={styles.detail}>{matter.detail}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
