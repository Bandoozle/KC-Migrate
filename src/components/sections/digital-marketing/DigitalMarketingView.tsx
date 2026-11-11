import Link from "next/link";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import type { DigitalMarketingContent, FeatureBlock } from "@/lib/wordpress/digital-marketing";
import { AudienceJourney } from "./AudienceJourney";
import { ChannelShowcase } from "./ChannelShowcase";
import { FaqAccordion } from "./FaqAccordion";
import { GeoTargeting } from "./GeoTargeting";
import { PageCta } from "./PageCta";
import { PerformanceDashboard } from "./PerformanceDashboard";
import { ServiceDirectory } from "./ServiceDirectory";
import styles from "./DigitalMarketingView.module.css";

const HERO_LEAD =
  "Google Ads, Meta Ads and geo-targeted campaigns built to reach the right audience, turn interest into leads and enquiries, and show you exactly where your budget is working.";

function sentence(value: string) {
  const trimmed = value.trim();
  const fixed = trimmed
    .toLowerCase()
    .replace(/\bppc\b/g, "PPC")
    .replace(/\bgoogle( ads)?\b/g, (_, ads) => (ads ? "Google Ads" : "Google"));
  return fixed ? fixed.charAt(0).toUpperCase() + fixed.slice(1) : fixed;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Checks({ items, dark = false }: { items: string[]; dark?: boolean }) {
  if (items.length === 0) return null;
  return (
    <ul className={dark ? `${styles.checks} ${styles.checksDark}` : styles.checks}>
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

type DigitalMarketingViewProps = {
  content: DigitalMarketingContent;
};

/**
 * Digital Marketing, rebuilt around what each channel does: the four paid
 * channels, how an ad turns into a lead, where ads run, and how results are
 * tracked. Copy and links come from the page content; the visuals explain.
 */
export function DigitalMarketingView({ content }: DigitalMarketingViewProps) {
  const [connect, decide, track] = content.features as Array<FeatureBlock | undefined>;
  const hero = {
    ...content.hero,
    subtitle: HERO_LEAD,
    slides: [
      {
        src: "/wp-content/uploads/2026/06/social-media-advertising.jpg",
        alt: "A social media ad campaign on a phone beside a laptop",
        kind: "image" as const,
      },
    ],
  };

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Connect: Target → Reach → Engage → Lead, first under the hero */}
      {connect ? (
        <AudienceJourney
          title={sentence(connect.title)}
          lead="Digital advertising lets you choose who sees your message, then turns their interest into a call or an enquiry. We build campaigns around the customers most likely to buy, from one neighbourhood to the whole country."
        />
      ) : null}

      {/* Channels: four paid media channels, each showing what an ad there looks like */}
      <section className={`${styles.section} ${styles.dark}`} aria-labelledby="dm-channels">
        <div className="container">
          <header className={styles.head}>
            <p className={styles.labelOnDark}>Paid media channels</p>
            <SectionTitle id="dm-channels" className={styles.titleOnDark}>
              {sentence(content.offers.title || "Digital marketing campaigns")}
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Four ways to put your business in front of people likely to buy, each built around a clear next step: a
              call, an enquiry or a sale.
            </p>
          </header>
          <ChannelShowcase cards={content.offers.cards} />
        </div>
      </section>

      {/* Decide where: geo-targeting you can see */}
      {decide ? (
        <section className={`${styles.section} ${styles.light}`} aria-labelledby="dm-where">
          <div className={`container ${styles.split}`}>
            <div className={styles.copy}>
              {decide.eyebrow ? <p className={styles.label}>{sentence(decide.eyebrow)}</p> : null}
              <SectionTitle id="dm-where" className={styles.title}>
                {sentence(decide.title)}
              </SectionTitle>
              <p className={styles.lead}>
                Go local or go national. Geo-targeted advertising puts your ads in front of people in the areas you
                serve, at the times they&rsquo;re likely to act, so spend goes where it can become a customer. Across
                Google Search, YouTube and display, we refine keywords, bids and creative as the data comes in.
              </p>
              <Checks items={decide.bullets} />
              {decide.cta ? (
                <Link className={styles.button} href={decide.cta.href}>
                  Plan a campaign
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
            <GeoTargeting />
          </div>
        </section>
      ) : null}

      {/* Track: what's measured, from which channel */}
      {track ? (
        <section className={`${styles.section} ${styles.dark}`} aria-labelledby="dm-track">
          <div className={`container ${styles.trackGrid}`}>
            <div className={styles.copy}>
              <p className={styles.labelOnDark}>Campaign performance tracking</p>
              <SectionTitle id="dm-track" className={styles.titleOnDark}>
                {sentence(track.title)}
              </SectionTitle>
              <p className={styles.leadOnDark}>
                We track every click, call, form and sale back to the campaign that produced it, so you can see which
                ads bring in leads and where to put the next dollar. Reporting is clear and jargon-free, with monthly
                reviews of what&rsquo;s working.
              </p>
              <Checks items={track.bullets} dark />
            </div>
            <PerformanceDashboard />
          </div>
        </section>
      ) : null}

      <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      <ServiceDirectory services={content.relatedServices} />
      <PageCta cta={content.cta} />
    </main>
  );
}
