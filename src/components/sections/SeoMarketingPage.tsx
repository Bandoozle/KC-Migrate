import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import {
  BodyText,
  Eyebrow,
  SectionDescription,
  SectionTitle,
} from "@/components/typography";
import { eyebrowLabel } from "@/lib/eyebrow";
import type { ServiceInfoCard, ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./SeoMarketingPage.module.css";

type SeoMarketingPageProps = {
  content: ServicePageContent;
};

const ACRONYMS = new Set(["SEO", "ROI", "PPC", "CTA", "AI", "TV", "OOH"]);

const REPORT_LINES = [
  "Keyword rankings",
  "Organic traffic",
  "Conversion rates",
  "Return on investment",
] as const;

function sentenceCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed
    .split(/(\s+)/)
    .map((part, index) => {
      if (!part || /^\s+$/.test(part)) return part;
      if (index === 0) return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      const bare = part.replace(/[^A-Za-z0-9]/g, "");
      if (ACRONYMS.has(bare.toUpperCase())) return part.toUpperCase();
      if (part === part.toUpperCase() && bare.length > 1) return part.toLowerCase();
      return part;
    })
    .join("");
}

function originalAsset(src: string) {
  return src.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/i, "");
}

function findFeature(content: ServicePageContent, pattern: RegExp) {
  return content.features.find(
    (feature) => pattern.test(feature.title) || pattern.test(feature.eyebrow || ""),
  );
}

function paragraphsOf(body: string) {
  return body
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function reportLines(body: string) {
  const haystack = body.toLowerCase();
  return REPORT_LINES.filter((line) => {
    if (haystack.includes(line.toLowerCase())) return true;
    return line === "Return on investment" && /\broi\b/i.test(body);
  });
}

function capabilityCards(content: ServicePageContent) {
  const wanted =
    /keyword research|on-page|link building|local seo|technical seo|content strategy|competitor|analytics|reporting/i;
  const seen = new Set<string>();
  return [
    ...content.offerGroups.flatMap((group) => group.cards),
    ...content.packageSections.flatMap((section) => section.cards),
  ].filter((card): card is ServiceInfoCard & { body: string } => {
    if (!card.title || !card.body || !wanted.test(card.title)) return false;
    const key = card.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

function ActionLink({ cta }: { cta?: { label: string; href: string } | null }) {
  if (!cta) return null;
  return (
    <Link className={styles.solid} href={cta.href}>
      {cta.label}
      <ArrowIcon />
    </Link>
  );
}

function CopyBlock({ body }: { body: string }) {
  const [lead, ...rest] = paragraphsOf(body);
  if (!lead) return null;
  return (
    <div className={styles.copy}>
      <SectionDescription>{lead}</SectionDescription>
      {rest.map((paragraph) => (
        <BodyText key={paragraph}>{paragraph}</BodyText>
      ))}
    </div>
  );
}

export function SeoMarketingPage({ content }: SeoMarketingPageProps) {
  const cards = capabilityCards(content);
  const [leadCard, ...indexCards] = cards;
  const search = findFeature(content, /search engine optimization \(seo\)/i);
  const local = findFeature(content, /local search engine/i);
  const report = findFeature(content, /drives real growth|account reporting/i);
  const vancouver = content.leadSections.find((section) => /vancouver/i.test(section.title || ""));
  const searchImage = search?.image?.src ? originalAsset(search.image.src) : "";
  const localPhoto = content.hero.slides.find((slide) => slide.kind !== "video");
  const lines = report?.body ? reportLines(report.body) : [];
  const analytics = cards.find((card) => /analytics|reporting/i.test(card.title));
  const introTitle = content.intro?.title?.trim() || "";
  const introIsFeature = content.features.some(
    (feature) => feature.title.trim().toLowerCase() === introTitle.toLowerCase(),
  );
  const indexHeading = introIsFeature ? "" : introTitle;

  const reportEyebrow = eyebrowLabel(report?.eyebrow, report?.title);

  return (
    <article className={styles.page}>
      <ServiceHero
        title={content.title}
        hero={content.hero}
        backgroundPosition="60% 38%"
        backgroundPositionMobile="center 42%"
      />

      {leadCard ? (
        <section className={styles.index} aria-labelledby="seo-capabilities">
          <div className="container">
            <div className={styles.indexIntro}>
              {!introIsFeature && content.intro?.eyebrow ? (
                <Eyebrow>{content.intro.eyebrow}</Eyebrow>
              ) : null}
              <SectionTitle id="seo-capabilities">
                {indexHeading || "What the work covers"}
              </SectionTitle>
            </div>
            <ol className={styles.indexList}>
              <li className={styles.leadRow}>
                <span className={styles.indexNo}>01</span>
                <h3 className={styles.leadTitle}>{leadCard.title}</h3>
                <p className={styles.leadBody}>{leadCard.body}</p>
              </li>
            </ol>
            {indexCards.length > 0 ? (
              <ol className={styles.indexRest} start={2}>
                {indexCards.map((card, index) => (
                  <li key={card.title} className={styles.indexRow}>
                    <span className={styles.indexNo}>{String(index + 2).padStart(2, "0")}</span>
                    <h3 className={styles.indexTitle}>{card.title}</h3>
                    <p className={styles.indexBody}>{card.body}</p>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
        </section>
      ) : null}

      {search ? (
        <section className={styles.search} aria-labelledby="seo-search">
          <div className={`container ${styles.searchGrid}`}>
            <div className={styles.searchCopy}>
              {search.eyebrow ? <Eyebrow>{search.eyebrow}</Eyebrow> : null}
              <SectionTitle id="seo-search">{sentenceCase(search.title)}</SectionTitle>
              {search.body ? <CopyBlock body={search.body} /> : null}
              <ActionLink cta={search.cta} />
            </div>
            {searchImage ? (
              <figure className={styles.searchFigure}>
                <Image
                  src={searchImage}
                  alt="Example Google search for a local service, with related example searches."
                  width={1387}
                  height={1339}
                  unoptimized
                  sizes="(max-width: 959px) 100vw, 760px"
                  style={{ width: "100%", height: "auto" }}
                />
              </figure>
            ) : null}
          </div>
        </section>
      ) : null}

      {local ? (
        <section className={styles.local} aria-labelledby="seo-local">
          <div className={styles.localCopy}>
            {local.eyebrow ? <Eyebrow>{local.eyebrow}</Eyebrow> : null}
            <SectionTitle id="seo-local">{sentenceCase(local.title)}</SectionTitle>
            {local.body ? <CopyBlock body={local.body} /> : null}
            <ActionLink cta={local.cta} />
          </div>
          {localPhoto ? (
            <figure className={styles.localMedia}>
              <Image
                src={originalAsset(localPhoto.src)}
                alt={localPhoto.alt || "Search engine optimization work on a laptop"}
                fill
                unoptimized
                sizes="(max-width: 959px) 100vw, 58vw"
                style={{ objectFit: "cover", objectPosition: "68% 42%" }}
              />
            </figure>
          ) : null}
        </section>
      ) : null}

      {report ? (
        <section className={styles.report} aria-labelledby="seo-report">
          <div className={`container ${styles.reportGrid}`}>
            <div>
              {reportEyebrow ? <p className={styles.reportEyebrow}>{reportEyebrow}</p> : null}
              <h2 id="seo-report" className={styles.reportTitle}>
                {sentenceCase(report.title)}
              </h2>
              {report.body ? (
                <div className={styles.reportCopy}>
                  {paragraphsOf(report.body).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              <ActionLink cta={report.cta} />
            </div>
            {lines.length > 0 ? (
              <div className={styles.ledgerWrap}>
                <ol className={styles.ledger}>
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
                {analytics?.body ? <p className={styles.ledgerNote}>{analytics.body}</p> : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {vancouver && vancouver.paragraphs.length > 0 ? (
        <section className={styles.vancouver} aria-labelledby="seo-vancouver">
          <div className="container">
            {vancouver.title ? (
              <SectionTitle id="seo-vancouver">{sentenceCase(vancouver.title)}</SectionTitle>
            ) : null}
            <div className={styles.vancouverColumns}>
              {vancouver.paragraphs.map((paragraph) => (
                <BodyText key={paragraph}>{paragraph}</BodyText>
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
      {content.relatedServices.length > 0 ? (
        <RelatedServices services={content.relatedServices} />
      ) : null}
      {content.cta ? <PageCta cta={content.cta} /> : null}
    </article>
  );
}
