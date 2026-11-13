"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import styles from "./EmailDistribution.module.css";

/*
 * One campaign → many devices → the message arrives.
 *
 * The visual is one SVG timeline (SMIL), so it scales as a drawing, pauses and
 * rewinds natively, and needs no animation library. Every animation freezes on
 * its final frame, so without JavaScript the page shows the delivered network.
 * JavaScript holds it at the start until it scrolls into view, pauses it off
 * screen, loops it, and pins reduced motion to the final frame.
 */

const HERO = "/images/email/campaign-hero.jpg";

/* Timeline, in seconds */
const CURSOR_IN = 0.2;
const PRESS = 0.95;
const PATHS = 1.3;
const PATH_STAGGER = 0.14;
const DEVICES = 1.45;
const DEVICE_STAGGER = 0.14;
const TRAVEL = 2.05;
const TRAVEL_STAGGER = 0.38;
const TRAVEL_DUR = 1.15;
/** Long enough after the last delivery to take in the finished network. */
const LOOP_AT = 10.5;
const FADE_MS = 450;

type DeviceKind = "phone" | "laptop" | "tablet";
type Point = readonly [number, number];
type Device = {
  kind: DeviceKind;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Where the path leaves the campaign card. */
  from: Point;
  /** Where the path meets the device. */
  to: Point;
  /** Notification toast position, top-left. */
  chip?: Point;
};
type Layout = {
  id: "wide" | "compact";
  width: number;
  height: number;
  card: Point;
  /** Paths leave the card sideways (wide) or downwards (compact). */
  axis: "x" | "y";
  devices: Device[];
  /** Delivery order, alternating sides so it never reads as a list. */
  order: number[];
};

const WIDE: Layout = {
  id: "wide",
  width: 640,
  height: 470,
  card: [222, 84],
  axis: "x",
  devices: [
    { kind: "phone", x: 70, y: 30, w: 56, h: 108, from: [222, 170], to: [126, 84], chip: [34, 112] },
    { kind: "laptop", x: 12, y: 206, w: 128, h: 80, from: [222, 236], to: [140, 246], chip: [20, 244] },
    { kind: "tablet", x: 58, y: 350, w: 110, h: 78, from: [222, 304], to: [168, 389], chip: [52, 404] },
    { kind: "tablet", x: 474, y: 36, w: 110, h: 78, from: [418, 170], to: [474, 75], chip: [470, 90] },
    { kind: "laptop", x: 500, y: 206, w: 128, h: 80, from: [418, 236], to: [500, 246], chip: [506, 244] },
    { kind: "phone", x: 514, y: 336, w: 56, h: 108, from: [418, 304], to: [514, 390], chip: [480, 418] },
  ],
  order: [0, 4, 2, 3, 1, 5],
};

const COMPACT: Layout = {
  id: "compact",
  width: 340,
  height: 470,
  card: [72, 6],
  axis: "y",
  devices: [
    { kind: "phone", x: 16, y: 352, w: 52, h: 100, from: [140, 302], to: [42, 352] },
    { kind: "laptop", x: 112, y: 366, w: 116, h: 72, from: [170, 302], to: [170, 366] },
    { kind: "tablet", x: 250, y: 374, w: 80, h: 60, from: [200, 302], to: [290, 374] },
  ],
  order: [1, 0, 2],
};

const CARD_W = 196;
const CARD_H = 296;

function sendAt(index: number) {
  return TRAVEL + index * TRAVEL_STAGGER;
}
function arriveAt(index: number) {
  return sendAt(index) + TRAVEL_DUR;
}
function lastArrival(layout: Layout) {
  return arriveAt(layout.devices.length - 1);
}

function curve(layout: Layout, device: Device) {
  const [x0, y0] = device.from;
  const [x1, y1] = device.to;
  if (layout.axis === "x") {
    const dx = (x1 - x0) * 0.55;
    return `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y1}, ${x1} ${y1}`;
  }
  const dy = (y1 - y0) * 0.6;
  return `M ${x0} ${y0} C ${x0} ${y0 + dy}, ${x1} ${y1 - dy}, ${x1} ${y1}`;
}

const EASE = "0.45 0 0.2 1";
const s = (seconds: number) => `${seconds.toFixed(2)}s`;

/** Fade (and optionally lift) a group in at `begin`, frozen visible. */
function FadeIn({ begin, dur = 0.45, lift = 0 }: { begin: number; dur?: number; lift?: number }) {
  return (
    <>
      <animate attributeName="opacity" values="0;1" dur={s(dur)} begin={s(begin)} fill="freeze" calcMode="spline" keyTimes="0;1" keySplines={EASE} />
      {lift ? (
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`0 ${lift};0 0`}
          additive="sum"
          dur={s(dur)}
          begin={s(begin)}
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines={EASE}
        />
      ) : null}
    </>
  );
}

/** Visible only between two times. The outgoing state fades before the next one arrives, so text never overlaps. */
function Between({ from, to, children }: { from: number; to?: number; children: ReactNode }) {
  return (
    <g opacity={from === 0 ? 1 : 0}>
      {from > 0 ? <animate attributeName="opacity" values="0;1" dur="0.2s" begin={s(from + 0.16)} fill="freeze" /> : null}
      {to !== undefined ? <animate attributeName="opacity" values="1;0" dur="0.16s" begin={s(to)} fill="freeze" /> : null}
      {children}
    </g>
  );
}

function EnvelopeGlyph({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <rect x="-8" y="-5.5" width="16" height="11" rx="2" fill="#ffffff" stroke="#c9a46f" strokeWidth="1" />
      <path d="M -7 -4.2 L 0 1 L 7 -4.2" fill="none" stroke="#c9a46f" strokeWidth="1" strokeLinejoin="round" />
    </g>
  );
}

/** The campaign, as it looks in an email platform just before sending. */
function CampaignCard({ uid, layout }: { uid: string; layout: Layout }) {
  const [cx, cy] = layout.card;
  const total = layout.devices.length;
  const done = lastArrival(layout) + 0.1;
  const bx = 12;
  const bw = CARD_W - 24;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <rect width={CARD_W} height={CARD_H} rx="14" fill="#ffffff" filter={`url(#${uid}-lift)`} />
      <rect width={CARD_W} height={CARD_H} rx="14" fill="none" stroke="rgba(21,18,15,0.08)" />

      {/* Header: campaign name, audience, status */}
      <text x="14" y="24" className={styles.cardTitle}>
        New season launch
      </text>
      <text x="14" y="38" className={styles.cardMeta}>
        To: All subscribers
      </text>
      <g className={styles.dynamic}>
        <Between from={0} to={PRESS}>
          <rect x={CARD_W - 76} y="13" width="62" height="18" rx="9" fill="#f4efe7" />
          <text x={CARD_W - 45} y="25.5" textAnchor="middle" className={styles.pill}>
            Ready
          </text>
        </Between>
        <Between from={PRESS} to={done}>
          <rect x={CARD_W - 76} y="13" width="62" height="18" rx="9" fill="#f6ead6" />
          <text x={CARD_W - 45} y="25.5" textAnchor="middle" className={styles.pill} fill="#8a6a3e">
            Sending
          </text>
        </Between>
        <Between from={done}>
          <rect x={CARD_W - 76} y="13" width="62" height="18" rx="9" fill="#e6efe2" />
          <text x={CARD_W - 45} y="25.5" textAnchor="middle" className={styles.pill} fill="#3f6a3a">
            Delivered
          </text>
        </Between>
      </g>
      <line x1="0" x2={CARD_W} y1="50" y2="50" stroke="rgba(21,18,15,0.08)" />

      {/* The email itself */}
      <g transform="translate(12 60)">
        <rect width={bw} height="152" rx="8" fill="#fbf8f3" stroke="rgba(21,18,15,0.06)" />
        <circle cx={bw / 2 - 30} cy="12" r="3.2" fill="#15120f" />
        <text x={bw / 2 + 4} y="14.6" textAnchor="middle" className={styles.brand}>
          YOUR BRAND
        </text>
        <clipPath id={`${uid}-hero`}>
          <rect x="8" y="24" width={bw - 16} height="58" rx="4" />
        </clipPath>
        <image href={HERO} x="8" y="24" width={bw - 16} height="58" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-hero)`} />
        <text x="10" y="100" className={styles.headline}>
          The new season edit
        </text>
        <text x="10" y="113" className={styles.bodyText}>
          Fresh arrivals, picked for you.
        </text>
        <rect x="10" y="123" width="70" height="18" rx="9" fill="#15120f" />
        <text x="45" y="135" textAnchor="middle" className={styles.cta}>
          Shop now
        </text>
      </g>

      {/* Send button, pressed by the cursor */}
      <g transform={`translate(${CARD_W / 2} 241)`}>
        <g>
          <animateTransform attributeName="transform" type="scale" additive="sum" values="1;0.95;1" keyTimes="0;0.4;1" dur="0.3s" begin={s(PRESS)} fill="freeze" />
          <rect x={-bw / 2} y="-15" width={bw} height="30" rx="15" fill="#15120f" />
          <g className={styles.dynamic}>
            <Between from={0} to={PRESS + 0.1}>
              <text y="3.8" textAnchor="middle" className={styles.button}>
                Send campaign
              </text>
            </Between>
            <Between from={PRESS + 0.1} to={done}>
              <text y="3.8" textAnchor="middle" className={styles.button}>
                Sending…
              </text>
            </Between>
            <Between from={done}>
              <text y="3.8" textAnchor="middle" className={styles.button}>
                Sent
              </text>
            </Between>
          </g>
        </g>
      </g>

      {/* Delivery progress */}
      <rect x={bx} y="266" width={bw} height="3" rx="1.5" fill="#efe8dd" />
      <g className={styles.dynamic}>
        <rect x={bx} y="266" width="0" height="3" rx="1.5" fill="#c9a46f">
          <animate attributeName="width" values={`0;${bw}`} dur={s(lastArrival(layout) - PRESS)} begin={s(PRESS + 0.1)} fill="freeze" />
        </rect>
      </g>
      <g className={styles.dynamic}>
        {Array.from({ length: total + 1 }, (_, count) => (
          <Between key={count} from={count === 0 ? 0 : arriveAt(count - 1)} to={count < total ? arriveAt(count) : undefined}>
            <text x={bx} y="284" className={styles.cardMeta}>
              {count} of {total} delivered
            </text>
          </Between>
        ))}
      </g>

      {/* Cursor glides in and clicks Send */}
      {/* CSS fades only wrappers that the timeline itself never animates */}
      <g className={styles.dynamic}>
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.75;1" dur="1.5s" begin={s(CURSOR_IN)} fill="freeze" />
        <animateMotion
          path={`M ${CARD_W + 30} 300 Q ${CARD_W - 10} 270 ${CARD_W / 2 + 34} 246`}
          dur={s(PRESS - CURSOR_IN)}
          begin={s(CURSOR_IN)}
          fill="freeze"
          calcMode="spline"
          keyPoints="0;1"
          keyTimes="0;1"
          keySplines={EASE}
        />
        <path d="M0 0 L0 15 L4 11.5 L7 18 L9.5 17 L6.5 10.5 L11.5 10.5 Z" fill="#15120f" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
      </g>
      </g>
    </g>
  );
}

function screenOf(device: Device) {
  const { kind, x, y, w, h } = device;
  if (kind === "phone") return { sx: x + 3.5, sy: y + 3.5, sw: w - 7, sh: h - 7, r: w * 0.14 };
  if (kind === "tablet") return { sx: x + 5, sy: y + 5, sw: w - 10, sh: h - 10, r: 4 };
  return { sx: x + 5, sy: y + 5, sw: w - 10, sh: h - 10, r: 2 };
}

function DeviceShape({ uid, device, index, arrive, chips }: { uid: string; device: Device; index: number; arrive: number; chips: boolean }) {
  const { kind, x, y, w, h } = device;
  const { sx, sy, sw, sh, r } = screenOf(device);
  const clip = `${uid}-screen-${index}`;
  return (
    <g>
      {kind === "laptop" ? (
        <path d={`M ${x - 10} ${y + h} L ${x + w + 10} ${y + h} L ${x + w + 4} ${y + h + 8} L ${x - 4} ${y + h + 8} Z`} fill="#d6cdbf" />
      ) : null}
      <rect x={x} y={y} width={w} height={h} rx={kind === "phone" ? w * 0.2 : kind === "tablet" ? 8 : 6} fill="#1d1915" />
      <rect x={sx} y={sy} width={sw} height={sh} rx={r} fill="#2b2621" />
      {kind === "phone" ? <rect x={x + w / 2 - 7} y={y + 6} width="14" height="3.5" rx="1.75" fill="#15120f" /> : null}

      {/* The screen wakes when the email lands: a small rendering of the same email */}
      <g opacity="0">
        <FadeIn begin={arrive} dur={0.35} />
        <clipPath id={clip}>
          <rect x={sx} y={sy} width={sw} height={sh} rx={r} />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect x={sx} y={sy} width={sw} height={sh} fill="#fbf8f3" />
          <image href={HERO} x={sx} y={sy + (kind === "phone" ? 12 : 0)} width={sw} height={sh * 0.4} preserveAspectRatio="xMidYMid slice" />
          <rect x={sx + 5} y={sy + sh * 0.56 + (kind === "phone" ? 6 : 0)} width={sw * 0.62} height={Math.max(2.5, sh * 0.06)} rx="1" fill="#2a2520" />
          <rect x={sx + 5} y={sy + sh * 0.68 + (kind === "phone" ? 6 : 0)} width={sw * 0.78} height={Math.max(2, sh * 0.04)} rx="1" fill="#cfc5b6" />
          <rect x={sx + 5} y={sy + sh * 0.78 + (kind === "phone" ? 6 : 0)} width={sw * 0.34} height={Math.max(3, sh * 0.08)} rx="2" fill="#15120f" />
        </g>
      </g>

      {chips && device.chip ? (
        <g opacity="0" transform={`translate(${device.chip[0]} ${device.chip[1]})`}>
          <FadeIn begin={arrive + 0.12} dur={0.4} lift={5} />
          <rect width="120" height="34" rx="9" fill="#ffffff" filter={`url(#${uid}-chip)`} />
          <circle cx="17" cy="17" r="10" fill="#f6ead6" />
          <EnvelopeGlyph x={17} y={17} size={0.72} />
          <text x="33" y="14.5" className={styles.chipFrom}>
            Your brand · now
          </text>
          <text x="33" y="26.5" className={styles.chipSubject}>
            The new season edit
          </text>
        </g>
      ) : (
        <g opacity="0">
          <FadeIn begin={arrive + 0.12} dur={0.35} />
          <circle cx={x + w - 2} cy={y + 2} r="8" fill="#3f6a3a" stroke="#ffffff" strokeWidth="2" />
          <path d={`M ${x + w - 5.5} ${y + 2} l 2.4 2.4 l 4.6 -4.8`} fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

function Scene({ layout }: { layout: Layout }) {
  const uid = `${useId().replace(/:/g, "")}-${layout.id}`;
  const chips = layout.axis === "x";
  // Deliveries happen in `order`; position i in the order sets the timing
  const slot = new Map(layout.order.map((device, position) => [device, position]));
  return (
    <svg className={`${styles.svg} ${styles[layout.id]}`} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${uid}-lift`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#15120f" floodOpacity="0.12" />
        </filter>
        <filter id={`${uid}-chip`} x="-20%" y="-40%" width="140%" height="200%">
          <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#15120f" floodOpacity="0.14" />
        </filter>
        <linearGradient id={`${uid}-route`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#c9a46f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8a6a3e" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <g className={styles.network}>
        {layout.devices.map((device, index) => {
          const position = slot.get(index) ?? index;
          return (
            <path
              key={`p${index}`}
              d={curve(layout, device)}
              pathLength={1}
              fill="none"
              stroke="#c9a46f"
              strokeOpacity="0.7"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray="1"
              strokeDashoffset="1"
            >
              <animate attributeName="stroke-dashoffset" values="1;0" dur="0.8s" begin={s(PATHS + position * PATH_STAGGER)} fill="freeze" calcMode="spline" keyTimes="0;1" keySplines={EASE} />
            </path>
          );
        })}

        {layout.devices.map((device, index) => {
          const position = slot.get(index) ?? index;
          return (
            <g key={`d${index}`} opacity="0">
              <FadeIn begin={DEVICES + position * DEVICE_STAGGER} dur={0.5} lift={6} />
              <DeviceShape uid={uid} device={device} index={index} arrive={arriveAt(position)} chips={chips} />
            </g>
          );
        })}

        {/* Each email travels its path, then lands with one soft ring */}
        {layout.devices.map((device, index) => {
          const position = slot.get(index) ?? index;
          const begin = sendAt(position);
          return (
            <g key={`t${index}`}>
              <circle cx={device.to[0]} cy={device.to[1]} r="4" fill="none" stroke="#c9a46f" strokeWidth="1.2" opacity="0">
                <animate attributeName="r" values="4;18" dur="0.7s" begin={s(arriveAt(position))} fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0.6 0.3 1" />
                <animate attributeName="opacity" values="0.7;0" dur="0.7s" begin={s(arriveAt(position))} fill="freeze" />
              </circle>
              <g opacity="0">
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur={s(TRAVEL_DUR)} begin={s(begin)} fill="freeze" />
                <animateMotion
                  path={curve(layout, device)}
                  dur={s(TRAVEL_DUR)}
                  begin={s(begin)}
                  fill="freeze"
                  calcMode="spline"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  keySplines={EASE}
                />
                <g filter={`url(#${uid}-chip)`}>
                  <EnvelopeGlyph x={0} y={0} />
                </g>
              </g>
            </g>
          );
        })}
      </g>

      <CampaignCard uid={uid} layout={layout} />
    </svg>
  );
}

/** Rendered once: React never touches the timeline after mount. */
const Visual = memo(function Visual() {
  return (
    <>
      <Scene layout={WIDE} />
      <Scene layout={COMPACT} />
    </>
  );
});

const subscribeNever = () => () => {};

const PHASES = ["Compose", "Send", "Deliver"] as const;

function phaseAt(time: number) {
  if (time < PRESS) return 0;
  if (time < lastArrival(WIDE)) return 1;
  return 2;
}

export function EmailDistribution() {
  const figureRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [phase, setPhase] = useState(0);
  // Server HTML and the frozen SMIL end frame agree: the delivered network
  const hydrated = useSyncExternalStore(subscribeNever, () => true, () => false);
  const shownPhase = !hydrated || reduced ? 2 : phase;
  const resetTimer = useRef<number | null>(null);

  const svgs = useCallback(() => [...(figureRef.current?.querySelectorAll("svg") ?? [])] as SVGSVGElement[], []);

  // Hold the timeline at the start (or the end, for reduced motion) once mounted
  useEffect(() => {
    const list = svgs();
    const end = lastArrival(WIDE) + 1;
    list.forEach((svg) => {
      svg.pauseAnimations();
      svg.setCurrentTime(reduced ? end : 0);
    });
  }, [reduced, svgs]);

  useEffect(() => {
    const node = figureRef.current;
    if (!node || reduced) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const restart = useCallback(() => {
    setResetting(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      svgs().forEach((svg) => svg.setCurrentTime(0));
      setPhase(0);
      setResetting(false);
      resetTimer.current = null;
    }, FADE_MS);
  }, [svgs]);

  const running = inView && !paused && !reduced;

  useEffect(() => {
    const list = svgs();
    if (!running) {
      list.forEach((svg) => svg.pauseAnimations());
      return;
    }
    list.forEach((svg) => svg.unpauseAnimations());
    const id = window.setInterval(() => {
      const time = list[0]?.getCurrentTime() ?? 0;
      setPhase(phaseAt(time));
      if (time >= LOOP_AT && !resetTimer.current) restart();
    }, 150);
    return () => window.clearInterval(id);
  }, [running, restart, svgs]);

  useEffect(() => () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="em-distribution">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <p className={styles.label}>Email distribution</p>
          <h2 id="em-distribution" className={styles.title}>
            One campaign. Countless connections.
          </h2>
          <p className={styles.lead}>
            Reach your audience with coordinated email campaigns that deliver the right message across inboxes and
            devices.
          </p>
          <ol className={styles.phases} aria-label="Campaign stages">
            {PHASES.map((name, index) => (
              <li key={name} data-state={index < shownPhase ? "done" : index === shownPhase ? "active" : "next"}>
                <span className={styles.phaseIndex}>{String(index + 1).padStart(2, "0")}</span>
                {name}
              </li>
            ))}
          </ol>
          {!reduced ? (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.control}
                onClick={() => {
                  setPaused(false);
                  restart();
                }}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
                  <path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3M3.5 2.5v2.6h2.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Replay
              </button>
              <button type="button" className={styles.control} onClick={() => setPaused((value) => !value)}>
                <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d={paused ? "M2 1l9 5-9 5z" : "M2 1h3v10H2zM7 1h3v10H7z"} />
                </svg>
                {paused ? "Play" : "Pause"}
              </button>
            </div>
          ) : null}
        </div>

        <div
          ref={figureRef}
          className={styles.stage}
          role="img"
          aria-label="One email campaign is sent, travels along curved paths to phones, laptops and tablets and each device shows the new message as it arrives."
          data-resetting={resetting || undefined}
        >
          <Visual />
        </div>
      </div>
    </section>
  );
}
