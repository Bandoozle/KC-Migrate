"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { TV_REACH } from "@/content/television-page";
import { handleArrowKeys } from "@/components/sections/business-development/bd-motion";
import styles from "./TelevisionReach.module.css";

const pillar = (id: string) => TV_REACH.pillars.find((item) => item.id === id)!;

/**
 * Geographic planning, shown as the brief we'd put in front of a client: a
 * photograph of the households the plan is for, and a plan card whose market
 * scope changes the markets and the placement mix. Audience and measurement
 * hold across every scope.
 */
export function TelevisionReach() {
  const baseId = useId();
  const [scopeIndex, setScopeIndex] = useState(0);
  const scope = TV_REACH.scopes[scopeIndex];

  const rows = [
    { id: "markets", title: pillar("markets").title, body: scope.markets, changes: true },
    { id: "audience", title: pillar("audience").title, body: pillar("audience").body, changes: false },
    { id: "placement", title: pillar("placement").title, body: scope.placement, changes: true },
    { id: "measure", title: pillar("measure").title, body: pillar("measure").body, changes: false },
  ];

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <div className="container">
        <header className={styles.intro}>
          <h2 id={`${baseId}-title`} className={styles.title}>
            {TV_REACH.title}
          </h2>
          <p className={styles.lead}>{TV_REACH.lead}</p>
        </header>

        <div className={styles.layout}>
          <figure className={styles.photo}>
            <Image
              src="/images/television/households-evening.jpg"
              alt="A home at dusk with its living room lit, seen from the garden"
              fill
              sizes="(max-width: 899px) 100vw, 60vw"
              style={{ objectFit: "cover", objectPosition: "50% 55%" }}
            />
          </figure>

          <div className={styles.plan}>
            <p className={styles.planIntro}>{pillar("markets").body}</p>

            <div className={styles.scopes} role="group" aria-label="Market scope">
              {TV_REACH.scopes.map((item, index) => (
                <button
                  key={item.id}
                  id={`${baseId}-scope-${item.id}`}
                  type="button"
                  className={styles.scope}
                  aria-pressed={index === scopeIndex}
                  aria-controls={`${baseId}-plan`}
                  onClick={() => setScopeIndex(index)}
                  onKeyDown={(event) =>
                    handleArrowKeys(event, index, TV_REACH.scopes.length, setScopeIndex, (next) => `${baseId}-scope-${TV_REACH.scopes[next].id}`)
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>

            <dl id={`${baseId}-plan`} className={styles.rows} aria-live="polite">
              {rows.map((row) => (
                <div key={row.id} className={styles.row} data-changes={row.changes}>
                  <dt className={styles.rowTitle}>{row.title}</dt>
                  <dd key={row.changes ? `${row.id}-${scope.id}` : row.id} className={styles.rowBody}>
                    {row.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
