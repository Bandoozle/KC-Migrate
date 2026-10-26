import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionDescription, SectionTitle } from "@/components/typography";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { CampaignFlow, type CampaignStep } from "./CampaignFlow";
import { TelevisionLineup, type TelevisionLineupItem, type TelevisionStill } from "./TelevisionLineup";
import {
  TelevisionStoryboard,
  type TelevisionFrame,
  type TelevisionProductionStep,
} from "./TelevisionStoryboard";
import styles from "./TelevisionAdvertisingPage.module.css";

type TelevisionAdvertisingPageProps = {
  content: ServicePageContent;
  /** Creative & Production page, the published source for production-step copy. */
  creative?: ServicePageContent | null;
};

const PRODUCTION_STEPS = ["Concept development", "Scriptwriting", "Full production", "Post-production"];

const COMMERCIAL_FRAMES: TelevisionFrame[] = [
  { src: "/images/television/spot-interface.png", alt: "Television commercial" },
  { src: "/images/television/spot-scene.png", alt: "Television commercial" },
  { src: "/images/television/spot-title.png", alt: "Television commercial", super: "We run together" },
  { src: "/images/television/spot-end.png", alt: "Television commercial", super: "It’s Hard To Stop A Trane." },
];

const PRODUCTION_FOOTAGE: TelevisionFrame[] = [
  { src: "/images/television/trane-poster.png", alt: "Trane unit under stage lighting, from the Trane television commercial" },
  { src: "/images/television/spot-interface.png", alt: "Hand on a touchscreen control, from the Trane television commercial" },
  { src: "/images/television/spot-scene.png", alt: "Overhead live-action shot from the Trane television commercial" },
];

const CAMPAIGN_STEPS: CampaignStep[] = [
  { label: "Broadcast", title: "National and local placement", body: "Broadcast network buys, from local spots to national campaigns." },
  { label: "Streaming", title: "Connected TV and OTT", body: "Streaming campaigns that extend reach beyond the broadcast." },
  { label: "Amplify", title: "Cross-channel strategy", body: "Digital and out-of-home planned alongside TV for maximum reach." },
  { label: "Produce", title: "Commercial production", body: "Compelling TV commercials, from concept to final cut." },
];

function sentenceCase(value: string) {
  const acronyms = new Set(["TV", "CTV", "OTT", "SEO", "ROI", "PPC", "CTA", "AI", "GRP", "GRPs"]);
  return value.trim().replace(/[A-Za-z][A-Za-z'’]*/g, (word, offset, full) => {
    const possessive = word.match(/^canada(['’]s)?$/i);
    if (possessive) return `Canada${possessive[1] ?? ""}`;
    const upper = word.toUpperCase();
    if (acronyms.has(upper)) return upper;
    const before = full.slice(0, offset);
    const isStart = !before.trim() || /[.!?]\s*$/.test(before);
    if (isStart) return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return word.toLowerCase();
  });
}

function sentenceCta(cta: { label: string; href: string } | null | undefined) {
  if (!cta) return null;
  return { ...cta, label: sentenceCase(cta.label) };
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function TelevisionAdvertisingPage({ content, creative }: TelevisionAdvertisingPageProps) {
  const cards = content.offerGroups.flatMap((group) => group.cards);
  const linearCard = cards.find((card) => /linear/i.test(card.title));
  const connectedCard = cards.find((card) => /connected|streaming/i.test(card.title));
  const buyingCard = cards.find((card) => /buying|negotiation/i.test(card.title));
  const performanceCard = cards.find((card) => /performance|tracking|analytic/i.test(card.title));

  const reach = content.features.find((feature) => /audience|linear/i.test(`${feature.title} ${feature.eyebrow || ""}`));
  const mix = content.features.find((feature) => /media mix/i.test(feature.title));
  const targeting = content.features.find((feature) => /creative|audience/i.test(feature.title) && feature !== reach);

  const networks = content.faqs?.items.find((item) => /networks and platforms/i.test(item.question));
  const production = content.faqs?.items.find((item) => /creative|commercial/i.test(item.question));
  const stillFor = (index: number): TelevisionStill => COMMERCIAL_FRAMES[index] ?? COMMERCIAL_FRAMES[0];
  const creativeProcess = creative?.processSection?.steps ?? [];
  const creativeBullets = creative?.features.flatMap((feature) => feature.bullets ?? []) ?? [];
  const creativeCards = creative?.offerGroups.flatMap((group) => group.cards) ?? [];
  const processBody = (pattern: RegExp) => creativeProcess.find((step) => pattern.test(step.title))?.body;
  const creativeBullet = (pattern: RegExp) => creativeBullets.find((bullet) => pattern.test(bullet));
  const placement = reach?.bullets?.find((bullet) => /placement|broadcast network/i.test(bullet));
  const networkList = networks?.answer.match(/including (.+?), as well as U\.S\. networks like (.+?)\./i);
  const splitNetworks = (value?: string) =>
    value
      ?.split(/,\s*(?:and\s+)?|\s+and\s+/)
      .map((name) => name.trim())
      .filter(Boolean) ?? [];

  const STEP_COPY: Record<string, Omit<TelevisionProductionStep, "id" | "label" | "title">> = {
    "Concept development": {
      body: processBody(/discovery|strategy/i),
      detail: creativeBullet(/pre-production planning/i),
      visual: "storyboard",
    },
    Scriptwriting: {
      body: processBody(/concept|pre-production/i),
      visual: "script",
    },
    "Full production": {
      body: processBody(/production\s*&\s*creation|^production/i),
      detail: creativeBullet(/cinematography/i),
      visual: "footage",
    },
    "Post-production": {
      body: creativeBullet(/post-production editing/i),
      detail: creativeCards.find((card) => /audio/i.test(card.title))?.body,
      visual: "edit",
    },
  };

  const storySteps: TelevisionProductionStep[] = PRODUCTION_STEPS.filter((step) =>
    production?.answer.toLowerCase().includes(step.toLowerCase()),
  ).map((step) => ({ id: step.toLowerCase().replace(/[^a-z]+/g, "-"), label: step, title: step, ...STEP_COPY[step] }));
  if (placement) {
    storySteps.push({
      id: "placement",
      label: "Broadcast placement",
      title: placement,
      body: linearCard?.body,
      detail: networks?.answer.match(/\.\s+([A-Z][^.]*\.)\s*$/)?.[1],
      visual: "networks",
    });
  }
  const networkGroups = networkList
    ? [
        { label: "Canada", names: splitNetworks(networkList[1]) },
        { label: "United States", names: splitNetworks(networkList[2]) },
      ]
    : [];
  const productionTitle =
    reach?.bullets?.find((bullet) => /commercial production/i.test(bullet)) || production?.question;

  const video = content.hero.slides.find((slide) => slide.kind === "video" && /trane-web/i.test(slide.src))
    || content.hero.slides.find((slide) => slide.kind === "video");

  const lineup: TelevisionLineupItem[] = [];
  if (linearCard) {
    lineup.push({
      id: "linear",
      label: linearCard.title,
      summary: linearCard.body || "",
      cta: null,
      visual: "broadcast",
      still: stillFor(1),
    });
  }
  if (connectedCard || mix) {
    lineup.push({
      id: "connected",
      label: connectedCard?.title || "Connected TV",
      summary: connectedCard?.body || mix?.body || "",
      cta: sentenceCta(mix?.cta),
      visual: "streaming",
      still: stillFor(2),
    });
  }
  if (buyingCard || targeting) {
    lineup.push({
      id: "buying",
      label: buyingCard?.title || "Media buying",
      summary: buyingCard?.body || targeting?.body || "",
      cta: sentenceCta(targeting?.cta),
      visual: "plan",
    });
  }
  if (performanceCard) {
    lineup.push({
      id: "performance",
      label: performanceCard.title,
      summary: performanceCard.body || "",
      cta: null,
      visual: "report",
    });
  }

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {reach && video ? (
        <section className={`section ${styles.reel}`} aria-labelledby="tv-reach">
          <div className="container">
            <h2 id="tv-reach" className={styles.reelTitle}>
              Big-screen reach, planned as one campaign.
            </h2>
            <Reveal variant="fade">
              <figure className={styles.screen}>
                <video
                  className={styles.video}
                  controls
                  playsInline
                  preload="metadata"
                  poster="/images/television/trane-poster.png"
                  src={video.src}
                  aria-label="Television commercial"
                />
              </figure>
            </Reveal>
            <CampaignFlow steps={CAMPAIGN_STEPS} label="How a television campaign comes together" />
            <div className={styles.reelLead}>
              <p className={styles.reelBody}>
                Television still delivers unmatched reach and credibility. Kosick plans broadcast campaigns from
                local spots to national buys, then connects them with streaming, digital and out-of-home so every
                channel works together.
              </p>
              <Link className={styles.light} href={reach.cta?.href || "/contact/"}>
                Plan a television campaign
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {content.intro && lineup.length > 0 ? (
        <TelevisionLineup
          eyebrow={content.intro.eyebrow}
          title={content.intro.title}
          items={lineup}
        />
      ) : null}

      {content.partnerLogos && content.partnerLogos.logos.length > 0 ? (
        <section className={`section ${styles.networks}`} aria-labelledby="tv-networks">
          <div className="container">
            {content.partnerLogos.title ? (
              <SectionTitle id="tv-networks">{content.partnerLogos.title}</SectionTitle>
            ) : null}
            {content.partnerLogos.description || networks?.answer ? (
              <SectionDescription className={styles.networksLead}>
                {content.partnerLogos.description || networks?.answer}
              </SectionDescription>
            ) : null}
            <ul className={styles.brandWall}>
              {content.partnerLogos.logos.map((logo, index) => {
                const name = getPartnerName(logo, index);
                return (
                  <li key={`${logo.src}-${index}`} className={styles.brandTile}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt="" />
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {productionTitle && storySteps.length > 1 ? (
        <TelevisionStoryboard
          title={sentenceCase(productionTitle)}
          body={production?.answer.replace(/^Absolutely\.\s*/i, "")}
          steps={storySteps}
          frames={COMMERCIAL_FRAMES}
          footage={PRODUCTION_FOOTAGE}
          networks={networkGroups}
        />
      ) : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion
          eyebrow={content.faqs.eyebrow}
          title={content.faqs.title}
          items={content.faqs.items}
        />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
