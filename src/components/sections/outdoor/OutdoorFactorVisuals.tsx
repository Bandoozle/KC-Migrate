import { MapBase, MapPin } from "@/components/industry/journeys/LocalMap";
import s from "./OutdoorFactorVisuals.module.css";

/* Billboard placements on the routes past the store, in MapBase("highway") coordinates */
const PLACEMENTS = [
  { x: 137, y: 132 },
  { x: 290, y: 92 },
  { x: 262, y: 226 },
];

function Billboard({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-1.2" y="5" width="2.4" height="9" fill="#6b6d68" />
      <rect x="-13" y="-8" width="26" height="14" rx="1.5" fill="#2a2a28" />
      <rect x="-11.5" y="-6.5" width="23" height="11" rx="1" fill="#d93b30" />
    </g>
  );
}

/** Location: a real map crop with the store, its local area and three placements on the routes past it. */
export function LocationVisual() {
  return (
    <svg className={s.svg} viewBox="40 50 380 214" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <MapBase kind="highway" />
      <circle cx="300" cy="152" r="86" className={s.area} />
      <text x="300" y="61" textAnchor="middle" className={s.areaLabel}>
        Near your store
      </text>
      {PLACEMENTS.map((p) => (
        <Billboard key={`${p.x}-${p.y}`} {...p} />
      ))}
      <MapPin x={356} y={140} label="Your store" />
      <g transform="translate(48 236)">
        <rect width="148" height="22" rx="11" fill="#ffffff" className={s.legend} />
        <g transform="translate(16 11) scale(0.6)">
          <rect x="-13" y="-8" width="26" height="14" rx="1.5" fill="#2a2a28" />
          <rect x="-11.5" y="-6.5" width="23" height="11" rx="1" fill="#d93b30" />
        </g>
        <text x="30" y="14.5" className={s.legendText}>
          Billboard on a daily route
        </text>
      </g>
    </svg>
  );
}

/* An illustrative weekday traffic pattern, 6 AM to 10 PM: two commute peaks, a quieter midday */
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const LEVEL = [0.22, 0.68, 0.95, 0.72, 0.46, 0.42, 0.5, 0.46, 0.43, 0.56, 0.8, 0.98, 0.76, 0.52, 0.38, 0.3, 0.22];
const X0 = 28;
const X1 = 384;
const TOP = 60;
const BASE = 140;
const hx = (h: number) => X0 + ((h - 6) / 16) * (X1 - X0);
const ly = (v: number) => BASE - v * (BASE - TOP);

/** A smooth curve through the points (Catmull-Rom as cubic Béziers). */
function smooth(points: Array<[number, number]>) {
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
const POINTS = HOURS.map((h, i) => [hx(h), ly(LEVEL[i])] as [number, number]);
const LINE = smooth(POINTS);
const AREA = `${LINE} L ${X1} ${BASE} L ${X0} ${BASE} Z`;
const PEAKS = [
  { from: 7, to: 9.5, label: "AM commute" },
  { from: 15.5, to: 18.5, label: "PM commute" },
];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Timing: when traffic peaks through the day, and a flight weighted to the days that matter. */
export function TimingVisual() {
  return (
    <svg className={s.svg} viewBox="0 0 400 225" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      <rect width="400" height="225" fill="#ffffff" />
      <text x="16" y="24" className={s.title}>
        Traffic through the day
      </text>
      <rect x="318" y="12" width="68" height="17" rx="8.5" className={s.tag} />
      <text x="352" y="24" textAnchor="middle" className={s.tagText}>
        Illustrative
      </text>

      {PEAKS.map((peak) => (
        <g key={peak.label}>
          <rect x={hx(peak.from)} y={TOP - 8} width={hx(peak.to) - hx(peak.from)} height={BASE - TOP + 8} className={s.peak} />
          <text x={(hx(peak.from) + hx(peak.to)) / 2} y={TOP - 12} textAnchor="middle" className={s.peakLabel}>
            {peak.label}
          </text>
        </g>
      ))}
      <path d={AREA} className={s.fill} />
      <path d={LINE} className={s.line} />
      <line x1={X0} x2={X1} y1={BASE} y2={BASE} className={s.axis} />
      {[
        [6, "6 AM"],
        [12, "Noon"],
        [18, "6 PM"],
        [22, "10 PM"],
      ].map(([h, label]) => (
        <text key={label} x={hx(h as number)} y={BASE + 13} textAnchor={h === 6 ? "start" : h === 22 ? "end" : "middle"} className={s.tick}>
          {label}
        </text>
      ))}

      <text x="16" y="186" className={s.title}>
        Flight
      </text>
      {DAYS.map((day, i) => {
        const x = 64 + i * 46;
        const weekend = i > 4;
        return (
          <g key={`${day}-${i}`}>
            <rect x={x} y="170" width="40" height="24" rx="5" className={weekend ? s.dayLight : s.day} />
            <text x={x + 20} y="186" textAnchor="middle" className={weekend ? s.dayTextLight : s.dayText}>
              {day}
            </text>
          </g>
        );
      })}
      <text x="64" y="212" className={s.tick}>
        Weekdays booked for commutes, lighter weekends
      </text>
    </svg>
  );
}
