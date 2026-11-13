"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./ChatGptAdsPage.module.css";
import { JOURNEY } from "@/content/chatgpt-ads-page";

/** Four miniature product interfaces for the question → customer journey. */
export function JourneyScenes() {
  const rootRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-journey-step]"));
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.journeyStep);
        if (!Number.isNaN(index)) setActive(index);
      },
      { threshold: [0.35, 0.55, 0.75], rootMargin: "-10% 0px -25% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={rootRef} className={styles.journeySteps}>
      <li
        className={styles.journeyStep}
        data-journey-step={0}
        data-active={active >= 0 ? "true" : undefined}
      >
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.sceneChrome}>
            <span className={styles.sceneDot} />
            <span className={styles.sceneDot} />
            <span className={styles.sceneDot} />
            <em>AI assistant</em>
          </div>
          <div className={styles.sceneChat}>
            <span className={styles.sceneUser}>What should I look for in a heat pump installer?</span>
            <span className={styles.sceneBotBubble}>
              <b>Ask for a heat-loss calculation, licensing, and rebate guidance before you book.</b>
              <span className={styles.sceneBotLines}>
                <i />
                <i />
                <i />
              </span>
            </span>
          </div>
        </div>
        <span className={styles.journeyName}>{JOURNEY.steps[0].name}</span>
        <span className={styles.journeyBody}>{JOURNEY.steps[0].body}</span>
      </li>

      <li
        className={styles.journeyStep}
        data-journey-step={1}
        data-active={active >= 1 ? "true" : undefined}
      >
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.sceneSponsor}>
            <span className={styles.scenePill}>Sponsored</span>
            <span className={styles.sceneSponsorBody}>
              <span className={styles.sceneSponsorThumb}>
                <Image
                  src="/images/google-ads/product-heat-pump.jpg"
                  alt=""
                  fill
                  sizes="72px"
                  className={styles.cover}
                />
              </span>
              <span className={styles.sceneSponsorCopy}>
                <strong>Northridge Heating</strong>
                <em>Free in-home sizing across Calgary. Licensed · Insured</em>
                <u>Book assessment</u>
              </span>
            </span>
          </div>
        </div>
        <span className={styles.journeyName}>{JOURNEY.steps[1].name}</span>
        <span className={styles.journeyBody}>{JOURNEY.steps[1].body}</span>
      </li>

      <li
        className={styles.journeyStep}
        data-journey-step={2}
        data-active={active >= 2 ? "true" : undefined}
      >
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.sceneBrowser}>
            <span className={styles.sceneBrowserBar}>
              <i />
              <i />
              <i />
              <em>northridgeheating.ca/heat-pumps</em>
            </span>
            <span className={styles.sceneBrowserHero}>
              <span className={styles.sceneBrowserHeroGlow} />
            </span>
            <span className={styles.sceneBrowserCopy}>
              <strong>Heat pumps, sized for your home</strong>
              <em />
              <em />
              <u>Book a free assessment</u>
            </span>
          </div>
        </div>
        <span className={styles.journeyName}>{JOURNEY.steps[2].name}</span>
        <span className={styles.journeyBody}>{JOURNEY.steps[2].body}</span>
      </li>

      <li
        className={styles.journeyStep}
        data-journey-step={3}
        data-active={active >= 3 ? "true" : undefined}
      >
        <div className={styles.scene} aria-hidden="true">
          <div className={styles.sceneConfirm}>
            <span className={styles.sceneConfirmBadge}>✓</span>
            <strong>Assessment booked</strong>
            <em>Thu 2:00–4:00 p.m. · North Vancouver</em>
            <span className={styles.sceneConfirmMeta}>
              <b>
                <small>Customer</small>
                Jordan M.
              </b>
              <b>
                <small>Service</small>
                Heat pump sizing
              </b>
            </span>
            <span className={styles.sceneConfirmFoot}>Confirmation sent · #NR-2841</span>
          </div>
        </div>
        <span className={styles.journeyName}>{JOURNEY.steps[3].name}</span>
        <span className={styles.journeyBody}>{JOURNEY.steps[3].body}</span>
      </li>
    </ol>
  );
}
