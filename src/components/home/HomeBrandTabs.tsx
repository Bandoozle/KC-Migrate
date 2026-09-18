"use client";

import { useId, useState, type KeyboardEvent } from "react";
import {
  BodyText,
  CardTitle,
  SectionDescription,
  SectionTitle,
  SubsectionTitle,
} from "@/components/typography";
import type { HomeBrandTab, HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeBrandTabs.module.css";

type HomeBrandTabsProps = {
  preceding: HomePageContent["brandTabsPreceding"];
  tabs: HomeBrandTab[];
};

export function HomeBrandTabs({ preceding, tabs }: HomeBrandTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);

  const select = (index: number) => {
    setActive(index);
  };

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
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby={`${baseId}-title`}>
      <div className={`${shared.introCentered} ${styles.intro}`}>
        <SectionTitle id={`${baseId}-title`}>{preceding.title}</SectionTitle>
        <SectionDescription>{preceding.lead}</SectionDescription>
      </div>

      <div className={styles.tabs}>
        <div
          className={styles.tabList}
          role="tablist"
          aria-label="Brand building topics"
          onKeyDown={onKeyDown}
        >
          {tabs.map((tab, index) => {
            const selected = index === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
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
              key={tab.id}
              role="tabpanel"
              id={`${baseId}-panel-${tab.id}`}
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              hidden={!selected}
              className={styles.panel}
            >
              <div className={styles.panelGrid}>
                <figure className={styles.figure}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tab.image} alt={tab.alt} loading="lazy" decoding="async" />
                </figure>
                <div className={styles.copy}>
                  <SubsectionTitle as="h3" className={styles.title}>
                    {tab.title}
                  </SubsectionTitle>
                  <CardTitle as="p" className={styles.subtitle}>
                    {tab.subtitle}
                  </CardTitle>
                  <BodyText className={styles.description}>{tab.description}</BodyText>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
