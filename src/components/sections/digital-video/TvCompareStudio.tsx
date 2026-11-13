"use client";

import Image from "next/image";
import { useId, useState, useTransition } from "react";
import styles from "./DigitalVideoAdvertisingPage.module.css";

const TABS = [
  {
    id: "reach",
    label: "Reach",
    linear: "Scheduled programming on broadcast and cable networks",
    ctv: "Ads inside streaming apps on internet-connected TVs",
  },
  {
    id: "targeting",
    label: "Targeting",
    linear: "By market, network, program and daypart",
    ctv: "By geography down to postal code, plus audience and interest signals where the platform supports them",
  },
  {
    id: "buying",
    label: "Buying",
    linear: "Schedules negotiated with networks and stations",
    ctv: "Impressions bought across streaming publishers and platforms",
  },
  {
    id: "measurement",
    label: "Measurement",
    linear: "Reach, frequency and ratings estimates",
    ctv: "Impressions, completion rates, reach and website visit attribution",
  },
] as const;

function BroadcastIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6.5 8.5a7.5 7.5 0 0 1 0 7M17.5 8.5a7.5 7.5 0 0 0 0 7M4 6a11 11 0 0 1 0 12M20 6a11 11 0 0 0 0 12"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4 3.5 9 12 14l8.5-5L12 4ZM3.5 14 12 19l8.5-5M3.5 11.5 12 16.5l8.5-5"
      />
    </svg>
  );
}

/** Interactive Traditional TV vs Connected TV comparison for the versus band. */
export function TvCompareStudio() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const [, startTransition] = useTransition();
  const tab = TABS[active];

  return (
    <div className={styles.compareStudio}>
      <div className={styles.compareCards}>
        <article className={styles.compareCard}>
          <div className={styles.compareMedia}>
            <Image
              src="/wp-content/uploads/2026/09/Television-Advertising.jpg"
              alt="A family watching hockey on a large living-room TV"
              fill
              sizes="(min-width: 960px) 42vw, 100vw"
              className={styles.cover}
            />
            <span className={styles.compareBadge}>Live TV</span>
          </div>
          <div className={styles.compareCopy}>
            <h3 className={styles.compareName}>Traditional TV</h3>
            <p className={styles.compareLine}>Broad reach and the credibility of live television.</p>
          </div>
        </article>

        <article className={styles.compareCard} data-accent="true">
          <div className={styles.compareMedia}>
            <Image
              src="/images/television/connected-tv.jpg"
              alt="Viewers watching a Connected TV spot in a living room"
              fill
              sizes="(min-width: 960px) 42vw, 100vw"
              className={styles.cover}
            />
            <span className={styles.compareChrome} aria-hidden="true">
              <span className={styles.compareAd}>Ad</span>
              <span className={styles.compareScrub}>
                <i />
              </span>
              <span className={styles.compareTime}>0:15 / 0:30</span>
            </span>
          </div>
          <div className={styles.compareCopy}>
            <h3 className={styles.compareNameAccent}>Connected TV</h3>
            <p className={styles.compareLine}>Television impact focused on the markets and audiences you choose.</p>
          </div>
        </article>
      </div>

      <div className={styles.compareTabs} role="tablist" aria-label="Compare by aspect">
        {TABS.map((item, index) => (
          <button
            key={item.id}
            id={`${baseId}-${item.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={styles.compareTab}
            onClick={() => startTransition(() => setActive(index))}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div key={tab.id} className={styles.compareDetail} aria-labelledby={`${baseId}-${tab.id}`}>
        <div className={styles.compareSide}>
          <span className={styles.compareIcon} aria-hidden="true">
            <BroadcastIcon />
          </span>
          <div>
            <p className={styles.compareSideLabel}>Traditional TV</p>
            <p className={styles.compareSideBody}>{tab.linear}</p>
          </div>
        </div>
        <div className={styles.compareDivider} aria-hidden="true" />
        <div className={styles.compareSide}>
          <span className={styles.compareIconAccent} aria-hidden="true">
            <LayersIcon />
          </span>
          <div>
            <p className={styles.compareSideLabelAccent}>Connected TV</p>
            <p className={styles.compareSideBody}>{tab.ctv}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
