"use client";

import Image from "next/image";
import { useState } from "react";
import { handleArrowKeys } from "./bd-motion";
import styles from "./DealFile.module.css";

/* In the order a transaction comes together */
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

/**
 * The five parts of a transaction as a ledger beside a photograph. Choosing a
 * part opens its advisory work, and the transaction file on the photograph
 * ticks it off.
 */
export function DealFile() {
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set([0]));

  function choose(index: number) {
    setActive(index);
    setSeen((current) => new Set(current).add(index));
  }

  return (
    <div className={styles.layout}>
      <ol className={styles.ledger}>
        {ITEMS.map((item, index) => {
          const open = index === active;
          return (
            <li key={item.title} className={styles.row} data-active={open}>
              <h3 className={styles.rowHeading}>
                <button
                  id={`bd-deal-${index}`}
                  type="button"
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={`bd-deal-more-${index}`}
                  onClick={() => choose(index)}
                  onKeyDown={(event) => handleArrowKeys(event, index, ITEMS.length, choose, (next) => `bd-deal-${next}`)}
                >
                  <span className={styles.number} data-n={String(index + 1).padStart(2, "0")} aria-hidden="true" />
                  <span className={styles.title}>{item.title}</span>
                </button>
              </h3>
              <p className={styles.detail}>{item.detail}</p>
              <div id={`bd-deal-more-${index}`} className={styles.more}>
                <div className={styles.moreInner}>
                  <p className={styles.work}>
                    <span className={styles.workLabel}>Advisory</span>
                    {item.work}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <figure className={styles.photo}>
        <Image
          src="/images/business-development/legal-heritage-building-flag.jpg"
          alt="An ivy-covered heritage office building in Vancouver with a Canadian flag on the roof"
          fill
          sizes="(min-width: 960px) 44vw, 100vw"
          style={{ objectFit: "cover", objectPosition: "40% 30%" }}
        />
        <div className={styles.file} aria-hidden="true">
          <p className={styles.fileTitle}>
            Transaction file
            <span>
              {seen.size} of {ITEMS.length}
            </span>
          </p>
          <ul className={styles.fileRows}>
            {ITEMS.map((item, index) => (
              <li key={item.title} data-seen={seen.has(index)} data-current={index === active}>
                <span className={styles.check} />
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      </figure>
    </div>
  );
}
