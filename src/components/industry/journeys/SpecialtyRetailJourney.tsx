"use client";

import { JourneyFrame, Photo, on, show } from "./JourneyFrame";
import kit from "./kit.module.css";
import p from "./places.module.css";
import s from "./SpecialtyRetailJourney.module.css";

const SHOWROOM = "/wp-content/uploads/2023/06/hearth-advertising.jpg";
const ROUTE = "M64 176 H 158 V 96 H 318 V 62";

/** A local map listing that leads to a real showroom: search, directions, and the shopper walking in. */
export function SpecialtyRetailJourney() {
  return (
    <JourneyFrame
      industry="specialty-retail"
      title="Give shoppers a reason to drive past the big box."
      lead="Independent stores win on knowledge and service, but shoppers have to find you first. We put your store on the map and your expertise in front of them."
      summary="A shopper searches locally, gets directions to your store rather than the big-box chain, and comes in to talk to your experts."
      side="left"
      story="tabs"
      steps={[
        { label: "Search", body: "Local search and radio keep your name front of mind when the need comes up." },
        { label: "Directions", body: "Your store shows up nearby, with the details they need to plan a visit." },
        { label: "In store", body: "They arrive ready to talk to your team, which is where you win." },
      ]}
    >
      {(stage) => (
        <div className={s.scene}>
          <div className={`${kit.layer} ${s.mapLayer}`} {...show(stage, 0, 1)}>
            <svg className={s.map} viewBox="0 0 440 230" preserveAspectRatio="xMidYMin slice">
              <rect width="440" height="230" fill="#eef0ea" />
              <path d="M300 0 H 440 V 56 C 400 62, 356 44, 320 40 Z" fill="#bcd9e8" />
              <rect x="20" y="16" width="118" height="62" rx="3" fill="#cfe3c2" />
              <g fill="#e0e1da">
                <rect x="20" y="112" width="60" height="44" rx="2" />
                <rect x="92" y="112" width="52" height="44" rx="2" />
                <rect x="172" y="112" width="58" height="44" rx="2" />
                <rect x="242" y="112" width="62" height="44" rx="2" />
                <rect x="332" y="112" width="86" height="44" rx="2" />
                <rect x="172" y="16" width="58" height="62" rx="2" />
                <rect x="242" y="50" width="62" height="28" rx="2" />
                <rect x="172" y="190" width="132" height="34" rx="2" />
              </g>
              <text x="118" y="139" textAnchor="middle" fontSize="10" fill="#6b6964">
                Big box
              </text>
              <g stroke="#ffffff" fill="none" strokeLinecap="round">
                <path strokeWidth="9" d="M0 96 H 440" />
                <path strokeWidth="9" d="M0 176 H 440" />
                <path strokeWidth="7" d="M158 0 V 230" />
                <path strokeWidth="7" d="M318 40 V 230" />
              </g>
              <path className={`${s.route} ${kit.draw}`} d={ROUTE} pathLength={1} {...on(stage, 1)} />
              <circle cx="64" cy="176" r="6" fill="#1a4fc4" stroke="#ffffff" strokeWidth="2.5" />
              <path
                fill="var(--ind-accent)"
                d="M318 64c-9-12-13-19-13-26a13 13 0 0 1 26 0c0 7-4 14-13 26Z"
              />
              <circle cx="318" cy="38" r="4.5" fill="#ffffff" />
            </svg>
            <span className={s.search}>fireplace store near me</span>
            <div className={`${kit.card} ${s.listing}`}>
              <span className={s.thumb}>
                <Photo src={SHOWROOM} position="72% 50%" />
              </span>
              <span className={s.info}>
                <b>Your store</b>
                <small>Open today · Local experts</small>
              </span>
              <span className={s.go} data-active={stage === 1}>
                Directions
              </span>
            </div>
          </div>

          <div className={kit.layer} {...show(stage, 2)}>
            <Photo src={SHOWROOM} position="60% 50%" />
            <span className={`${kit.card} ${s.visit}`}>
              <span className={kit.done}>
                <span className={kit.tick} />
                In your showroom
              </span>
              <small>Asking your team, not an aisle</small>
            </span>
          </div>
          <span className={p.note}>Illustrative</span>
        </div>
      )}
    </JourneyFrame>
  );
}
