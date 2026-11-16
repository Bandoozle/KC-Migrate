"use client";

import { useId, useState, useTransition } from "react";
import { TARGETING } from "@/content/google-ads-page";
import styles from "./TargetingStudio.module.css";
import { MAP_PX_PER_KM, VANCOUVER_MAP } from "./vancouver-map";

type IntentId = (typeof TARGETING.workspace.intent.groups)[number]["id"];

/* Map positions on the 640 × 420 canvas, projected from real coordinates (see vancouver-map.ts) */
const RADIUS_KM = 20;
const CENTRE = { x: 184, y: 182 };
const PINS = {
  vancouver: { x: CENTRE.x, y: CENTRE.y },
  burnaby: { x: 259, y: 191 },
  "north-van": { x: 204, y: 123 },
  abbotsford: { x: 602, y: 348 },
} as const;

function MapCanvas({ activeArea }: { activeArea: string }) {
  const { sea, boundaryBay, mountains, parks, rivers, highways, arterials, excluded } = VANCOUVER_MAP;
  const pin = (id: keyof typeof PINS) => `translate(${PINS[id].x} ${PINS[id].y})`;

  return (
    <svg className={styles.mapSvg} viewBox="0 0 640 420" role="img" aria-label="Service area map of Metro Vancouver">
      <defs>
        <pattern id="ga-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(66,133,244,0.06)" strokeWidth="1" />
        </pattern>
        <pattern id="ga-blocks" width="24" height="18" patternUnits="userSpaceOnUse">
          <rect x="2" y="3" width="9" height="6" rx="1" fill="rgba(14,23,38,0.03)" />
          <rect x="13" y="8" width="8" height="5" rx="1" fill="rgba(14,23,38,0.024)" />
        </pattern>
        <radialGradient id="ga-radius-fill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(66,133,244,0.26)" />
          <stop offset="70%" stopColor="rgba(66,133,244,0.12)" />
          <stop offset="100%" stopColor="rgba(66,133,244,0.04)" />
        </radialGradient>
        <filter id="ga-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(14,23,38,0.18)" />
        </filter>
      </defs>

      {/* Land */}
      <rect width="640" height="420" fill="#eef2f6" />
      <rect width="640" height="420" fill="url(#ga-blocks)" />
      <rect width="640" height="420" fill="url(#ga-map-grid)" />

      {/* North Shore, Coquitlam and Golden Ears mountains */}
      <g fill="#e2ebe1">
        {mountains.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
      <g fill="#d5e8d4">
        {parks.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>

      {/* Canada–US border at the 49th parallel */}
      <path d="M0 411.1H640" stroke="rgba(14,23,38,0.2)" strokeWidth="1.2" strokeDasharray="6 5" fill="none" />

      {/* Strait of Georgia, English Bay, Burrard Inlet, Indian Arm, Boundary Bay and the Fraser */}
      <g fill="#d4e4f4" stroke="#c3d7ec" strokeWidth="1">
        <path d={sea} />
        <path d={boundaryBay} />
      </g>
      <g fill="none" stroke="#d4e4f4" strokeLinecap="round" strokeLinejoin="round">
        <path d={rivers.main} strokeWidth="6" />
        <path d={rivers.north} strokeWidth="3.5" />
        <path d={rivers.middle} strokeWidth="2" />
        <path d={rivers.pitt} strokeWidth="3" />
      </g>

      {/* Hwy 1 and Hwy 99, then arterials (Kingsway, Lougheed, Hwy 91, King George, Fraser Hwy, Broadway) */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke="rgba(14,23,38,0.08)" strokeWidth="7">
          {highways.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>
        <g stroke="#ffffff" strokeWidth="3" opacity="0.95">
          {arterials.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>
        <g stroke="#ffffff" strokeWidth="5">
          {highways.map((d) => (
            <path key={d.slice(0, 24)} d={d} />
          ))}
        </g>
      </g>

      {/* Water names */}
      <g className={`${styles.mapLabels} ${styles.mapWater}`}>
        <text x="40" y="244" textAnchor="middle">
          <tspan x="40">Strait of</tspan>
          <tspan x="40" dy="13">Georgia</tspan>
        </text>
        <text x="112" y="146" textAnchor="middle">English Bay</text>
        <text x="270" y="149" textAnchor="middle" className={styles.mapLabelSmall}>
          Burrard Inlet
        </text>
        <text x="452" y="236" textAnchor="middle" transform="rotate(9 452 236)">
          Fraser River
        </text>
        <text x="306" y="396" textAnchor="middle">Boundary Bay</text>
      </g>

      {/* Municipalities without a targeting pin */}
      <g className={`${styles.mapLabels} ${styles.mapMinor}`} fill="rgba(14,23,38,0.4)" textAnchor="middle">
        <text x="112" y="100">West Vancouver</text>
        <text x="160" y="270">Richmond</text>
        <text x="204" y="334">Delta</text>
        <text x="372" y="302">Surrey</text>
        <text x="392" y="168">Coquitlam</text>
        <text x="482" y="322">Langley</text>
        <text x="510" y="196">Maple Ridge</text>
      </g>

      {/* Excluded area: Abbotsford, outside the service radius */}
      <path d={excluded} fill="rgba(14,23,38,0.05)" stroke="rgba(14,23,38,0.16)" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Service radius around the business in Vancouver */}
      <circle
        cx={CENTRE.x}
        cy={CENTRE.y}
        r={RADIUS_KM * MAP_PX_PER_KM}
        fill="url(#ga-radius-fill)"
        stroke="rgba(66,133,244,0.6)"
        strokeWidth="2"
        strokeDasharray="5 7"
      />

      {/* Targeted and excluded locations */}
      <g className={styles.mapLabels} fill="rgba(14,23,38,0.72)" textAnchor="middle">
        <text x={PINS.vancouver.x} y={PINS.vancouver.y + 30}>Vancouver</text>
        <text x={PINS.burnaby.x} y={PINS.burnaby.y + 30} className={styles.mapLabelBurnaby}>
          Burnaby
        </text>
        <text x={PINS["north-van"].x} y={PINS["north-van"].y - 24} className={styles.mapLabelNorthVan}>
          North Vancouver
        </text>
        <text x={PINS.abbotsford.x - 4} y={PINS.abbotsford.y - 24} className={styles.mapLabelAbbotsford}>
          Abbotsford
        </text>
      </g>
      {/* Position sits on the outer group; the inner group scales when active, so CSS never overrides the translate */}
      <g className={styles.mapPins}>
        {(["vancouver", "burnaby", "north-van"] as const).map((id) => (
          <g key={id} transform={pin(id)}>
            <g data-active={activeArea === id ? "true" : undefined}>
              <circle r="13" fill="#ffffff" filter="url(#ga-soft)" />
              <circle r="6.5" fill="#4285f4" />
            </g>
          </g>
        ))}
        <g transform={pin("abbotsford")}>
          <g className={styles.mapExcludedPin} data-active={activeArea === "abbotsford" ? "true" : undefined}>
            <circle r="12" fill="#ffffff" filter="url(#ga-soft)" />
            <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="#8b95a5" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/**
 * Interactive campaign targeting workspace: geo radius + search-intent explorer
 * in one product-style surface. Illustrative only — no performance claims.
 */
export function TargetingStudio() {
  const baseId = useId();
  const { workspace } = TARGETING;
  const [area, setArea] = useState(workspace.geo.included[0].id);
  const [intent, setIntent] = useState<IntentId>("ready");
  const [, startTransition] = useTransition();

  const activeGroup = workspace.intent.groups.find((group) => group.id === intent) ?? workspace.intent.groups[0];
  const activeLocation =
    workspace.geo.included.find((item) => item.id === area) ??
    workspace.geo.excluded.find((item) => item.id === area) ??
    workspace.geo.included[0];

  return (
    <div className={styles.studio} aria-label="Campaign targeting workspace">
      <header className={styles.chrome}>
        <div className={styles.chromeBrand}>
          <span className={styles.chromeMark} aria-hidden="true" />
          <div>
            <p className={styles.chromeTitle}>{workspace.title}</p>
            <p className={styles.chromeSub}>{workspace.subtitle}</p>
          </div>
        </div>
        <div className={styles.chromeMeta} role="presentation">
          <span>Locations</span>
          <span className={styles.chromeDot} aria-hidden="true" />
          <span>Keywords</span>
          <span className={styles.chromeDot} aria-hidden="true" />
          <span>Audience layers</span>
        </div>
      </header>

      <div className={styles.body}>
        <section className={styles.geo} aria-labelledby={`${baseId}-geo`}>
          <div className={styles.panelHead}>
            <h3 id={`${baseId}-geo`} className={styles.panelTitle}>
              {workspace.geo.title}
            </h3>
            <p className={styles.panelLead}>{workspace.geo.summary}</p>
          </div>

          <div className={styles.mapStage}>
            <MapCanvas activeArea={area} />
            <div className={styles.mapBadge}>{workspace.geo.radiusLabel}</div>
            <div className={styles.mapLegend} aria-hidden="true">
              <span data-kind="include">Included</span>
              <span data-kind="exclude">Excluded</span>
            </div>
          </div>

          <div className={styles.locationList} role="tablist" aria-label="Service areas">
            {workspace.geo.included.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${baseId}-area-${item.id}`}
                aria-selected={area === item.id}
                className={styles.locationChip}
                data-state="included"
                onClick={() => startTransition(() => setArea(item.id))}
              >
                <span className={styles.locationName}>{item.name}</span>
                <span className={styles.locationDetail}>{item.detail}</span>
              </button>
            ))}
            {workspace.geo.excluded.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${baseId}-area-${item.id}`}
                aria-selected={area === item.id}
                className={styles.locationChip}
                data-state="excluded"
                onClick={() => startTransition(() => setArea(item.id))}
              >
                <span className={styles.locationName}>{item.name}</span>
                <span className={styles.locationDetail}>{item.detail}</span>
              </button>
            ))}
          </div>

          <p className={styles.geoSummary} aria-live="polite">
            <strong>{activeLocation.name}</strong>
            <span>{activeLocation.detail}</span>
          </p>
        </section>

        <section className={styles.intent} aria-labelledby={`${baseId}-intent`}>
          <div className={styles.panelHead}>
            <h3 id={`${baseId}-intent`} className={styles.panelTitle}>
              {workspace.intent.title}
            </h3>
            <p className={styles.panelLead}>Sort searches by commercial intent, then decide what to bid on and what to exclude.</p>
          </div>

          <div className={styles.intentNav} role="tablist" aria-label="Search intent groups">
            {workspace.intent.groups.map((group) => (
              <button
                key={group.id}
                type="button"
                role="tab"
                id={`${baseId}-intent-${group.id}`}
                aria-selected={intent === group.id}
                className={styles.intentTab}
                data-intent={group.id}
                onClick={() => startTransition(() => setIntent(group.id))}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div key={activeGroup.id} className={styles.intentPane} aria-labelledby={`${baseId}-intent-${activeGroup.id}`}>
            <p className={styles.intentBlurb}>{activeGroup.blurb}</p>
            <ul className={styles.termList} data-intent={activeGroup.id}>
              {activeGroup.terms.map((term) => (
                <li key={term}>
                  <span className={styles.termQuery}>{term}</span>
                  <span className={styles.termTag}>{activeGroup.id === "excluded" ? "Excluded" : "Match"}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.audienceBar}>
            <span className={styles.audienceLabel}>Also layer audiences</span>
            <ul className={styles.audienceList}>
              {workspace.audiences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
