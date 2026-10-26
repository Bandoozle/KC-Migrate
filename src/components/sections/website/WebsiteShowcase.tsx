"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { SectionTitle } from "@/components/typography";
import type { ServiceMediaCardSection } from "@/lib/wordpress/service-page-types";
import styles from "./WebsiteShowcase.module.css";

type WebsiteShowcaseProps = {
  section: ServiceMediaCardSection;
};

type Project = {
  title: string;
  industry: string;
  objective: string;
  href: string | null;
  host: string;
  image: { src: string; alt: string };
};

/* Industry and a one-line objective per client, drawn from the published image captions where they exist */
const DETAILS: Record<string, { industry: string; objective: string }> = {
  "directbuy furnace": {
    industry: "HVAC",
    objective: "A custom HVAC website focused on SEO, mobile responsiveness and lead generation, helping a heating contractor grow online.",
  },
  "chilliwack golf club": {
    industry: "Golf",
    objective: "A club website that brings the course, membership and events together, designed to welcome new golfers and keep members coming back.",
  },
  "padwood construction": {
    industry: "Construction",
    objective: "A custom website for a builder, with mobile optimization, service pages and a project portfolio that support business growth.",
  },
  "skinfolio medesthetics": {
    industry: "Medical aesthetics",
    objective: "Website and e-commerce development for a skincare and medical aesthetics clinic, built to drive bookings, product sales and client trust.",
  },
  "sparkle dental spa": {
    industry: "Dental",
    objective: "A calm, welcoming website for a dental spa, built to explain treatments clearly and make booking a visit easy.",
  },
  "honest cleaning & services": {
    industry: "Home services",
    objective: "A clean, mobile-friendly website for a cleaning company that sets out its services clearly and turns visits into quote requests.",
  },
  "cool comfort solutions": {
    industry: "HVAC",
    objective: "A custom website for an HVAC company that showcases heating and cooling services, promotes rebates and generates leads.",
  },
  "strueby plumbing": {
    industry: "Plumbing & heating",
    objective: "A professional plumbing and heating website with service pages, online quote requests and energy rebate information, designed to convert visitors into qualified leads.",
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
  const seen = new Set<string>();
  const projects: Project[] = [];
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
      href: card.href ?? null,
      host: hostOf(card.href ?? null),
      image: { src: card.image.src, alt: `${card.title} website` },
    });
  }
  return projects;
}

function Browser({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className={styles.browser}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>{project.host || project.title}</span>
      </div>
      <div className={styles.viewport}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 960px) 62vw, 100vw"
          quality={85}
          className={styles.shot}
        />
      </div>
    </div>
  );
}

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** A numbered project index beside one large browser window; the next project sits behind it. */
export function WebsiteShowcase({ section }: WebsiteShowcaseProps) {
  const projects = projectsFrom(section);
  const count = projects.length;
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (count === 0) return null;
  const current = projects[active];
  const next = projects[(active + 1) % count];

  function go(index: number, focus = false) {
    const target = (index + count) % count;
    setActive(target);
    const tab = tabRefs.current[target];
    if (focus) tab?.focus();
    // When the index is a horizontal row (tablet and phone), bring the selected name into view
    const row = tab?.parentElement;
    if (tab && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - row.offsetLeft, behavior: "smooth" });
    }
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    go(keys[event.key], true);
  }

  const external = current.href ? /^https?:\/\//i.test(current.href) : false;

  return (
    <section className={styles.showcase} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.label}>Portfolio</p>
          <SectionTitle as="h2" id={`${baseId}-title`} className={styles.title}>
            {section.title || "Our latest website projects"}
          </SectionTitle>
        </div>

        <div className={styles.layout}>
          <div className={styles.index} role="tablist" aria-label="Website projects" aria-orientation="vertical">
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
                  className={styles.entry}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => go(index)}
                  onKeyDown={(event) => onKey(event, index)}
                >
                  <span className={styles.entryNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.entryName}>{project.title}</span>
                  <span className={styles.entryIndustry}>{project.industry}</span>
                </button>
              );
            })}
          </div>

          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className={styles.stage}>
            <div className={styles.stack}>
              {next && next !== current ? (
                <div className={styles.behind} aria-hidden="true">
                  <Browser project={next} />
                </div>
              ) : null}
              <div key={current.title} className={styles.front}>
                <Browser project={current} priority={active === 0} />
              </div>
            </div>

            <div className={styles.caption}>
              <div>
                <p className={styles.captionMeta}>
                  {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")} · {current.industry}
                </p>
                <h3 className={styles.projectName}>{current.title}</h3>
                {current.objective ? <p className={styles.objective}>{current.objective}</p> : null}
              </div>
              <div className={styles.actions}>
                {current.href ? (
                  <a
                    className={styles.visit}
                    href={current.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    View project
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </a>
                ) : null}
                <button type="button" className={styles.step} onClick={() => go(active - 1)} aria-label="Previous project">
                  <ArrowIcon direction="left" />
                </button>
                <button type="button" className={styles.step} onClick={() => go(active + 1)} aria-label="Next project">
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
