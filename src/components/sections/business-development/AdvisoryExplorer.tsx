"use client";

import Image from "next/image";
import { useState } from "react";
import { handleArrowKeys } from "./bd-motion";
import styles from "./AdvisoryExplorer.module.css";


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
    image: {
      src: "/images/business-development/advisory-glass-tower.jpg",
      alt: "A modern glass office tower against a clear blue sky in downtown Vancouver",
      position: "50% 45%",
    },
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
    image: {
      src: "/images/business-development/sales-container-ship-lions-gate.jpg",
      alt: "A container ship passing Lions Gate Bridge at golden hour",
      position: "48% 42%",
    },
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
    image: {
      src: "/images/business-development/legal-heritage-facade.jpg",
      alt: "The carved sandstone facade of a heritage office building in Vancouver, with a Canadian flag above",
      position: "45% 28%",
    },
  },
  {
    id: "exit",
    title: "Exit Strategy",
    summary: "Prepare the business for a sale, merger or succession, well before it’s urgent.",
    points: [
      "Business valuation & market benchmarking",
      "M&A target identification & buyer outreach",
      "Succession planning & leadership transition",
    ],
    image: {
      src: "/images/business-development/exit-yacht-club.jpg",
      alt: "A historic yacht club boathouse and moored sailboats on Coal Harbour",
      position: "48% 52%",
    },
  },
] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The four services as one spread: a photograph, and a panel cut into its edge
 * that carries the chosen service. The four names run across the top of the
 * panel; choosing one changes the photograph and the story beneath. Every
 * service's title and copy stay in the page for search engines.
 */
export function AdvisoryExplorer() {
  const [active, setActive] = useState(0);
  const area = AREAS[active];

  return (
    <div className={styles.spread} data-accent={area.id}>
      <div className={styles.media}>
        {AREAS.map((item) => (
          <div key={item.id} className={styles.photo} data-active={item.id === area.id} aria-hidden={item.id !== area.id}>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              sizes="(min-width: 900px) 62vw, 100vw"
              style={{ objectFit: "cover", objectPosition: item.image.position }}
            />
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.switcher} role="group" aria-label="Services">
          {AREAS.map((item, index) => (
            <button
              key={item.id}
              id={`bd-advisory-tab-${item.id}`}
              type="button"
              className={styles.name}
              data-accent={item.id}
              aria-pressed={index === active}
              aria-controls={`bd-advisory-${item.id}`}
              onClick={() => setActive(index)}
              onKeyDown={(event) => handleArrowKeys(event, index, AREAS.length, setActive, (next) => `bd-advisory-tab-${AREAS[next].id}`)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className={styles.stories}>
          {AREAS.map((item) => {
            const open = item.id === area.id;
            return (
              <article
                key={item.id}
                id={`bd-advisory-${item.id}`}
                className={styles.story}
                data-active={open}
                aria-hidden={!open}
                inert={!open}
              >
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.summary}>{item.summary}</p>
                <ul className={styles.focus} aria-label={`${item.title} includes`}>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a className={styles.more} href={`#${item.id}`}>
                  How we approach it
                  <ArrowIcon />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
