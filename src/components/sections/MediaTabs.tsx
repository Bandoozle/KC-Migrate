"use client";

import { SectionIntro } from "@/components/typography";
import { platformTabCopy } from "@/lib/content/platform-media-tabs";
import type { ServiceMediaTabsSection } from "@/lib/wordpress/service-page-types";
import { SplitMediaTabs } from "./SplitMediaTabs";
import styles from "./MediaTabs.module.css";

type MediaTabsProps = {
  section: ServiceMediaTabsSection;
};

export function MediaTabs({ section }: MediaTabsProps) {
  const tabs = section.tabs.map((tab, index) => {
    const copy = platformTabCopy(tab.label);
    return {
      id: `${tab.label}-${index}`,
      label: tab.label,
      title: tab.title || copy?.title || tab.label,
      subtitle: tab.subtitle || copy?.subtitle,
      description: tab.description || copy?.description,
      image: tab.image.src,
      alt: tab.image.alt || tab.label,
    };
  });

  if (tabs.length === 0) return null;

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

        <SplitMediaTabs
          ariaLabel={section.title || "Platform examples"}
          scrollTabsOnMobile
          stableHeight
          tabs={tabs}
        />
      </div>
    </section>
  );
}
