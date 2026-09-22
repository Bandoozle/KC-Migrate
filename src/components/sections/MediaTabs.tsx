"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { SectionIntro } from "@/components/typography";
import type { ServiceMediaTabsSection } from "@/lib/wordpress/service-page-types";
import styles from "./MediaTabs.module.css";

type MediaTabsProps = {
  section: ServiceMediaTabsSection;
};

export function MediaTabs({ section }: MediaTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabs = section.tabs;

  if (tabs.length === 0) return null;

  const select = (index: number) => setActive(index);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") {
      select(0);
      return;
    }
    if (event.key === "End") {
      select(tabs.length - 1);
      return;
    }
    const delta = event.key === "ArrowRight" ? 1 : -1;
    select((active + delta + tabs.length) % tabs.length);
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {section.title ? (
          <SectionIntro
            align="center"
            title={section.title}
            description="Reach your audience with a consistent presence across every channel."
          />
        ) : null}

        <div
          className={styles.tabList}
          role="tablist"
          aria-label={section.title || "Platform examples"}
          onKeyDown={onKeyDown}
        >
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={`${tab.label}-${index}`}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                className={`${styles.tab} ${selected ? styles.tabActive : ""}`}
                onClick={() => select(index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <div
              key={`${tab.label}-panel-${index}`}
              role="tabpanel"
              id={`${baseId}-panel-${index}`}
              aria-labelledby={`${baseId}-tab-${index}`}
              hidden={!selected}
              className={styles.panel}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tab.image.src} alt={tab.image.alt || tab.label} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
