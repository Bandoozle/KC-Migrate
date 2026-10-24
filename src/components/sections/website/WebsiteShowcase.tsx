"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { SectionTitle } from "@/components/typography";
import type { ServiceMediaCard, ServiceMediaCardSection } from "@/lib/wordpress/service-page-types";
import styles from "./WebsiteShowcase.module.css";

type WebsiteShowcaseProps = {
  section: ServiceMediaCardSection;
};

type Project = {
  title: string;
  description?: string;
  href: string | null;
  host: string;
  image: { src: string; alt: string };
};

function hostOf(href: string | null) {
  if (!href) return "";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Use a published caption only when it adds something the project name does not already say. */
function descriptionOf(card: ServiceMediaCard) {
  const body = card.body?.replace(/\s+/g, " ").trim();
  const alt = card.image?.alt?.replace(/\s+/g, " ").trim();
  const text = body || alt || "";
  if (!text) return undefined;
  if (text.split(/\s+/).length < 8) return undefined;
  if (/plumb/i.test(card.title) && /\bhvac\b/i.test(text)) return undefined;
  return text;
}

function projectsFrom(section: ServiceMediaCardSection): Project[] {
  const seen = new Set<string>();
  const projects: Project[] = [];
  for (const card of section.cards) {
    if (!card.image?.src || !card.title) continue;
    const key = card.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    projects.push({
      title: card.title,
      description: descriptionOf(card),
      href: card.href ?? null,
      host: hostOf(card.href ?? null),
      image: { src: card.image.src, alt: `${card.title} website` },
    });
  }
  return projects;
}

function Preview({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className={styles.frame}>
      <div className={styles.back} aria-hidden="true">
        <Image
          src={project.image.src}
          alt=""
          fill
          sizes="(min-width: 900px) 640px, 90vw"
          quality={85}
          className={styles.shot}
          style={{ objectPosition: "center 38%" }}
        />
      </div>
      <div className={styles.front}>
        <div className={styles.chrome} aria-hidden="true">
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          {project.host ? <span className={styles.host}>{project.host}</span> : null}
        </div>
        <div className={styles.viewport}>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            priority={priority}
            sizes="(min-width: 900px) 760px, 92vw"
            quality={85}
            className={styles.shot}
            style={{ objectPosition: "top center" }}
          />
        </div>
      </div>
    </div>
  );
}

function VisitLink({ project }: { project: Project }) {
  if (!project.href) return null;
  const external = /^https?:\/\//i.test(project.href);
  return (
    <a
      className={styles.visit}
      href={project.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      View project website
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 17 17 7M9 7h8v8"
        />
      </svg>
    </a>
  );
}

export function WebsiteShowcase({ section }: WebsiteShowcaseProps) {
  const projects = projectsFrom(section);
  const count = projects.length;
  const baseId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setScrub(desktop.matches && !reduce.matches);
    sync();
    desktop.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!scrub || count < 2) return;
    const node = trackRef.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const stage = stageRef.current;
      const scrollable = Math.max(node.offsetHeight - (stage?.offsetHeight ?? window.innerHeight), 1);
      const traveled = Math.min(Math.max(-node.getBoundingClientRect().top, 0), scrollable);
      const next = (traveled / scrollable) * (count - 1);
      setProgress((current) => (Math.abs(current - next) < 0.004 ? current : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [count, scrub]);

  function motionFor(index: number) {
    if (!scrub) {
      const on = index === active;
      return { opacity: on ? 1 : 0, transform: undefined, zIndex: on ? 1 : 0 };
    }
    const base = Math.floor(progress);
    const fraction = progress - base;
    const fade = 0.16;
    const amount = fraction <= 1 - fade ? 0 : (fraction - (1 - fade)) / fade;
    if (index === base) return { opacity: 1 - amount, zIndex: 1 };
    if (index === base + 1) return { opacity: amount, zIndex: 2 };
    return { opacity: 0, zIndex: 0 };
  }

  const displayed = (() => {
    if (!scrub) return active;
    const base = Math.floor(progress);
    const fraction = progress - base;
    const next = fraction > 0.92 ? base + 1 : base;
    return Math.min(count - 1, next);
  })();
  const current = projects[displayed];

  function activate(index: number, focus = false) {
    const next = Math.min(count - 1, Math.max(0, index));
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    if (!scrub || !trackRef.current || count < 2) return;
    const node = trackRef.current;
    const stage = stageRef.current;
    const scrollable = Math.max(node.offsetHeight - (stage?.offsetHeight ?? node.offsetHeight), 1);
    const top = node.getBoundingClientRect().top + window.scrollY;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: top + (next / (count - 1)) * scrollable,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: index === count - 1 ? 0 : index + 1,
      ArrowDown: index === count - 1 ? 0 : index + 1,
      ArrowLeft: index === 0 ? count - 1 : index - 1,
      ArrowUp: index === 0 ? count - 1 : index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    activate(keys[event.key], true);
  }

  function moveReel(direction: number) {
    const reel = reelRef.current;
    const slide = reel?.querySelector<HTMLElement>("[data-slide]");
    if (!reel || !slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reel.scrollBy({
      left: direction * (slide.offsetWidth + 16),
      behavior: reduce ? "auto" : "smooth",
    });
  }

  if (!current) return null;

  const tabs = (
    <div className={styles.tabs} role="tablist" aria-label="Website projects">
      {projects.map((project, index) => {
        const selected = index === displayed;
        return (
          <button
            key={project.title}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${baseId}-tab-${index}`}
            type="button"
            role="tab"
            className={styles.tab}
            aria-label={project.title}
            aria-selected={selected}
            aria-controls={`${baseId}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => activate(index)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        );
      })}
    </div>
  );

  return (
    <section className={`section ${styles.showcase}`} aria-labelledby={`${baseId}-title`}>
      <div className={`container ${styles.intro}`}>
        {section.title ? (
          <SectionTitle as="h2" id={`${baseId}-title`} className={styles.heading}>
            {section.title}
          </SectionTitle>
        ) : (
          <h2 id={`${baseId}-title`} className={styles.heading}>
            Website projects
          </h2>
        )}
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        style={{ ["--steps" as string]: Math.max(count - 1, 0) }}
      >
        <div ref={stageRef} className={`container ${styles.stage}`}>
          <div className={styles.copy}>
            <p className={styles.count}>
              <span>{String(displayed + 1).padStart(2, "0")}</span>
              <span aria-hidden="true"> / {String(count).padStart(2, "0")}</span>
              <span className={styles.srOnly}> of {count}</span>
            </p>
            <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${displayed}`} className={styles.panels}>
              {projects.map((project, index) => {
                const selected = index === displayed;
                return (
                  <div
                    key={project.title}
                    className={styles.panel}
                    data-active={selected}
                    aria-hidden={!selected}
                    inert={!selected}
                  >
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    {project.description ? <p className={styles.description}>{project.description}</p> : null}
                    <VisitLink project={project} />
                  </div>
                );
              })}
            </div>
            {tabs}
          </div>
          <div className={styles.stack}>
            {projects.map((project, index) => (
                <div
                  key={project.title}
                  className={styles.layer}
                  style={motionFor(index)}
                  aria-hidden={index !== displayed}
                >
                  <Preview project={project} priority={index === 0} />
                </div>
            ))}
          </div>
        </div>
        <div className={styles.runway} aria-hidden="true" />
      </div>

      <div className={`container ${styles.mobile}`}>
        <div className={styles.reelControls}>
          <button type="button" className={styles.reelButton} onClick={() => moveReel(-1)}>
            Previous website
          </button>
          <button type="button" className={styles.reelButton} onClick={() => moveReel(1)}>
            Next website
          </button>
        </div>
        <div
          ref={reelRef}
          className={styles.reel}
          tabIndex={0}
          aria-label="Website project slides"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveReel(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveReel(-1);
            }
          }}
        >
          {projects.map((project) => (
            <article key={project.title} data-slide className={styles.slide}>
              <Preview project={project} />
              <h3 className={styles.projectTitle}>{project.title}</h3>
              {project.description ? <p className={styles.description}>{project.description}</p> : null}
              <VisitLink project={project} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
