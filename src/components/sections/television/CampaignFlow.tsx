"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./CampaignFlow.module.css";

export type CampaignStep = {
  label: string;
  title: string;
  body: string;
};

type CampaignFlowProps = {
  steps: CampaignStep[];
  label: string;
};

/** Four connected campaign stages; the connector draws once when the strip enters view. */
export function CampaignFlow({ steps, label }: CampaignFlowProps) {
  const ref = useRef<HTMLOListElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setLive(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={styles.flow} aria-label={label} data-live={live || undefined}>
      {steps.map((step, index) => (
        <li key={step.label} className={styles.step} style={{ "--i": index } as CSSProperties}>
          <span className={styles.node} aria-hidden="true" />
          <p className={styles.label}>{step.label}</p>
          <h3 className={styles.title}>{step.title}</h3>
          <p className={styles.body}>{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
