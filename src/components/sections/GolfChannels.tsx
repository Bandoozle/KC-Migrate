import { SectionTitle } from "@/components/typography";
import { platformTabCopy } from "@/lib/content/platform-media-tabs";
import type { ServiceMediaTabsSection } from "@/lib/wordpress/service-page-types";
import styles from "./GolfMarketingPage.module.css";

type GolfChannelsProps = {
  section: ServiceMediaTabsSection;
};

export function GolfChannels({ section }: GolfChannelsProps) {
  const tabs = section.tabs.map((tab, index) => {
    const copy = platformTabCopy(tab.label);
    return {
      id: `${tab.label}-${index}`,
      label: tab.label,
      title: tab.title || copy?.title || tab.label,
      subtitle: tab.subtitle || copy?.subtitle || "",
      description: tab.description || copy?.description || "",
    };
  });
  if (tabs.length === 0) return null;

  return (
    <section className={styles.channels} aria-labelledby="golf-channels-title">
      <div className="container">
        <div className={styles.channelIntro}>
          <SectionTitle as="h2" id="golf-channels-title">
            {section.title || "Your Brand. Every Platform."}
          </SectionTitle>
          <p className={styles.lead}>Reach your audience with a consistent presence across every channel.</p>
        </div>
        <div className={styles.channelGrid}>
          {tabs.map((tab) => (
            <article key={tab.id}>
              <h3>{tab.title}</h3>
              {tab.subtitle ? <p className={styles.channelSubtitle}>{tab.subtitle}</p> : null}
              {tab.description ? <p className={styles.body}>{tab.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
