"use client";

import { useId } from "react";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { SplitMediaTabs } from "@/components/sections/SplitMediaTabs";
import type { HomeBrandTab, HomePageContent } from "@/lib/wordpress/home";
import shared from "./home-shared.module.css";
import styles from "./HomeBrandTabs.module.css";

type HomeBrandTabsProps = {
  preceding: HomePageContent["brandTabsPreceding"];
  tabs: HomeBrandTab[];
};

export function HomeBrandTabs({ preceding, tabs }: HomeBrandTabsProps) {
  const baseId = useId();

  return (
    <section className={`${shared.rail} ${styles.section}`} aria-labelledby={`${baseId}-title`}>
      <div className={`${shared.introCentered} ${styles.intro}`}>
        <SectionTitle id={`${baseId}-title`}>{preceding.title}</SectionTitle>
        <SectionDescription>{preceding.lead}</SectionDescription>
      </div>

      <SplitMediaTabs
        className={styles.tabs}
        ariaLabel="Brand building topics"
        tabs={tabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          title: tab.title,
          subtitle: tab.subtitle,
          description: tab.description,
          image: tab.image,
          alt: tab.alt,
        }))}
      />
    </section>
  );
}
