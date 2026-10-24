"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Eyebrow, SectionDescription, SectionTitle } from "@/components/typography";
import styles from "./EmailMarketingPage.module.css";

export type CampaignVisual = {
  src: string;
  alt: string;
  label: string;
};

type EmailCampaignStageProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  bullets: string[];
  cta: { label: string; href: string } | null;
  visuals: CampaignVisual[];
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function EmailCampaignStage({
  eyebrow,
  title,
  body,
  bullets,
  cta,
  visuals,
}: EmailCampaignStageProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const visual = visuals[active] ?? visuals[0];

  return (
    <section className={`section ${styles.campaign}`} aria-labelledby={`${baseId}-title`}>
      <div className={`container ${styles.campaignGrid}`}>
        <div className={styles.campaignMedia}>
          {visuals.length > 1 ? (
            <div className={styles.switcher} role="tablist" aria-label="Campaign visuals">
              {visuals.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.src}
                    id={`${baseId}-visual-${index}`}
                    className={styles.switch}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`${baseId}-visual`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) => {
                      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                      event.preventDefault();
                      const direction = event.key === "ArrowRight" ? 1 : -1;
                      const next = (index + direction + visuals.length) % visuals.length;
                      setActive(next);
                      document.getElementById(`${baseId}-visual-${next}`)?.focus();
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}
          {visual ? (
            <div id={`${baseId}-visual`} className={styles.frame} role="tabpanel" aria-labelledby={`${baseId}-visual-${active}`}>
              {visuals.map((item, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.src}
                  src={item.src}
                  alt={index === active ? item.alt : ""}
                  aria-hidden={index === active ? undefined : true}
                  className={index === active ? styles.frameImageActive : styles.frameImage}
                />
              ))}
            </div>
          ) : null}
        </div>
        <div className={styles.campaignCopy}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <SectionTitle id={`${baseId}-title`}>{title}</SectionTitle>
          {body ? <SectionDescription className={styles.lede}>{body}</SectionDescription> : null}
          {bullets.length > 0 ? (
            <ul className={styles.points}>
              {bullets.map((bullet, index) => (
                <li key={bullet}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {cta ? (
            <Link className={styles.solid} href={cta.href}>
              {cta.label}
              <ArrowIcon />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
