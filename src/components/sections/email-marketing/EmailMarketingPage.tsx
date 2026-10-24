import Link from "next/link";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { BodyText, Eyebrow, SectionDescription, SectionTitle, SubsectionTitle } from "@/components/typography";
import type { ServiceInfoCard, ServicePageContent } from "@/lib/wordpress/service-page-types";
import { EmailCampaignStage, type CampaignVisual } from "./EmailCampaignStage";
import { EmailCapabilityStudio, type CapabilityStage } from "./EmailCapabilityStudio";
import { EmailJourney } from "./EmailJourney";
import styles from "./EmailMarketingPage.module.css";

type EmailMarketingPageProps = {
  content: ServicePageContent;
};

function originalAsset(src: string) {
  return src.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/i, "");
}

function findCard(cards: ServiceInfoCard[], pattern: RegExp) {
  return cards.find((card) => pattern.test(card.title));
}

function criteriaFrom(body: string) {
  const match = body.match(/based on\s+(.+?)\.?$/i);
  if (!match) return [];
  return match[1]
    .split(/,|\band\b/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
}

function sentenceCase(value: string) {
  const acronyms = new Set(["TV", "SEO", "ROI", "PPC", "CTA", "AI"]);
  return value.trim().replace(/[A-Za-z][A-Za-z']*/g, (word, offset, full) => {
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

function visualLabel(src: string) {
  if (/garden|nursery/i.test(src)) return "Seasonal offer";
  if (/canada|comfort|hvac/i.test(src)) return "Home services";
  return "Campaign visual";
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

export function EmailMarketingPage({ content }: EmailMarketingPageProps) {
  const offerCards = content.offerGroups.flatMap((group) => group.cards);
  const packageCards = content.packageSections.flatMap((section) => section.cards);
  const campaigns = findCard(offerCards, /campaign/i);
  const automation = findCard(offerCards, /automation/i);
  const segmentation = findCard(offerCards, /segment/i);
  const analyticsCard = findCard(offerCards, /analytic|report/i);
  const automationServices = findCard(packageCards, /communication automation/i);
  const reportingServices = findCard(packageCards, /strategy|reporting/i);

  const campaignFeature = content.features.find((feature) => /campaign/i.test(feature.title));
  const journeyFeature = content.features.find((feature) => /journey|automat/i.test(feature.title));
  const analyticsFeature = content.features.find((feature) => /analytic|optim/i.test(feature.title));

  const visuals: CampaignVisual[] = [];
  const seen = new Set<string>();
  for (const feature of content.features) {
    const src = feature.image?.src;
    if (!src || /chatgpt/i.test(src) || seen.has(src)) continue;
    seen.add(src);
    visuals.push({
      src: originalAsset(src),
      alt: feature.image?.alt || "",
      label: visualLabel(src),
    });
  }

  const stages: CapabilityStage[] = [];
  if (campaigns?.body) {
    stages.push({
      id: "campaigns",
      title: campaigns.title,
      body: campaigns.body,
      kind: "campaign",
      lines: [],
      image: visuals[0] ?? null,
    });
  }
  if (automation?.body) {
    stages.push({
      id: "automation",
      title: automation.title,
      body: automation.body,
      kind: "sequence",
      lines: automationServices?.items ?? [],
      image: null,
    });
  }
  if (segmentation?.body) {
    stages.push({
      id: "segmentation",
      title: segmentation.title,
      body: segmentation.body,
      kind: "criteria",
      lines: criteriaFrom(segmentation.body),
      image: null,
    });
  }
  if (analyticsCard?.body) {
    stages.push({
      id: "analytics",
      title: analyticsCard.title,
      body: analyticsCard.body,
      kind: "report",
      lines: reportingServices?.items ?? [],
      image: null,
    });
  }

  const packageTitle =
    content.packageSections.find((section) => section.title)?.title ||
    content.packageSection?.title ||
    "";

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {content.intro && stages.length > 0 ? (
        <EmailCapabilityStudio
          eyebrow={content.intro.eyebrow}
          title={content.intro.title}
          stages={stages}
        />
      ) : null}

      {campaignFeature ? (
        <EmailCampaignStage
          eyebrow={campaignFeature.eyebrow}
          title={sentenceCase(campaignFeature.title)}
          body={campaignFeature.body}
          bullets={campaignFeature.bullets ?? []}
          cta={sentenceCta(campaignFeature.cta)}
          visuals={[...visuals].reverse()}
        />
      ) : null}

      {journeyFeature && (journeyFeature.bullets?.length ?? 0) > 0 ? (
        <EmailJourney
          eyebrow={journeyFeature.eyebrow}
          title={sentenceCase(journeyFeature.title)}
          body={journeyFeature.body}
          steps={journeyFeature.bullets ?? []}
          cta={sentenceCta(journeyFeature.cta)}
        />
      ) : null}

      {analyticsFeature ? (
        <section className={`section ${styles.report}`} aria-labelledby="email-reporting">
          <div className="container">
            {analyticsFeature.eyebrow ? <Eyebrow>{analyticsFeature.eyebrow}</Eyebrow> : null}
            <SectionTitle id="email-reporting">{sentenceCase(analyticsFeature.title)}</SectionTitle>
            {analyticsFeature.body ? (
              <SectionDescription className={styles.lede}>{analyticsFeature.body}</SectionDescription>
            ) : null}
            {(analyticsFeature.bullets?.length ?? 0) > 0 ? (
              <ol className={styles.sheet}>
                {analyticsFeature.bullets?.map((line, index) => (
                  <li key={line}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            {analyticsFeature.cta ? (
              <Link className={styles.solid} href={analyticsFeature.cta.href}>
                {sentenceCase(analyticsFeature.cta.label)}
                <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {packageCards.length > 0 ? (
        <section className={`section ${styles.index}`} aria-labelledby="email-services">
          <div className="container">
            {packageTitle ? <SectionTitle id="email-services">{packageTitle}</SectionTitle> : null}
            <div className={styles.groups}>
              {packageCards.map((card) => (
                <article key={card.title} className={styles.group}>
                  <SubsectionTitle className={styles.groupTitle}>{card.title}</SubsectionTitle>
                  {card.body ? <BodyText className={styles.groupBody}>{card.body}</BodyText> : null}
                  {(card.items?.length ?? 0) > 0 ? (
                    <ul className={styles.items}>
                      {card.items?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
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
