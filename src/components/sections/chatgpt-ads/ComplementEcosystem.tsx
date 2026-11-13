"use client";

import { useId, useState, useTransition, type CSSProperties } from "react";
import { COMPLEMENT } from "@/content/chatgpt-ads-page";
import styles from "./ChatGptAdsPage.module.css";

type ChannelId = (typeof COMPLEMENT.channels)[number]["id"];

/**
 * Interactive marketing ecosystem: how ChatGPT Ads sits alongside
 * search, SEO, social and broader media in one plan.
 */
export function ComplementEcosystem() {
  const baseId = useId();
  const [active, setActive] = useState<ChannelId>("chatgpt");
  const [, startTransition] = useTransition();
  const channel = COMPLEMENT.channels.find((item) => item.id === active) ?? COMPLEMENT.channels[0];

  return (
    <div className={styles.ecosystem} aria-label="Marketing ecosystem">
      <div className={styles.ecoChrome}>
        <span className={styles.ecoMark} aria-hidden="true" />
        <div>
          <p className={styles.ecoTitle}>Marketing plan</p>
          <p className={styles.ecoSub}>Channels by role in the decision</p>
        </div>
      </div>

      <div className={styles.ecoBody}>
        <div className={styles.ecoOrbit} aria-hidden="true">
          <span className={styles.ecoCore}>
            <b>Customer</b>
            <small>decision</small>
          </span>
          {COMPLEMENT.channels.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={styles.ecoNode}
              data-id={item.id}
              data-active={item.id === active ? "true" : undefined}
              style={{ "--i": index } as CSSProperties}
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => startTransition(() => setActive(item.id))}
            >
              <span>{item.name}</span>
            </button>
          ))}
          <svg className={styles.ecoRings} viewBox="0 0 320 320" aria-hidden="true">
            <circle cx="160" cy="160" r="58" fill="none" stroke="rgba(66,133,244,0.18)" strokeWidth="1.5" />
            <circle cx="160" cy="160" r="96" fill="none" stroke="rgba(66,133,244,0.12)" strokeWidth="1.5" strokeDasharray="4 6" />
            <circle cx="160" cy="160" r="132" fill="none" stroke="rgba(20,19,26,0.08)" strokeWidth="1" />
          </svg>
        </div>

        <div className={styles.ecoList} role="tablist" aria-label="Channels in the plan">
          {COMPLEMENT.channels.map((item) => (
            <button
              key={item.id}
              id={`${baseId}-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === active}
              className={styles.ecoTab}
              data-id={item.id}
              onClick={() => startTransition(() => setActive(item.id))}
            >
              <span className={styles.ecoTabName}>{item.name}</span>
              <span className={styles.ecoTabRole}>{item.role}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        key={channel.id}
        className={styles.ecoDetail}
        data-id={channel.id}
        aria-labelledby={`${baseId}-${channel.id}`}
      >
        <p className={styles.ecoDetailRole}>{channel.role}</p>
        <p className={styles.ecoDetailBody}>{channel.detail}</p>
      </div>
    </div>
  );
}
