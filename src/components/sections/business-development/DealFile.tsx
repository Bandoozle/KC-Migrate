"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./DealFile.module.css";

const ITEMS = [
  {
    title: "Corporate Structure",
    detail: "Entities, ownership and governance set up for the deal.",
    work: "Corporate restructuring & governance advisory",
  },
  {
    title: "Documentation",
    detail: "Contracts drafted, reviewed and negotiated.",
    work: "Contract drafting, review & negotiation strategy",
  },
  {
    title: "Due Diligence",
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
];

/** An accordion beside the transaction file it fills in: each area reviewed gets ticked on the file. */
export function DealFile() {
  const [open, setOpen] = useState<number | null>(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set([0]));

  function toggle(index: number) {
    setOpen((current) => (current === index ? null : index));
    setSeen((current) => new Set(current).add(index));
  }

  return (
    <div className={styles.grid}>
      <ul className={styles.accordion}>
        {ITEMS.map((item, index) => {
          const expanded = open === index;
          const panelId = `bd-deal-${index}`;
          return (
            <li key={item.title} className={styles.item} data-open={expanded}>
              <h3 className={styles.heading}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <span>{item.title}</span>
                  <span className={styles.sign} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className={styles.panel}>
                <div className={styles.panelInner}>
                  <p className={styles.detail}>{item.detail}</p>
                  <p className={styles.work}>{item.work}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.file}>
        <Image
          src="/wp-content/uploads/2024/01/pexels-sora-shimazaki-5668473-2.png"
          alt="Black binders beside a gavel on a dark desk"
          fill
          sizes="(min-width: 960px) 42vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "40% 50%" }}
        />
        <div className={styles.sheet} aria-hidden="true">
          <span className={styles.sheetTitle}>Transaction file</span>
          {ITEMS.map((item, index) => (
            <span key={item.title} className={styles.row} data-seen={seen.has(index)} data-current={open === index}>
              <span className={styles.check} />
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
