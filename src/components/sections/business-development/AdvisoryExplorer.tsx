"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./AdvisoryExplorer.module.css";

const UPLOADS = "/wp-content/uploads";

const AREAS = [
  {
    id: "growth",
    title: "Growth Strategy",
    summary: "Clarify direction, identify opportunities and build a plan for sustainable growth.",
    points: [
      "Market analysis & competitive positioning",
      "Revenue model optimization & pricing strategy",
      "Business plans & investor-ready pitch decks",
    ],
    image: { src: `${UPLOADS}/2026/09/henderson-inclusive-strategy-edited.jpg`, alt: "A team fitting coloured gears together on a meeting table", position: "50% 50%" },
  },
  {
    id: "sales",
    title: "Corporate Sales",
    summary: "Build the pipeline, systems and habits that make selling repeatable.",
    points: [
      "B2B pipeline architecture & CRM implementation",
      "Enterprise account strategy & key account management",
      "Sales team training, coaching & performance systems",
    ],
    image: { src: `${UPLOADS}/2024/10/corporate-events.webp`, alt: "A business audience listening to speakers at the front of a room", position: "62% 50%" },
  },
  {
    id: "legal",
    title: "Legal & Compliance",
    summary: "Navigate corporate structure, documentation and transaction requirements alongside your counsel.",
    points: [
      "Corporate restructuring & governance advisory",
      "Contract drafting, review & negotiation strategy",
      "Regulatory compliance audits & risk mitigation",
    ],
    image: { src: `${UPLOADS}/2024/01/pexels-sora-shimazaki-5668473-2.png`, alt: "Black binders beside a gavel on a dark desk", position: "50% 50%" },
  },
  {
    id: "exit",
    title: "Exit Strategy",
    summary: "Prepare the business for a sale, merger or succession, well before it's urgent.",
    points: [
      "Business valuation & market benchmarking",
      "M&A target identification & buyer outreach",
      "Succession planning & leadership transition",
    ],
    image: { src: `${UPLOADS}/2023/06/real-estate.jpeg`, alt: "A bright living room opening onto a view of the ocean", position: "50% 45%" },
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** The four services: choosing one opens its detail and brings its photograph forward. */
export function AdvisoryExplorer() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.explorer}>
      <div className={styles.media}>
        {AREAS.map((area, index) => (
          <div key={area.id} className={styles.photo} data-active={index === active} aria-hidden={index !== active}>
            <Image
              src={area.image.src}
              alt={area.image.alt}
              fill
              sizes="(min-width: 960px) 54vw, 100vw"
              style={{ objectFit: "cover", objectPosition: area.image.position }}
            />
          </div>
        ))}
        <p className={styles.mediaTag} aria-hidden="true">
          <span>{AREAS[active].title}</span>
          <span className={styles.pips}>
            {AREAS.map((area, index) => (
              <i key={area.id} data-active={index === active} />
            ))}
          </span>
        </p>
      </div>

      <ul className={styles.list}>
        {AREAS.map((area, index) => {
          const open = index === active;
          const panelId = `bd-advisory-${area.id}`;
          return (
            <li key={area.id} className={styles.item} data-open={open}>
              <h3 className={styles.itemHeading}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActive(index)}
                >
                  <span className={styles.triggerTitle}>{area.title}</span>
                  <span className={styles.triggerMark} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className={styles.panel}>
                <div className={styles.panelInner}>
                  <p className={styles.summary}>{area.summary}</p>
                  <ul className={styles.points}>
                    {area.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <a className={styles.more} href={`#${area.id}`} tabIndex={open ? undefined : -1}>
                    How we approach it
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
