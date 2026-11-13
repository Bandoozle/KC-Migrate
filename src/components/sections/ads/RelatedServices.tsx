import Link from "next/link";
import { SectionTitle } from "@/components/typography";
import styles from "./RelatedServices.module.css";

type VisualKind = "chatgpt" | "ctv" | "digital" | "seo" | "google" | "tv";

/** The advertising services that link to each other, so each new page is reachable from the others. */
export const ADVERTISING_LINKS = [
  {
    href: "/services/google-ads-management/",
    name: "Google Ads Management",
    line: "Search, Display, Shopping, YouTube and Performance Max.",
    visual: "google" as const,
  },
  {
    href: "/services/chatgpt-ads-management/",
    name: "ChatGPT Ads Management",
    line: "Planning for sponsored placements in AI conversations.",
    visual: "chatgpt" as const,
  },
  {
    href: "/services/digital-connected-tv/",
    name: "Connected TV",
    line: "Streaming TV ads targeted by market and audience.",
    visual: "ctv" as const,
  },
  {
    href: "/services/digital-marketing/",
    name: "Digital Marketing",
    line: "Paid social, search and programmatic, planned as one.",
    visual: "digital" as const,
  },
  {
    href: "/services/search-engine-optimization/",
    name: "Search Engine Optimization",
    line: "Organic visibility that compounds over time.",
    visual: "seo" as const,
  },
  {
    href: "/services/television-advertising/",
    name: "Television Advertising",
    line: "Broadcast and streaming campaigns with in-house creative.",
    visual: "tv" as const,
  },
] as const;

type RelatedServicesProps = {
  title: string;
  /** The page this block sits on; it is left out of the list. */
  current: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
};

function ArrowIcon() {
  return (
    <svg className={styles.arrow} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ServiceVisual({ kind }: { kind: VisualKind }) {
  if (kind === "chatgpt") {
    return (
      <div className={styles.visual} data-kind="chatgpt" aria-hidden="true">
        <div className={styles.chatMini}>
          <span className={styles.chatUser}>Best heat pump options near me?</span>
          <span className={styles.chatBot}>
            <i />
            <i />
          </span>
          <span className={styles.chatSponsored}>
            <b>Sponsored</b>
            <strong>Northridge Heating</strong>
            <em>Book assessment</em>
          </span>
        </div>
      </div>
    );
  }

  if (kind === "ctv" || kind === "tv") {
    return (
      <div className={styles.visual} data-kind="ctv" aria-hidden="true">
        <div className={styles.tvFrame}>
          <span className={styles.tvBezel}>
            <span className={styles.tvScreen}>
              <span className={styles.tvAd}>
                <small>Stream ad</small>
                <strong>Warm home. Clear offer.</strong>
              </span>
            </span>
          </span>
          <span className={styles.tvStand} />
        </div>
      </div>
    );
  }

  if (kind === "digital") {
    return (
      <div className={styles.visual} data-kind="digital" aria-hidden="true">
        <div className={styles.channelStack}>
          <span data-layer="social">
            <b>Social</b>
            <i />
          </span>
          <span data-layer="search">
            <b>Search</b>
            <i />
            <i />
          </span>
          <span data-layer="programmatic">
            <b>Programmatic</b>
            <i />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "seo") {
    return (
      <div className={styles.visual} data-kind="seo" aria-hidden="true">
        <div className={styles.serpMini}>
          <span className={styles.serpBar}>
            <i />
            furnace installer vancouver
          </span>
          <span className={styles.serpOrganic}>
            <small>1</small>
            <span>
              <strong>Your service page</strong>
              <em />
            </span>
          </span>
          <span className={styles.serpOrganic} data-dim>
            <small>2</small>
            <span>
              <strong>Competitor listing</strong>
              <em />
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.visual} data-kind="google" aria-hidden="true">
      <div className={styles.googleMini}>
        <span className={styles.googleLogo}>
          <b>G</b>
          <b>o</b>
          <b>o</b>
          <b>g</b>
          <b>l</b>
          <b>e</b>
        </span>
        <span className={styles.googleAd}>
          <small>Sponsored</small>
          <strong>Furnace Installation</strong>
          <em />
        </span>
      </div>
    </div>
  );
}

export function RelatedServices({ title, current, tone = "light", align = "start" }: RelatedServicesProps) {
  const links = ADVERTISING_LINKS.filter((link) => link.href !== current).slice(0, 4);
  return (
    <section className={styles.section} data-tone={tone} data-align={align} aria-labelledby="related-services">
      <div className="container">
        <div className={styles.header}>
          <p className={styles.label}>Related services</p>
          <SectionTitle id="related-services" className={styles.title}>
            {title}
          </SectionTitle>
        </div>
        <ul className={styles.grid}>
          {links.map((link, index) => (
            <li key={link.href}>
              <Link className={styles.card} href={link.href} data-tone={index % 4}>
                <span className={styles.copy}>
                  <span className={styles.nameRow}>
                    <span className={styles.name}>{link.name}</span>
                    <ArrowIcon />
                  </span>
                  <span className={styles.line}>{link.line}</span>
                </span>
                <ServiceVisual kind={link.visual} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
