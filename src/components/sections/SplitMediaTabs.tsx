"use client";

import Image from "next/image";
import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { BodyText, CardTitle, SubsectionTitle } from "@/components/typography";
import styles from "./SplitMediaTabs.module.css";
import { useSlidingPill } from "./useSlidingPill";

export type SplitMediaTab = {
  id: string;
  label: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  alt: string;
};

type SplitMediaTabsProps = {
  tabs: SplitMediaTab[];
  ariaLabel: string;
  className?: string;
  /** Long labels scroll in one row on small screens. Default wraps, matching the homepage. */
  scrollTabsOnMobile?: boolean;
  /** Keep the panel as tall as the longest tab so switching does not shift the page. */
  stableHeight?: boolean;
};

export function SplitMediaTabs({
  tabs,
  ariaLabel,
  className,
  scrollTabsOnMobile = false,
  stableHeight = false,
}: SplitMediaTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const { listRef, pillStyle, pillState } = useSlidingPill<HTMLDivElement>(active);

  // When the row scrolls (small screens), fade its right edge until the last tab is in view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const update = () => {
      const more = list.scrollWidth - list.clientWidth - list.scrollLeft > 2;
      list.dataset.more = String(more);
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [listRef]);

  if (tabs.length === 0) return null;

  // Move focus with the selection (roving tabindex) and keep the tab visible in a scrolled row
  const select = (index: number) => {
    setActive(index);
    const tab = typeof document !== "undefined" ? document.getElementById(`${baseId}-tab-${tabs[index]?.id}`) : null;
    tab?.focus({ preventScroll: true });
    const list = listRef.current;
    if (tab && list && list.scrollWidth > list.clientWidth) {
      // A scrolling row (small screens): bring the chosen tab to the middle
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
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
    <div className={className ? `${styles.tabs} ${className}` : styles.tabs}>
      <div
        ref={listRef}
        className={scrollTabsOnMobile ? `${styles.tabList} ${styles.tabListScroll}` : styles.tabList}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        data-pill={pillState}
      >
        <span className={styles.pill} style={pillStyle} aria-hidden="true" />
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

      <div className={stableHeight ? styles.stack : undefined}>
      {tabs.map((tab, index) => {
        const selected = index === active;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${baseId}-panel-${tab.id}`}
            aria-labelledby={`${baseId}-tab-${tab.id}`}
            hidden={stableHeight ? undefined : !selected}
            aria-hidden={stableHeight && !selected ? true : undefined}
            className={
              stableHeight && !selected ? `${styles.panel} ${styles.panelReserved}` : styles.panel
            }
          >
            <div
              className={[styles.panelGrid, selected ? styles.panelIn : ""].filter(Boolean).join(" ")}
            >
              <figure className={styles.figure}>
                <Image src={tab.image} alt={tab.alt} fill sizes="(max-width: 900px) 100vw, 50vw" />
              </figure>
              <div className={styles.copy}>
                <SubsectionTitle as="h3" className={styles.title}>
                  {tab.title}
                </SubsectionTitle>
                {tab.subtitle ? (
                  <CardTitle as="p" className={styles.subtitle}>
                    {tab.subtitle}
                  </CardTitle>
                ) : null}
                {tab.description ? (
                  <BodyText className={styles.description}>{tab.description}</BodyText>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
