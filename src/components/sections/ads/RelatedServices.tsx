import Link from "next/link";
import { SectionTitle } from "@/components/typography";
import styles from "./RelatedServices.module.css";

type VisualKind =
  | "chatgpt"
  | "ctv"
  | "digital"
  | "seo"
  | "google"
  | "tv"
  | "radio"
  | "outdoor"
  | "social"
  | "email"
  | "branding"
  | "creative"
  | "website"
  | "events"
  | "business";

type ServiceLink = {
  href: string;
  name: string;
  line: string;
  visual: VisualKind;
};

/** Full catalog of service cards used by RelatedServices. */
export const SERVICE_LINKS: ServiceLink[] = [
  {
    href: "/services/google-ads-management/",
    name: "Google Ads Management",
    line: "Search, Display, Shopping, YouTube and Performance Max.",
    visual: "google",
  },
  {
    href: "/services/chatgpt-ads-management/",
    name: "ChatGPT Ads Management",
    line: "Planning for sponsored placements in AI conversations.",
    visual: "chatgpt",
  },
  {
    href: "/services/digital-connected-tv/",
    name: "Connected TV",
    line: "Streaming TV ads targeted by market and audience.",
    visual: "ctv",
  },
  {
    href: "/services/television-advertising/",
    name: "Television Advertising",
    line: "Broadcast and streaming campaigns with in-house creative.",
    visual: "tv",
  },
  {
    href: "/services/radio-advertising/",
    name: "Radio Advertising",
    line: "Local stations and streaming audio that build frequency.",
    visual: "radio",
  },
  {
    href: "/services/outdoor-advertising/",
    name: "Outdoor Advertising",
    line: "Billboards, superboards and transit across Canadian cities.",
    visual: "outdoor",
  },
  {
    href: "/services/digital-marketing/",
    name: "Digital Marketing",
    line: "Paid social, search and programmatic, planned as one.",
    visual: "digital",
  },
  {
    href: "/services/search-engine-optimization/",
    name: "Search Engine Optimization",
    line: "Organic visibility that compounds over time.",
    visual: "seo",
  },
  {
    href: "/services/social-media-marketing/",
    name: "Social Media Marketing",
    line: "Strategy, content and paid social across every platform.",
    visual: "social",
  },
  {
    href: "/services/email-marketing/",
    name: "Email Marketing",
    line: "Campaigns and automations that keep customers coming back.",
    visual: "email",
  },
  {
    href: "/services/corporate-branding/",
    name: "Strategic Corporate Branding",
    line: "Identity systems built to last.",
    visual: "branding",
  },
  {
    href: "/services/creative/",
    name: "Creative & Production",
    line: "Video, photography, design and 3D.",
    visual: "creative",
  },
  {
    href: "/services/website-development/",
    name: "Website Development",
    line: "Custom WordPress and e-commerce builds with ongoing support.",
    visual: "website",
  },
  {
    href: "/corporate-events/",
    name: "Corporate Events",
    line: "Incentive travel, meetings and brand experiences.",
    visual: "events",
  },
  {
    href: "/services/business-development/",
    name: "Business Development",
    line: "Strategy for growth, sale and succession.",
    visual: "business",
  },
];

/** @deprecated Prefer SERVICE_LINKS; kept for callers that still import the advertising subset. */
export const ADVERTISING_LINKS = SERVICE_LINKS.filter((link) =>
  [
    "/services/google-ads-management/",
    "/services/chatgpt-ads-management/",
    "/services/digital-connected-tv/",
    "/services/digital-marketing/",
    "/services/search-engine-optimization/",
    "/services/television-advertising/",
  ].includes(link.href),
);

const BY_HREF = new Map(SERVICE_LINKS.map((link) => [link.href, link]));

type RelatedServicesProps = {
  title: string;
  /** The page this block sits on; it is left out of the list. */
  current: string;
  /**
   * Exact related hrefs in display order (current is still filtered out).
   * When omitted, falls back to the advertising subset.
   */
  include?: string[];
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

  if (kind === "radio") {
    return (
      <div className={styles.visual} data-kind="radio" aria-hidden="true">
        <div className={styles.radioMini}>
          <span className={styles.radioDial}>
            <b>98.7</b>
            <em>FM</em>
          </span>
          <span className={styles.radioWave} aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "outdoor") {
    return (
      <div className={styles.visual} data-kind="outdoor" aria-hidden="true">
        <div className={styles.boardMini}>
          <span className={styles.boardFace}>
            <small>Billboard</small>
            <strong>Open house this weekend</strong>
          </span>
          <span className={styles.boardPost} />
        </div>
      </div>
    );
  }

  if (kind === "social") {
    return (
      <div className={styles.visual} data-kind="social" aria-hidden="true">
        <div className={styles.socialMini}>
          <span className={styles.socialCard}>
            <i />
            <b>Feed post</b>
            <em />
          </span>
          <span className={styles.socialCard} data-dim>
            <i />
            <b>Story</b>
            <em />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "email") {
    return (
      <div className={styles.visual} data-kind="email" aria-hidden="true">
        <div className={styles.emailMini}>
          <span className={styles.emailRow} data-active>
            <b>Spring offer</b>
            <em />
          </span>
          <span className={styles.emailRow}>
            <b>Newsletter</b>
            <em />
          </span>
          <span className={styles.emailRow}>
            <b>Follow-up</b>
            <em />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "branding") {
    return (
      <div className={styles.visual} data-kind="branding" aria-hidden="true">
        <div className={styles.brandMini}>
          <span className={styles.brandMark}>K</span>
          <span className={styles.brandSwatches}>
            <i data-c="1" />
            <i data-c="2" />
            <i data-c="3" />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "creative") {
    return (
      <div className={styles.visual} data-kind="creative" aria-hidden="true">
        <div className={styles.creativeMini}>
          <span className={styles.filmFrame} />
          <span className={styles.filmFrame} data-mid />
          <span className={styles.filmFrame} />
        </div>
      </div>
    );
  }

  if (kind === "website") {
    return (
      <div className={styles.visual} data-kind="website" aria-hidden="true">
        <div className={styles.webMini}>
          <span className={styles.webChrome}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.webBody}>
            <b />
            <em />
            <em />
          </span>
        </div>
      </div>
    );
  }

  if (kind === "events") {
    return (
      <div className={styles.visual} data-kind="events" aria-hidden="true">
        <div className={styles.eventMini}>
          <span className={styles.eventStage}>
            <small>Incentive</small>
            <strong>Las Vegas</strong>
          </span>
          <span className={styles.eventTicket}>
            <b>Day 2</b>
            <em>Keynote</em>
          </span>
        </div>
      </div>
    );
  }

  if (kind === "business") {
    return (
      <div className={styles.visual} data-kind="business" aria-hidden="true">
        <div className={styles.bizMini}>
          <span className={styles.bizBars}>
            <i style={{ height: "38%" }} />
            <i style={{ height: "58%" }} />
            <i style={{ height: "72%" }} />
            <i style={{ height: "92%" }} />
          </span>
          <span className={styles.bizLabel}>Growth plan</span>
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

function resolveLinks(current: string, include?: string[]): ServiceLink[] {
  if (include && include.length > 0) {
    return include
      .filter((href) => href !== current)
      .map((href) => BY_HREF.get(href))
      .filter((link): link is ServiceLink => Boolean(link))
      .slice(0, 4);
  }

  return ADVERTISING_LINKS.filter((link) => link.href !== current).slice(0, 4);
}

export function RelatedServices({ title, current, include, tone = "light", align = "start" }: RelatedServicesProps) {
  const links = resolveLinks(current, include);
  if (links.length === 0) return null;

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
