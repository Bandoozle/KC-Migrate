"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import s from "./GeoTargeting.module.css";

/* Map units: viewBox 560 × 360; the business sits at the centre of the targeting circle */
const CENTER = { x: 360, y: 186 };
const RADII = [
  { id: "5", label: "5 km", r: 58, note: "The neighbourhood around you" },
  { id: "15", label: "15 km", r: 112, note: "The area your team can reach" },
  { id: "40", label: "40 km", r: 178, note: "The wider city and suburbs" },
  { id: "region", label: "Region", r: 420, note: "Everyone in your province or region" },
] as const;

/* People moving around the area. Inside the circle they can see the ad; outside they can't. */
/* Integer-only generator: server and browser produce identical positions */
function seeded(seed: number) {
  let x = seed >>> 0;
  return () => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return x / 4294967296;
  };
}
const rand = seeded(7);
const PEOPLE = Array.from({ length: 64 }, () => ({ x: 20 + rand() * 520, y: 20 + rand() * 320 }));

const NEIGHBOURHOODS = [
  { name: "North Shore", x: 228, y: 44 },
  { name: "Westside", x: 92, y: 168 },
  { name: "Downtown", x: 380, y: 238 },
  { name: "Riverside", x: 470, y: 120 },
  { name: "East Hills", x: 486, y: 300 },
  { name: "Southgate", x: 140, y: 318 },
];

const CYCLE_MS = 3200;

export function GeoTargeting() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(1);
  const [visible, setVisible] = useState(false);
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Step through the first three radii while on screen, until the visitor picks one
  useEffect(() => {
    if (!visible || reduced || chosen) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % 3), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [visible, reduced, chosen]);

  const radius = RADII[index];
  const inside = (p: { x: number; y: number }) => Math.hypot(p.x - CENTER.x, p.y - CENTER.y) <= radius.r;
  const reached = PEOPLE.filter(inside).length;

  return (
    <div ref={ref} className={s.geo}>
      <div className={s.map} aria-hidden="true">
        <svg viewBox="0 0 560 360" preserveAspectRatio="xMidYMid slice" focusable="false">
          <rect width="560" height="360" fill="#eceee8" />
          {/* Water, parks, blocks */}
          <path d="M0 0 H 210 C 170 40, 110 70, 0 78 Z" fill="#bcd6e6" />
          <path d="M560 210 C 520 220, 470 260, 452 360 H 560 Z" fill="#bcd6e6" />
          <rect x="370" y="36" width="96" height="58" rx="6" fill="#cfe2c1" />
          <rect x="40" y="226" width="80" height="54" rx="6" fill="#cfe2c1" />
          <g fill="#e1e2db">
            {Array.from({ length: 7 }, (_, col) =>
              Array.from({ length: 5 }, (_, row) => {
                const x = 20 + col * 78;
                const y = 100 + row * 52 - (col % 2) * 10;
                return <rect key={`${col}-${row}`} x={x} y={y} width="58" height="34" rx="3" />;
              }),
            )}
          </g>
          {/* Roads: two arterials, a highway, local streets */}
          <g fill="none" strokeLinecap="round">
            <path d="M-10 300 C 120 280, 240 210, 330 170 S 480 90, 570 70" stroke="#e7d9a6" strokeWidth="12" />
            <path d="M-10 300 C 120 280, 240 210, 330 170 S 480 90, 570 70" stroke="#f6ebc1" strokeWidth="9" />
            <path d="M0 186 H 560" stroke="#ffffff" strokeWidth="7" />
            <path d="M360 0 V 360" stroke="#ffffff" strokeWidth="7" />
            <path d="M0 132 H 560 M0 240 H 560 M150 0 V 360 M450 0 V 360" stroke="#ffffff" strokeWidth="4" />
          </g>
          {NEIGHBOURHOODS.map((n) => (
            <text key={n.name} x={n.x} y={n.y} textAnchor="middle" className={s.place}>
              {n.name}
            </text>
          ))}

          {/* The targeting circle grows and shrinks around the business */}
          <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
            <g className={s.ring} style={{ "--k": radius.r / 100 } as CSSProperties}>
              <circle r="100" className={s.area} />
            </g>
          </g>

          {/* People: lit inside the area, quiet outside */}
          {PEOPLE.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.4" className={s.person} data-in={inside(p)} />
          ))}

          {/* Radius label on the circle's edge */}
          {radius.id !== "region" ? (
            <g className={s.edge} style={{ transform: `translate(${CENTER.x + radius.r * 0.707}px, ${CENTER.y - radius.r * 0.707}px)` }}>
              <rect x="-20" y="-10" width="40" height="18" rx="9" />
              <text y="3" textAnchor="middle">
                {radius.label}
              </text>
            </g>
          ) : null}

          {/* The business */}
          <g transform={`translate(${CENTER.x} ${CENTER.y})`}>
            <path d="M0 0 c-10-13-15-21-15-29 a15 15 0 0 1 30 0 c0 8-5 16-15 29Z" fill="#5b63f5" stroke="#ffffff" strokeWidth="2" />
            <circle cy="-29" r="5" fill="#ffffff" />
          </g>
        </svg>
        <span className={s.tag}>Illustrative</span>
      </div>

      {/* The settings that drive the map */}
      <div className={s.panel}>
        <p className={s.panelTitle}>Location targeting</p>
        <p className={s.panelMeta}>Around your business</p>
        <div className={s.radii} role="group" aria-label="Targeting radius">
          {RADII.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={i === index}
              onClick={() => {
                setChosen(true);
                setIndex(i);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className={s.radiusNote} aria-live="polite">
          {radius.note}
        </p>
        <ul className={s.settings}>
          <li>
            <span className={s.switch} aria-hidden="true" />
            People in or regularly in this area
          </li>
          <li>
            <span className={s.switch} aria-hidden="true" />
            Higher bids closest to you
          </li>
          <li>
            <span className={s.switch} aria-hidden="true" />
            Ads run during your open hours
          </li>
        </ul>
        <p className={s.legend}>
          <span>
            <i className={s.dotIn} /> Can see your ad
          </span>
          <span>
            <i className={s.dotOut} /> Outside the area
          </span>
        </p>
        <p className={s.srOnly}>
          {`Showing ads within ${radius.label === "Region" ? "the whole region" : radius.label} of your business: ${reached} of ${PEOPLE.length} illustrative people on the map are inside the area.`}
        </p>
      </div>
    </div>
  );
}
