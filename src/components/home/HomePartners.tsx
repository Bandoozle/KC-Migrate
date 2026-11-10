"use client";

import Image from "next/image";
import { useId, useState, type KeyboardEvent } from "react";
import { SectionDescription, SectionTitle } from "@/components/typography";
import shared from "./home-shared.module.css";
import tabsStyles from "@/components/sections/SplitMediaTabs.module.css";
import styles from "./HomePartners.module.css";
import { useSlidingPill } from "@/components/sections/useSlidingPill";

const U = "/wp-content/uploads";

/*
 * Only partners the site already names. Networks: "We have direct relationships
 * with major networks including CTV, Global, CBC, Sportsnet, TSN... NBC, CBS,
 * FOX, CNN, and ESPN" (Television FAQ), limited to those with a logo file.
 * Manufacturers: "What national brands have you worked with?" (HVAC FAQ).
 */
const GROUPS = [
  {
    id: "networks",
    label: "Broadcast networks",
    note: "Direct relationships for television and streaming buys.",
    kind: "media" as const,
    logos: [
      { name: "CTV", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.55.55-AM.png` },
      { name: "Global", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.33.58-AM.png` },
      { name: "CBC", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.57.09-AM-1.png` },
      { name: "TSN", src: `${U}/2023/06/Screenshot-2023-06-13-at-9.12.56-AM-1.png` },
      { name: "NBC", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.58.38-AM.png` },
      { name: "CBS", src: `${U}/2024/03/cbs.webp` },
      { name: "FOX", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.55.14-AM.png` },
      { name: "CNN", src: `${U}/2023/06/Screenshot-2023-06-13-at-8.59.41-AM.png` },
      { name: "ESPN", src: `${U}/2024/03/espn.webp` },
    ],
  },
  {
    id: "brands",
    label: "National brands",
    note: "Co-op campaigns with leading HVAC manufacturers.",
    kind: "brand" as const,
    logos: [
      { name: "Trane", src: `${U}/2026/07/Trane.png` },
      { name: "Lennox", src: `${U}/2026/07/Lennox.png` },
      { name: "Daikin", src: `${U}/2026/07/Daikin.png` },
      { name: "Mitsubishi Electric", src: `${U}/2026/07/Mitsubishi.png` },
      { name: "Comfortmaker", src: `${U}/2026/07/Comfortmaker.png` },
      { name: "York", src: `${U}/2026/07/York.png` },
      { name: "GE", src: `${U}/2026/07/GE.png` },
      { name: "Napoleon", src: `${U}/2026/07/Napoleon.png` },
      { name: "Ruud", src: `${U}/2026/07/RUUD.png` },
    ],
  },
  {
    id: "platforms",
    label: "Platform partners",
    note: "Partner programs for search, social and video advertising.",
    kind: "partner" as const,
    logos: [
      { name: "Google Partner badge", src: "/images/partners/google-partner.png" },
      { name: "Meta Business Partner badge", src: "/images/partners/meta-business-partner.png" },
      { name: "TikTok Marketing Partner badge", src: "/images/partners/tiktok-marketing-partner.png" },
    ],
  },
];

/** Partner logos behind the same pill switcher as "Build a brand people remember". */
export function HomePartners() {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const { listRef, pillStyle, pillState } = useSlidingPill<HTMLDivElement>(active);

  const select = (index: number) => {
    setActive(index);
    document.getElementById(`${baseId}-tab-${GROUPS[index].id}`)?.focus({ preventScroll: true });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") return select(0);
    if (event.key === "End") return select(GROUPS.length - 1);
    select((active + (event.key === "ArrowRight" ? 1 : -1) + GROUPS.length) % GROUPS.length);
  };

  return (
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby={`${baseId}-title`}>
      <div className={`${shared.introCentered} ${styles.intro}`}>
        <SectionTitle id={`${baseId}-title`}>Trusted partners</SectionTitle>
        <SectionDescription>The networks we buy from directly, the brands we&rsquo;ve run campaigns with, and the ad platforms we partner with.</SectionDescription>
      </div>

      <div
        ref={listRef}
        className={tabsStyles.tabList}
        role="tablist"
        aria-label="Partner groups"
        onKeyDown={onKeyDown}
        data-pill={pillState}
      >
        <span className={tabsStyles.pill} style={pillStyle} aria-hidden="true" />
        {GROUPS.map((group, index) => {
          const selected = index === active;
          return (
            <button
              key={group.id}
              id={`${baseId}-tab-${group.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${group.id}`}
              tabIndex={selected ? 0 : -1}
              className={`${tabsStyles.tab} ${selected ? tabsStyles.tabActive : ""}`}
              onClick={() => select(index)}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Both walls share one grid cell, so switching never changes the page height */}
      <div className={styles.stack}>
        {GROUPS.map((group, index) => {
          const selected = index === active;
          return (
            <div
              key={group.id}
              id={`${baseId}-panel-${group.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${group.id}`}
              className={styles.panel}
              data-active={selected}
              inert={!selected}
            >
              <p className={styles.note}>{group.note}</p>
              <ul className={styles.wall} data-kind={group.kind}>
                {group.logos.map((logo, logoIndex) => (
                  <li key={logo.name} className={styles.cell} style={{ animationDelay: `${logoIndex * 35}ms` }}>
                    <span className={styles.logo}>
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        fill
                        sizes={group.kind === "partner" ? "(max-width: 639px) 33vw, 260px" : "(max-width: 767px) 30vw, 160px"}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
