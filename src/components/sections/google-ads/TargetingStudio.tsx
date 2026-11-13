"use client";

import { useId, useState, useTransition } from "react";
import { TARGETING } from "@/content/google-ads-page";
import styles from "./TargetingStudio.module.css";

type IntentId = (typeof TARGETING.workspace.intent.groups)[number]["id"];

function MapCanvas({ activeArea }: { activeArea: string }) {
  return (
    <svg className={styles.mapSvg} viewBox="0 0 640 420" role="img" aria-label="Service area map of Metro Vancouver">
      <defs>
        <pattern id="ga-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(66,133,244,0.07)" strokeWidth="1" />
        </pattern>
        <pattern id="ga-blocks" width="48" height="36" patternUnits="userSpaceOnUse">
          <rect x="4" y="6" width="18" height="12" rx="1.5" fill="rgba(14,23,38,0.035)" />
          <rect x="26" y="16" width="16" height="10" rx="1.5" fill="rgba(14,23,38,0.028)" />
        </pattern>
        <radialGradient id="ga-radius-fill" cx="48%" cy="52%" r="42%">
          <stop offset="0%" stopColor="rgba(66,133,244,0.3)" />
          <stop offset="65%" stopColor="rgba(66,133,244,0.12)" />
          <stop offset="100%" stopColor="rgba(66,133,244,0)" />
        </radialGradient>
        <filter id="ga-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(14,23,38,0.16)" />
        </filter>
      </defs>

      <rect width="640" height="420" fill="#edf2f7" />
      <rect width="640" height="420" fill="url(#ga-map-grid)" />
      <rect width="640" height="250" fill="url(#ga-blocks)" />

      {/* Water / shoreline */}
      <path d="M0 248 C70 236, 140 262, 220 248 C300 234, 360 268, 440 256 C520 244, 580 270, 640 258 L640 420 L0 420 Z" fill="#d4e4f4" />
      <path d="M0 278 C100 266, 180 300, 270 284 C360 268, 450 310, 560 292 L640 304 L640 420 L0 420 Z" fill="#c5daf0" />
      <path d="M210 40 C250 70, 290 55, 330 78 C360 96, 390 70, 430 88 L430 0 L210 0 Z" fill="#d4e4f4" opacity="0.85" />

      {/* Parks */}
      <ellipse cx="150" cy="142" rx="42" ry="26" fill="#d5e8d4" />
      <ellipse cx="486" cy="118" rx="36" ry="22" fill="#d5e8d4" />
      <ellipse cx="372" cy="308" rx="54" ry="20" fill="#d5e8d4" opacity="0.9" />
      <ellipse cx="88" cy="214" rx="28" ry="16" fill="#d5e8d4" opacity="0.75" />

      {/* Arterial roads */}
      <g fill="none" stroke="#ffffff" strokeWidth="11" strokeLinecap="round">
        <path d="M12 176 H628" />
        <path d="M28 108 H612" />
        <path d="M48 236 H600" />
        <path d="M168 28 V372" />
        <path d="M312 18 V398" />
        <path d="M458 36 V360" />
        <path d="M78 78 C170 128, 250 72, 348 124 C430 168, 510 112, 612 152" />
        <path d="M28 318 C150 288, 250 348, 380 318 C490 294, 552 338, 624 316" />
        <path d="M210 60 H470" />
        <path d="M120 280 H520" />
      </g>
      {/* Secondary streets */}
      <g fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.9">
        <path d="M40 140 H600" />
        <path d="M60 206 H580" />
        <path d="M220 40 V340" />
        <path d="M380 50 V330" />
        <path d="M520 70 V300" />
        <path d="M100 250 H300" />
        <path d="M340 250 H560" />
      </g>
      <g fill="none" stroke="rgba(14,23,38,0.07)" strokeWidth="2" strokeLinecap="round">
        <path d="M12 176 H628" />
        <path d="M28 108 H612" />
        <path d="M48 236 H600" />
        <path d="M168 28 V372" />
        <path d="M312 18 V398" />
        <path d="M458 36 V360" />
        <path d="M78 78 C170 128, 250 72, 348 124 C430 168, 510 112, 612 152" />
        <path d="M28 318 C150 288, 250 348, 380 318 C490 294, 552 338, 624 316" />
      </g>

      {/* Neighborhood labels */}
      <g className={styles.mapLabels} fill="rgba(14,23,38,0.42)">
        <text x="92" y="84">Kitsilano</text>
        <text x="248" y="72">Downtown</text>
        <text x="388" y="94">East Van</text>
        <text x="504" y="160">Burnaby</text>
        <text x="198" y="44">North Vancouver</text>
        <text x="54" y="336">False Creek</text>
        <text x="534" y="268">Abbotsford</text>
      </g>

      {/* Excluded wash */}
      <ellipse cx="560" cy="250" rx="58" ry="40" fill="rgba(14,23,38,0.05)" stroke="rgba(14,23,38,0.12)" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Service radius */}
      <circle cx="308" cy="198" r="152" fill="url(#ga-radius-fill)" stroke="rgba(66,133,244,0.55)" strokeWidth="2" strokeDasharray="5 7" />
      <circle cx="308" cy="198" r="7" fill="#4285f4" stroke="#ffffff" strokeWidth="3" filter="url(#ga-soft)" />

      {/* Pins */}
      <g className={styles.mapPins}>
        <g data-active={activeArea === "vancouver" ? "true" : undefined} transform="translate(292 188)">
          <circle r="17" fill="#ffffff" />
          <circle r="8" fill="#4285f4" />
        </g>
        <g data-active={activeArea === "burnaby" ? "true" : undefined} transform="translate(456 168)">
          <circle r="17" fill="#ffffff" />
          <circle r="8" fill="#4285f4" />
        </g>
        <g data-active={activeArea === "north-van" ? "true" : undefined} transform="translate(266 78)">
          <circle r="17" fill="#ffffff" />
          <circle r="8" fill="#4285f4" />
        </g>
        <g
          className={styles.mapExcludedPin}
          data-active={activeArea === "abbotsford" ? "true" : undefined}
          transform="translate(560 250)"
        >
          <circle r="15" fill="#ffffff" />
          <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="#8b95a5" strokeWidth="2.5" strokeLinecap="round" />
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
