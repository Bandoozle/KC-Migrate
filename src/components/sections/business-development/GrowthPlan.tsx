"use client";

import Image from "next/image";
import { handleArrowKeys, useStepper } from "./bd-motion";
import styles from "./GrowthPlan.module.css";

/**
 * Growth Strategy deliverables as an immersive briefing: one dominant
 * photograph, a large active chapter, and a quiet text rail of alternatives.
 */
const CHAPTERS = [
  {
    name: "Market analysis",
    detail: "Where you can win, and who stands in the way.",
    focus: [
      "Size the market and the segments worth pursuing",
      "Map competitors and the position only you can hold",
    ],
    note: "An honest read of the opportunities, the risks and the levers that will move growth.",
    image: {
      src: "/images/business-development/growth-market-facade.jpg",
      alt: "Angled steel and glass panels on a modern Vancouver building",
      position: "50% 45%",
      place: "Downtown Vancouver",
    },
  },
  {
    name: "Revenue model",
    detail: "How the business earns, and how it could earn more.",
    focus: ["Test pricing against value and competition", "Find the mix of products and channels with the best margin"],
    note: "Every recommendation is backed by financial modelling, not instinct.",
    image: {
      src: "/images/business-development/growth-seabus.jpg",
      alt: "A passenger ferry crossing Burrard Inlet in the late afternoon light",
      position: "50% 50%",
      place: "Burrard Inlet",
    },
  },
  {
    name: "Partnerships",
    detail: "The alliances that open doors faster than you could alone.",
    focus: [
      "Identify distribution, technology and referral partners",
      "Structure terms so both sides have a reason to deliver",
    ],
    note: "Each partnership is judged on what it adds, not on how good it sounds.",
    image: {
      src: "/images/business-development/growth-lions-gate-span.jpg",
      alt: "The green steel span of Lions Gate Bridge against the North Shore mountains",
      position: "60% 40%",
      place: "Lions Gate Bridge",
    },
  },
  {
    name: "Business plans",
    detail: "A plan your team can run and an investor can trust.",
    focus: ["Business plans with clear milestones and owners", "Pitch decks built around the numbers investors check first"],
    note: "Whether you are entering a new market, launching a product or scaling an established operation, we pressure-test each opportunity before you commit resources to it.",
    image: {
      src: "/images/business-development/growth-plans-waterfront.jpg",
      alt: "A tall blue sculpture on the Vancouver Convention Centre plaza, with the harbour and mountains beyond",
      position: "50% 55%",
      place: "Coal Harbour",
    },
  },
  {
    name: "Operations",
    detail: "Fewer bottlenecks between a sale and a delivered result.",
    focus: ["Audit how work moves through the business", "Remove the steps that slow growth down"],
    note: "Hands-on implementation support, with ongoing advice until the results show.",
    image: {
      src: "/images/business-development/growth-seawall.jpg",
      alt: "An aerial view of the Stanley Park seawall curving along the water",
      position: "50% 50%",
      place: "Stanley Park seawall",
    },
  },
] as const;

export function GrowthPlan() {
  const { ref, index, select } = useStepper<HTMLDivElement>(CHAPTERS.length, {
    interval: 4200,
    threshold: 0.3,
  });
  const active = CHAPTERS[index];

  return (
    <div ref={ref} className={styles.plan} data-accent="growth">
      <div className={styles.stage}>
        <figure className={styles.media}>
          {CHAPTERS.map((chapter, chapterIndex) => (
            <div
              key={chapter.name}
              className={styles.photo}
              data-active={chapterIndex === index}
              aria-hidden={chapterIndex !== index}
            >
              <Image
                src={chapter.image.src}
                alt={chapter.image.alt}
                fill
                sizes="(min-width: 900px) 60vw, 100vw"
                style={{ objectFit: "cover", objectPosition: chapter.image.position }}
                priority={chapterIndex === 0}
              />
            </div>
          ))}
          <figcaption className={styles.place} aria-live="polite">
            {active.image.place}
          </figcaption>
        </figure>

        <div className={styles.brief} id="bd-growth-panels" aria-live="polite">
          <p className={styles.briefLabel}>Briefing</p>
          <h3 className={styles.briefTitle}>{active.name}</h3>
          <p className={styles.briefDetail}>{active.detail}</p>
          <div className={styles.focus}>
            {active.focus.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.note}>{active.note}</p>
        </div>

        <nav className={styles.rail} aria-label="Growth strategy deliverables">
          <ol className={styles.chapters}>
            {CHAPTERS.map((chapter, chapterIndex) => (
              <li key={chapter.name}>
                <button
                  id={`bd-growth-chapter-${chapterIndex}`}
                  type="button"
                  className={styles.chapter}
                  aria-current={chapterIndex === index ? "true" : undefined}
                  onClick={() => select(chapterIndex)}
                  onKeyDown={(event) =>
                    handleArrowKeys(event, chapterIndex, CHAPTERS.length, select, (next) => `bd-growth-chapter-${next}`)
                  }
                >
                  {chapter.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
