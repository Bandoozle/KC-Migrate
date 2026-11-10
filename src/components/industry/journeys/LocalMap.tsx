import type { ReactNode } from "react";
import kit from "./kit.module.css";
import p from "./places.module.css";

/*
 * Shared parts for the "search → map → action → visit" journeys, after the
 * Specialty Retail graphic: a believable local map, pins, a map-app search bar,
 * a place card with real actions, a booking sheet and a check-in card.
 * Everything is drawn at the scene's own scale (about 440 × 330).
 */

export type MapKind = "city" | "suburb" | "golf" | "highway";

const ROAD = "#ffffff";
const CASING = "#dcdcd4";

function Roads({ d, width }: { d: string; width: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={CASING} strokeWidth={width + 2} />
      <path d={d} stroke={ROAD} strokeWidth={width} />
    </g>
  );
}

function Label({ x, y, children, rotate = 0 }: { x: number; y: number; children: ReactNode; rotate?: number }) {
  return (
    <text x={x} y={y} className={p.street} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>
      {children}
    </text>
  );
}

/** A quiet, realistic base map. Overlays (routes, pins) are drawn by each journey. */
export function MapBase({ kind }: { kind: MapKind }) {
  if (kind === "golf") {
    return (
      <g>
        <rect width="440" height="330" fill="#eef0e8" />
        {/* The course: rough, fairways, greens, bunkers and a pond */}
        <path d="M150 20 C 250 0, 420 10, 440 60 V 260 C 380 300, 260 300, 200 250 C 150 210, 120 120, 150 20 Z" fill="#cfe2bd" />
        <g fill="#b9d8a2">
          <path d="M185 70 C 230 50, 300 52, 340 70 C 350 82, 330 96, 300 92 C 260 86, 220 92, 192 92 C 176 90, 172 76, 185 70 Z" />
          <path d="M210 150 C 260 130, 360 128, 400 150 C 410 164, 392 176, 360 172 C 310 168, 260 178, 222 176 C 202 174, 198 158, 210 150 Z" />
          <path d="M240 222 C 280 210, 340 214, 372 230 C 380 242, 364 252, 340 248 C 300 244, 270 250, 250 246 C 232 244, 228 228, 240 222 Z" />
        </g>
        <g fill="#a3cf8a">
          <circle cx="348" cy="76" r="11" />
          <circle cx="404" cy="160" r="11" />
          <circle cx="378" cy="236" r="10" />
        </g>
        <g fill="#efe3c2">
          <ellipse cx="326" cy="98" rx="8" ry="4" />
          <ellipse cx="388" cy="178" rx="9" ry="4" />
        </g>
        <path d="M300 186 C 320 182, 340 192, 336 204 C 332 214, 306 214, 296 206 C 288 198, 290 188, 300 186 Z" fill="#bcd9e8" />
        <rect x="160" y="196" width="30" height="20" rx="2" fill="#dcd7cb" />
        {/* Town to the west */}
        <g fill="#e2e2da">
          <rect x="14" y="30" width="46" height="40" rx="2" />
          <rect x="70" y="30" width="40" height="40" rx="2" />
          <rect x="14" y="120" width="46" height="46" rx="2" />
          <rect x="70" y="120" width="40" height="46" rx="2" />
          <rect x="14" y="214" width="46" height="44" rx="2" />
          <rect x="70" y="214" width="40" height="44" rx="2" />
        </g>
        <Roads d="M0 98 H 128 C 140 98, 146 110, 150 130 C 156 170, 160 190, 175 206" width={8} />
        <Roads d="M118 0 V 330" width={6} />
        <Roads d="M0 190 H 118" width={6} />
        <Label x={20} y={94}>Valley Rd</Label>
        <text x="175" y="232" className={p.poi}>Clubhouse</text>
      </g>
    );
  }
  if (kind === "highway") {
    return (
      <g>
        <rect width="440" height="330" fill="#eef0ea" />
        <path d="M0 0 H 120 C 100 60, 60 80, 0 92 Z" fill="#cfe3c2" />
        <path d="M330 250 C 380 240, 420 250, 440 270 V 330 H 300 C 300 290, 310 260, 330 250 Z" fill="#bcd9e8" />
        <g fill="#e2e2da">
          <rect x="180" y="18" width="56" height="44" rx="2" />
          <rect x="248" y="18" width="70" height="44" rx="2" />
          <rect x="330" y="18" width="96" height="44" rx="2" />
          <rect x="250" y="168" width="64" height="48" rx="2" />
          <rect x="330" y="168" width="96" height="48" rx="2" />
          <rect x="20" y="230" width="70" height="60" rx="2" />
          <rect x="104" y="230" width="66" height="60" rx="2" />
        </g>
        {/* Highway: wider, warmer, with a centre line */}
        <g fill="none" strokeLinecap="round">
          <path d="M-10 214 C 120 196, 200 120, 300 108 S 420 104, 450 100" stroke="#e7d9a6" strokeWidth="18" />
          <path d="M-10 214 C 120 196, 200 120, 300 108 S 420 104, 450 100" stroke="#f6ebc1" strokeWidth="15" />
          <path d="M-10 214 C 120 196, 200 120, 300 108 S 420 104, 450 100" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 7" />
        </g>
        <Roads d="M240 0 V 330" width={7} />
        <Roads d="M240 140 H 440" width={6} />
        <Roads d="M0 300 H 240" width={6} />
        <Label x={18} y={190} rotate={-8}>Highway 1</Label>
        <Label x={246} y={326} rotate={-90}>Main St</Label>
      </g>
    );
  }
  if (kind === "suburb") {
    return (
      <g>
        <rect width="440" height="330" fill="#eef0ea" />
        <path d="M320 0 H 440 V 90 C 400 96, 352 70, 320 40 Z" fill="#bcd9e8" />
        <rect x="24" y="190" width="120" height="80" rx="6" fill="#cfe3c2" />
        <g fill="#e2e2da">
          <rect x="24" y="24" width="56" height="50" rx="3" />
          <rect x="92" y="24" width="56" height="50" rx="3" />
          <rect x="176" y="24" width="60" height="50" rx="3" />
          <rect x="176" y="110" width="60" height="56" rx="3" />
          <rect x="268" y="110" width="70" height="56" rx="3" />
          <rect x="268" y="196" width="70" height="56" rx="3" />
          <rect x="360" y="130" width="70" height="60" rx="3" />
          <rect x="176" y="196" width="60" height="56" rx="3" />
        </g>
        <Roads d="M0 92 H 440" width={9} />
        <Roads d="M0 180 C 80 176, 120 170, 160 176 S 260 186, 300 182 S 400 176, 440 200" width={6} />
        <Roads d="M160 0 V 330" width={7} />
        <Roads d="M252 92 V 330" width={6} />
        <Roads d="M350 92 C 352 140, 348 220, 360 330" width={6} />
        <Label x={20} y={88}>Main St</Label>
        <Label x={166} y={318} rotate={-90}>Oak Ave</Label>
      </g>
    );
  }
  return (
    <g>
      <rect width="440" height="330" fill="#eef0ea" />
      <path d="M300 0 H 440 V 70 C 400 76, 356 58, 320 54 Z" fill="#bcd9e8" />
      <rect x="20" y="16" width="118" height="70" rx="3" fill="#cfe3c2" />
      <g fill="#e2e2da">
        <rect x="20" y="116" width="58" height="52" rx="2" />
        <rect x="90" y="116" width="54" height="52" rx="2" />
        <rect x="172" y="16" width="58" height="70" rx="2" />
        <rect x="242" y="56" width="62" height="30" rx="2" />
        <rect x="172" y="116" width="58" height="52" rx="2" />
        <rect x="242" y="116" width="62" height="52" rx="2" />
        <rect x="332" y="116" width="92" height="52" rx="2" />
        <rect x="20" y="198" width="124" height="60" rx="2" />
        <rect x="172" y="198" width="132" height="60" rx="2" />
        <rect x="332" y="198" width="92" height="60" rx="2" />
      </g>
      <Roads d="M0 101 H 440" width={9} />
      <Roads d="M0 183 H 440" width={9} />
      <Roads d="M158 0 V 330" width={7} />
      <Roads d="M318 54 V 330" width={7} />
      <Label x={20} y={97}>Main St</Label>
      <Label x={20} y={179}>King St</Label>
    </g>
  );
}

/** A map-app pin. `tone="you"` is the business; others are competitors, drawn quieter. */
export function MapPin({ x, y, tone = "you", label }: { x: number; y: number; tone?: "you" | "other"; label?: string }) {
  const fill = tone === "you" ? "var(--ind-accent)" : "#9aa0a6";
  const scale = tone === "you" ? 1 : 0.75;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 c-9-12-13-19-13-26 a13 13 0 0 1 26 0 c0 7-4 14-13 26Z" fill={fill} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="0" cy="-26" r="4.5" fill="#ffffff" />
      {label ? (
        <text x="16" y="-22" className={p.pinLabel}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** The searcher's own location: a blue dot with a soft halo. */
export function YouDot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill="#1a73e8" opacity="0.14" />
      <circle cx={x} cy={y} r="6" fill="#1a73e8" stroke="#ffffff" strokeWidth="2.5" />
    </g>
  );
}

/** A route drawn as the step arrives (kit.draw rewinds it while data-on is false). */
export function Route({ d, on }: { d: string; on: boolean }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" className={kit.draw} pathLength={1} data-on={on} />
      <path d={d} fill="none" stroke="#1a73e8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className={kit.draw} pathLength={1} data-on={on} />
    </g>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Icon({ name }: { name: "directions" | "call" | "book" | "check" | "clock" }) {
  const paths = {
    directions: "M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4ZM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5Z",
    call: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
    book: "M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2Zm-2 7h14v10H5Z",
    check: "m5 12.5 4.5 4.5L19 7.5",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm1 4v5.4l3.6 2.2-.9 1.5L11 13V7Z",
  } as const;
  const stroke = name === "check";
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true" focusable="false">
      <path
        d={paths[name]}
        fill={stroke ? "none" : "currentColor"}
        fillRule="evenodd"
        stroke={stroke ? "currentColor" : undefined}
        strokeWidth={stroke ? 2.6 : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The map app's search bar. */
export function SearchBar({ query }: { query: string }) {
  return (
    <span className={p.search}>
      <SearchIcon />
      <span className={p.query}>{query}</span>
      <span className={p.avatar} />
    </span>
  );
}
