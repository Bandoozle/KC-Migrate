"use client";

import { useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { JourneyFrame, Photo, on } from "@/components/industry/journeys/JourneyFrame";
import { MapBase, MapPin, Route } from "@/components/industry/journeys/LocalMap";
import p from "@/components/industry/journeys/places.module.css";
import s from "./OutdoorJourney.module.css";

const U = "/wp-content/uploads";
const CREATIVE = `${U}/2024/03/billboard-advertising.webp`;
const STORE = `${U}/2023/06/hearth-advertising.jpg`;

/* ---------- Paths, as cubic segments so positions can be computed anywhere ---------- */
type Pt = readonly [number, number];
type Seg = { kind: "cubic"; p: [Pt, Pt, Pt, Pt] } | { kind: "line"; p: [Pt, Pt] };

/** The highway drawn by MapBase("highway"): two cubics. */
const HIGHWAY: Seg[] = [
  { kind: "cubic", p: [[-10, 214], [120, 196], [200, 120], [300, 108]] },
  { kind: "cubic", p: [[300, 108], [400, 96], [420, 104], [450, 100]] },
];
/** The highlighted car: the highway (split exactly at t = 0.75) to the exit, down Main St, east to the store. */
const HERO: Seg[] = [
  { kind: "cubic", p: [[-10, 214], [87.5, 200.5], [156.9, 154.4], [227.7, 127.1]] },
  { kind: "cubic", p: [[227.7, 127.1], [234, 125], [240, 131], [240, 140]] },
  { kind: "line", p: [[240, 140], [356, 140]] },
];
const EXIT_ROUTE = "M227.7 127.1 C 234 125, 240 131, 240 140 H 356";

function at(seg: Seg, t: number): Pt {
  if (seg.kind === "line") {
    const [a, b] = seg.p;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }
  const [a, b, c, d] = seg.p;
  const u = 1 - t;
  const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [w[0] * a[0] + w[1] * b[0] + w[2] * c[0] + w[3] * d[0], w[0] * a[1] + w[1] * b[1] + w[2] * c[1] + w[3] * d[1]];
}

/** Sample a path into an arc-length table, so a fraction means distance travelled. */
function table(segs: Seg[]) {
  const pts: Pt[] = [];
  segs.forEach((seg, i) => {
    for (let k = i === 0 ? 0 : 1; k <= 60; k++) pts.push(at(seg, k / 60));
  });
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, len, total: len[len.length - 1] };
}
const ROADS = { highway: table(HIGHWAY), hero: table(HERO) };

/** Position and heading at a fraction of a path, with an optional sideways lane offset. */
function pose(road: keyof typeof ROADS, f: number, lane = 0) {
  const { pts, len, total } = ROADS[road];
  const target = Math.min(Math.max(f, 0), 1) * total;
  let i = 1;
  while (i < len.length - 1 && len[i] < target) i++;
  const span = len[i] - len[i - 1] || 1;
  const k = (target - len[i - 1]) / span;
  const a = pts[i - 1];
  const b = pts[i];
  const x = a[0] + (b[0] - a[0]) * k;
  const y = a[1] + (b[1] - a[1]) * k;
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return { x: x - Math.sin(angle) * lane, y: y + Math.cos(angle) * lane, deg: (angle * 180) / Math.PI };
}

/* ---------- Traffic: [from, to] along the road for each of the four steps ---------- */
type Car = { road: keyof typeof ROADS; lane: number; hero?: boolean; moves: [number, number][] };
const CARS: Car[] = [
  { road: "highway", lane: 4, moves: [[0, 0.45], [0.45, 0.95], [0, 0.5], [0.5, 1]] },
  { road: "highway", lane: -4, moves: [[1, 0.55], [0.55, 0.05], [1, 0.5], [0.5, 0]] },
  { road: "highway", lane: 4, moves: [[0.55, 1], [0, 0.45], [0.45, 0.95], [0, 0.5]] },
  { road: "highway", lane: -4, moves: [[0.4, 0], [1, 0.6], [0.6, 0.15], [1, 0.6]] },
  { road: "hero", lane: 0, hero: true, moves: [[0, 0.28], [0.28, 0.52], [0.52, 1], [1, 1]] },
];
const DRIVE_MS = 2600;

function transform(car: Car, f: number) {
  const { x, y, deg } = pose(car.road, f, car.lane);
  return `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`;
}

/**
 * Cars render at the end of the step (server HTML, no JavaScript and reduced
 * motion all show that). On each step, a short finite drive runs from the
 * step's start to its end, written straight to the elements' CSS transform.
 */
function Traffic({ stage }: { stage: number }) {
  const refs = useRef<(SVGGElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const els = refs.current;
    if (reduced) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DRIVE_MS, 1);
      CARS.forEach((car, i) => {
        const el = els[i];
        if (!el) return;
        const [from, to] = car.moves[stage];
        const e = car.hero ? (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) : t;
        const { x, y, deg } = pose(car.road, from + (to - from) * e, car.lane);
        el.style.transform = `translate(${x}px, ${y}px) rotate(${deg}deg)`;
      });
      if (t < 1) frame = requestAnimationFrame(tick);
      else els.forEach((el) => el && (el.style.transform = ""));
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      els.forEach((el) => el && (el.style.transform = ""));
    };
  }, [stage, reduced]);

  return (
    <g>
      {CARS.map((car, i) => (
        <g
          key={i}
          ref={(node) => {
            refs.current[i] = node;
          }}
          transform={transform(car, car.moves[stage][1])}
          className={car.hero ? s.hero : s.car}
        >
          <rect x="-7" y="-3.8" width="14" height="7.6" rx="2.2" />
          <rect x="1.5" y="-2.8" width="3.2" height="5.6" rx="1" className={s.glass} />
        </g>
      ))}
    </g>
  );
}

/** Billboard exposure on the drive, then the trip to the store it advertises. */
export function OutdoorJourney() {
  return (
    <JourneyFrame
      industry="outdoor"
      title="Seen on the drive. Remembered at the store."
      lead="A billboard near your store reaches people who pass it every day, so your name is familiar when they’re ready to buy."
      summary="Illustration: traffic passes your billboard on the highway inside a local viewing area; one driver sees it, takes the exit, follows the route to your store nearby and visits."
      side="right"
      story="list"
      steps={[
        { label: "Drive past", body: "Your billboard sits on a route people already travel, near your store." },
        { label: "See it", body: "Drivers see it again and again as part of their day." },
        { label: "Head over", body: "When the need comes up, yours is the name they remember." },
        { label: "Visit", body: "With search and social, outdoor can help turn exposure into visits." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <svg className={p.map} viewBox="0 0 440 330" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <MapBase kind="highway" />
            {/* Where the board can be seen from the road: illustrative — large to dramatize local reach */}
            <circle cx="150" cy="155" r="138" className={s.zone} data-lit={stage >= 1} />
            <text x="150" y="28" textAnchor="middle" className={s.zoneLabel}>
              Billboard viewing area
            </text>
            <Route d={EXIT_ROUTE} on={stage >= 2} />
            <MapPin x={356} y={140} label="Your store" />
            <Traffic stage={stage} />
            {/* The billboard: structure, lit face and a pin */}
            <g className={s.board} data-lit={stage >= 1}>
              <rect x="135.5" y="142" width="3" height="18" fill="#6b6d68" />
              <rect x="112" y="118" width="50" height="26" rx="2" fill="#2a2a28" />
              <rect x="114" y="120" width="46" height="22" rx="1" fill="#d93b30" />
              <text x="137" y="134" textAnchor="middle" className={s.boardText}>
                YOUR BRAND
              </text>
            </g>
          </svg>

          {/* The board as the driver sees it */}
          <span className={s.creative} {...on(stage, 1)}>
            <span className={s.creativeImage}>
              <Photo src={CREATIVE} position="50% 45%" />
            </span>
            <span className={s.creativeText}>
              <b>Your billboard</b>
              <small>Highway 1 · seen on the drive in</small>
            </span>
          </span>

          {/* The store at the end of the route */}
          <span className={`${p.place} ${s.store}`} {...on(stage, 2)}>
            <span className={p.thumb}>
              <Photo src={STORE} position="60% 50%" />
            </span>
            <span className={p.info}>
              <b>Your store</b>
              <small>Main St · 4 min away</small>
              <small>{stage >= 3 ? <span className={p.open}>Visited today</span> : <span className={p.open}>Open now</span>}</small>
            </span>
          </span>
          <span className={`${p.note} ${s.note}`}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
