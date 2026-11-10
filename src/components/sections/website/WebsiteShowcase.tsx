"use client";

import Image from "next/image";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { SectionTitle } from "@/components/typography";
import type { ServiceMediaCardSection } from "@/lib/wordpress/service-page-types";
import { Browser, RECORDINGS, type RecordingKey } from "./Browser";
import { LoopVideo } from "./LoopVideo";
import { ScrollPreview } from "./ScrollPreview";
import styles from "./WebsiteShowcase.module.css";

type WebsiteShowcaseProps = {
  section: ServiceMediaCardSection;
};

type Project = {
  title: string;
  industry: string;
  objective: string;
  delivered: string[];
  recording?: RecordingKey;
  /** A full-page screenshot that scrolls in the canvas, for sites without a screen recording. */
  scroll?: { src: string; alt: string; width: number; height: number };
  href: string | null;
  host: string;
  image: { src: string; alt: string };
};

/*
 * Completed sites shown ahead of the WordPress list. Class A Heating leads:
 * screenshots captured from the live site, classaheating.ca (Nov 2026).
 */
const FEATURED: Project[] = [
  {
    title: "Class A Heating",
    industry: "HVAC",
    objective:
      "A modern, fully responsive website for a Chilliwack heating and cooling company, built around lead generation: quote and estimate requests, click-to-call, a rebate finder and product pages for every system.",
    delivered: ["Modern design", "Responsive layout", "Quote requests", "Click-to-call", "Rebate finder", "Product pages"],
    href: "https://classaheating.ca/",
    host: "classaheating.ca",
    image: { src: "/images/website-projects/class-a-heating-hero.jpg", alt: "The Class A Heating home page: HVAC Chilliwack heating & cooling specialists" },
    scroll: {
      src: "/images/website-projects/class-a-heating-full.jpg",
      alt: "The full Class A Heating home page, from the hero to the quote form and footer",
      width: 1440,
      height: 5914,
    },
  },
];

/*
 * Industry, a one-line objective and what was delivered, per client. The
 * objectives come from the published image captions; "delivered" restates
 * them as short tags, nothing more.
 */
const DETAILS: Record<string, { industry: string; objective: string; delivered: string[]; recording?: RecordingKey }> = {
  "directbuy furnace": {
    industry: "HVAC",
    objective: "A custom HVAC website focused on SEO, mobile responsiveness and lead generation, helping a heating contractor grow online.",
    delivered: ["Custom website", "SEO", "Mobile responsive", "Lead generation"],
    recording: "directbuy",
  },
  "chilliwack golf club": {
    industry: "Golf",
    objective: "A club website that brings the course, membership and events together, designed to welcome new golfers and keep members coming back.",
    delivered: ["Club website", "Membership", "Events"],
  },
  "padwood construction": {
    industry: "Construction",
    objective: "A custom website for a builder, with mobile optimization, service pages and a project portfolio that support business growth.",
    delivered: ["Custom website", "Service pages", "Project portfolio", "Mobile optimization"],
  },
  "skinfolio medesthetics": {
    industry: "Medical aesthetics",
    objective: "Website and e-commerce development for a skincare and medical aesthetics clinic, built to drive bookings, product sales and client trust.",
    delivered: ["Website", "E-commerce", "Online booking"],
    recording: "skinfolio",
  },
  "sparkle dental spa": {
    industry: "Dental",
    objective: "A calm, welcoming website for a dental spa, built to explain treatments clearly and make booking a visit easy.",
    delivered: ["Website", "Treatment pages", "Booking"],
  },
  "honest cleaning & services": {
    industry: "Home services",
    objective: "A clean, mobile-friendly website for a cleaning company that sets out its services clearly and turns visits into quote requests.",
    delivered: ["Mobile-friendly website", "Service pages", "Quote requests"],
  },
  "cool comfort solutions": {
    industry: "HVAC",
    objective: "A custom website for an HVAC company that showcases heating and cooling services, promotes rebates and generates leads.",
    delivered: ["Custom website", "Service pages", "Rebates", "Lead generation"],
  },
  "strueby plumbing": {
    industry: "Plumbing & heating",
    objective: "A professional plumbing and heating website with service pages, online quote requests and energy rebate information, designed to convert visitors into qualified leads.",
    delivered: ["Website", "Service pages", "Online quotes", "Rebate information"],
  },
};

function hostOf(href: string | null) {
  if (!href) return "";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function projectsFrom(section: ServiceMediaCardSection): Project[] {
  const seen = new Set<string>(FEATURED.map((project) => project.title.toLowerCase()));
  const projects: Project[] = [...FEATURED];
  for (const card of section.cards) {
    if (!card.image?.src || !card.title) continue;
    const key = card.title.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    const detail = DETAILS[key];
    projects.push({
      title: card.title,
      industry: detail?.industry ?? "Website",
      objective: detail?.objective ?? "",
      delivered: detail?.delivered ?? [],
      recording: detail?.recording,
      href: card.href ?? null,
      host: hostOf(card.href ?? null),
      image: { src: card.image.src, alt: `${card.title} website` },
    });
  }
  return projects;
}

const pad = (n: number) => String(n).padStart(2, "0");

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * The portfolio as a project stage: one large browser canvas with the next
 * project stacked behind it, an oversized title, and a filmstrip of every
 * project below. Hovering a filmstrip frame previews it in the stacked slot;
 * selecting it brings it forward. Projects with a screen recording can switch
 * the canvas to the full-page scroll of the live site.
 */
export function WebsiteShowcase({ section }: WebsiteShowcaseProps) {
  const projects = projectsFrom(section);
  const count = projects.length;
  const baseId = useId();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [preview, setPreview] = useState<number | null>(null);
  const [fullPage, setFullPage] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  if (count === 0) return null;
  const current = projects[active];
  const behindIndex = preview !== null && preview !== active ? preview : (active + 1) % count;
  const behind = projects[behindIndex];
  const showRecording = fullPage && current.recording;
  const showScroll = fullPage && !current.recording && current.scroll;
  const hasFullPage = Boolean(current.recording || current.scroll);

  function go(index: number, focus = false) {
    const target = (index + count) % count;
    if (target === active) return;
    setDirection(target > active || (active === count - 1 && target === 0) ? 1 : -1);
    setActive(target);
    setFullPage(false);
    const tab = tabRefs.current[target];
    if (focus) tab?.focus();
    // Keep the selected frame in view when the filmstrip scrolls sideways
    const strip = tab?.parentElement;
    if (tab && strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: reduced ? "auto" : "smooth" });
    }
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: count - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key], true);
  }

  // A gentle tilt toward the pointer on fine pointers; touch swipes between projects instead
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - box.top) / box.height - 0.5) * -3, y: ((event.clientX - box.left) / box.width - 0.5) * 4 });
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  }

  const external = current.href ? /^https?:\/\//i.test(current.href) : false;
  const tiltStyle = { "--rx": `${tilt.x}deg`, "--ry": `${tilt.y}deg` } as CSSProperties;

  return (
    <section className={styles.showcase} aria-labelledby={`${baseId}-title`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <p className={styles.label}>Selected work</p>
          <SectionTitle as="h2" id={`${baseId}-title`} className={styles.title}>
            {section.title || "Our latest website projects"}
          </SectionTitle>
        </div>

        <div className={styles.stage}>
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${active}`}
            className={styles.canvasArea}
            onPointerMove={onPointerMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <div key={`behind-${behindIndex}`} className={styles.behind} data-preview={preview !== null && preview !== active} aria-hidden="true">
              <Browser host={behind.host || behind.title} tone="dark">
                <Image src={behind.image.src} alt="" fill sizes="(min-width: 960px) 50vw, 80vw" className={styles.shot} />
              </Browser>
            </div>

            <div key={`front-${active}`} className={styles.front} data-dir={direction} style={tiltStyle}>
              <Browser
                host={current.host || current.title}
                path={showRecording || showScroll ? " / full page" : undefined}
                tone="dark"
                ratio={showRecording && current.recording ? RECORDINGS[current.recording].ratio : 16 / 10}
              >
                {showRecording && current.recording ? (
                  <LoopVideo recording={current.recording} />
                ) : showScroll && current.scroll ? (
                  <ScrollPreview {...current.scroll} />
                ) : (
                  <Image src={current.image.src} alt={current.image.alt} fill priority={active === 0} sizes="(min-width: 960px) 62vw, 100vw" quality={85} className={styles.shot} />
                )}
              </Browser>
            </div>

            {hasFullPage ? (
              <div className={styles.viewSwitch} role="group" aria-label="Canvas view">
                <button type="button" aria-pressed={!fullPage} onClick={() => setFullPage(false)}>
                  Hero
                </button>
                <button type="button" aria-pressed={fullPage} onClick={() => setFullPage(true)}>
                  Full-page scroll
                </button>
              </div>
            ) : null}
          </div>

          <div className={styles.info} aria-live="polite">
            <div className={styles.counterRow}>
              <p className={styles.counter}>
                <span>{pad(active + 1)}</span> / {pad(count)}
              </p>
              <div className={styles.steps}>
                <button type="button" className={styles.step} onClick={() => go(active - 1)} aria-label="Previous project">
                  <ArrowIcon direction="left" />
                </button>
                <button type="button" className={styles.step} onClick={() => go(active + 1)} aria-label="Next project">
                  <ArrowIcon />
                </button>
              </div>
            </div>
            <div key={`info-${active}`} className={styles.infoBody}>
              <p className={styles.meta}>
                <span className={styles.industry}>{current.industry}</span>
                {current.host ? <span className={styles.host}>{current.host}/</span> : null}
              </p>
              <h3 className={styles.projectName}>{current.title}</h3>
              {current.objective ? <p className={styles.objective}>{current.objective}</p> : null}
              {current.delivered.length > 0 ? (
                <div className={styles.delivered}>
                  <p className={styles.deliveredLabel}>Delivered</p>
                  <ul>
                    {current.delivered.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {current.href ? (
                <a className={styles.visit} href={current.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  Visit the live site
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                    <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Filmstrip: every project as a small browser frame; runs past the content edge */}
      <div className={styles.filmstripWrap}>
        <div className={styles.filmstrip} role="tablist" aria-label="Website projects" onPointerLeave={() => setPreview(null)}>
          {projects.map((project, index) => {
            const selected = index === active;
            return (
              <button
                key={project.title}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                className={styles.frame}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(index)}
                onKeyDown={(event) => onKey(event, index)}
                onPointerEnter={(event) => event.pointerType === "mouse" && setPreview(index)}
                onFocus={() => setPreview(null)}
              >
                <span className={styles.thumb}>
                  <span className={styles.thumbChrome} aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={styles.thumbView}>
                    <Image src={project.image.src} alt="" fill sizes="200px" className={styles.shot} />
                  </span>
                  {project.recording ? <span className={styles.liveTag}>Recording</span> : project.scroll ? <span className={styles.liveTag}>Full page</span> : null}
                </span>
                <span className={styles.frameText}>
                  <span className={styles.frameNumber}>{pad(index + 1)}</span>
                  <span className={styles.frameName}>{project.title}</span>
                  <span className={styles.frameIndustry}>{project.industry}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
