"use client";

import Image from "next/image";
import { handleArrowKeys, useStepper } from "./bd-motion";
import styles from "./GrowthPlan.module.css";

const UPLOADS = "/wp-content/uploads";

/**
 * The five Growth Strategy deliverables from the published Business Development
 * page — told as an editorial feature: a chapter index, a photograph that
 * shifts with the selection, and the active deliverable written large.
 * Supporting lines stay within approved copy (no invented services or claims).
 */
const CHAPTERS = [
  {
    name: "Market analysis",
    detail: "Market analysis & competitive positioning frameworks",
    focus: [
      "Competitive positioning frameworks",
      "Scalable growth frameworks tailored to your industry",
    ],
    note: "Comprehensive assessment of opportunities, risks, competitive landscape, and growth levers.",
    image: {
      src: `${UPLOADS}/2023/06/vancouver-agency.jpg`,
      alt: "Vancouver waterfront and skyline across the harbour at sunset",
      position: "52% 42%",
      caption: "Market context",
      place: "Vancouver harbour",
    },
  },
  {
    name: "Revenue model",
    detail: "Revenue model optimization & pricing strategy",
    focus: ["Revenue model optimization", "Pricing strategy"],
    note: "Every move is grounded in market intelligence, competitive analysis, and financial modelling.",
    image: {
      src: "/images/business-development/sales-container-ship-lions-gate.jpg",
      alt: "A container ship passing Lions Gate Bridge at golden hour",
      position: "48% 45%",
      caption: "Commercial scale",
      place: "Burrard Inlet",
    },
  },
  {
    name: "Partnerships",
    detail: "Strategic partnership identification & development",
    focus: [
      "From market entry to expansion planning, we build the roadmap turning ambition into measurable results.",
    ],
    note: "We pressure-test each opportunity before you commit resources to it.",
    image: {
      src: `${UPLOADS}/2024/10/corporate-events.webp`,
      alt: "An audience listening to speakers at a corporate presentation",
      position: "62% 48%",
      caption: "Shared rooms",
      place: "Corporate presentation",
    },
  },
  {
    name: "Business plans",
    detail: "Business plan creation & investor-ready pitch decks",
    focus: ["Business plan creation", "Investor-ready pitch decks"],
    note: "Whether you are entering a new market, launching a product, or scaling an established operation, we pressure-test each opportunity before you commit resources to it.",
    image: {
      src: "/images/business-development/legal-heritage-building-flag.jpg",
      alt: "Ivy-covered heritage building with a Canadian flag against a clear sky",
      position: "50% 28%",
      caption: "Institutional presence",
      place: "Heritage Vancouver",
    },
  },
  {
    name: "Operations",
    detail: "Operational efficiency audits & process improvement",
    focus: ["Operational efficiency audits", "Process improvement"],
    note: "Hands-on implementation support with ongoing advisory to ensure measurable outcomes.",
    image: {
      src: "/images/business-development/exit-harbour-sunset.jpg",
      alt: "A freighter on calm water at sunset with a distant bridge",
      position: "48% 55%",
      caption: "Operating rhythm",
      place: "Harbour at dusk",
    },
  },
] as const;

/**
 * Five Growth Strategy deliverables as a finished editorial feature: chapter
 * names stay visible and interactive, the photograph carries a caption, and
 * the active panel holds approved supporting copy — not a sparse slideshow.
 */
export function GrowthPlan() {
  const { ref, index, select } = useStepper<HTMLDivElement>(CHAPTERS.length, {
    interval: 3800,
    threshold: 0.35,
  });

  return (
    <div ref={ref} className={styles.plan} data-accent="growth">
      <nav className={styles.index} aria-label="Growth strategy deliverables">
        <p className={styles.kicker}>What the plan covers</p>
        <ol className={styles.chapters}>
          {CHAPTERS.map((chapter, chapterIndex) => (
            <li key={chapter.name}>
              <button
                id={`bd-growth-chapter-${chapterIndex}`}
                type="button"
                className={styles.chapter}
                aria-current={chapterIndex === index ? "true" : undefined}
                aria-controls="bd-growth-panels"
                onClick={() => select(chapterIndex)}
                onKeyDown={(event) =>
                  handleArrowKeys(event, chapterIndex, CHAPTERS.length, select, (next) => `bd-growth-chapter-${next}`)
                }
              >
                <span className={styles.chapterMark}>{String(chapterIndex + 1).padStart(2, "0")}</span>
                <span className={styles.chapterName}>{chapter.name}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.spread}>
        <figure className={styles.media}>
          {CHAPTERS.map((chapter, chapterIndex) => (
            <div key={chapter.name} className={styles.photo} data-active={chapterIndex === index} aria-hidden={chapterIndex !== index}>
              <Image
                src={chapter.image.src}
                alt={chapter.image.alt}
                fill
                sizes="(min-width: 900px) 48vw, 100vw"
                style={{ objectFit: "cover", objectPosition: chapter.image.position }}
                priority={chapterIndex === 0}
              />
            </div>
          ))}
          <figcaption className={styles.caption} aria-live="polite">
            <span className={styles.captionLabel}>{CHAPTERS[index].image.caption}</span>
            <span className={styles.captionPlace}>{CHAPTERS[index].image.place}</span>
          </figcaption>
        </figure>

        <div id="bd-growth-panels" className={styles.panels} aria-live="polite">
          {CHAPTERS.map((chapter, chapterIndex) => {
            const open = chapterIndex === index;
            return (
              <article
                key={chapter.name}
                className={styles.panel}
                data-active={open}
                aria-hidden={!open}
                inert={!open}
              >
                <p className={styles.mark}>
                  {String(chapterIndex + 1).padStart(2, "0")}
                  <span aria-hidden="true"> / {String(CHAPTERS.length).padStart(2, "0")}</span>
                </p>
                <h3 className={styles.title}>{chapter.name}</h3>
                <p className={styles.detail}>{chapter.detail}</p>
                <div className={styles.focus}>
                  {chapter.focus.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className={styles.note}>{chapter.note}</p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
