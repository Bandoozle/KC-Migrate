import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/typography";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { GolfChannels } from "@/components/sections/GolfChannels";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { PageCta } from "@/components/sections/PageCta";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import { eyebrowLabel } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./GolfMarketingPage.module.css";

type GolfMarketingPageProps = {
  content: ServicePageContent;
};

function readableTitle(value: string): string {
  if (value !== value.toUpperCase()) return value;
  return value.toLowerCase().replace(/(^|\s)([a-z])/g, (match) => match.toUpperCase());
}

function chapterId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** WordPress `src` is often a 640px resize. The unsuffixed file is the original. */
function originalAsset(src: string): string {
  return src.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/i, "");
}

function ActionLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function FeatureCopy({ feature, spread = false }: { feature: FeatureSplitData; spread?: boolean }) {
  const eyebrow = eyebrowLabel(feature.eyebrow, feature.title);
  const bullets =
    feature.bullets && feature.bullets.length > 0 ? (
      <ul className={styles.bullets}>
        {feature.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null;

  return (
    <div className={spread ? styles.spread : styles.copy}>
      <div className={styles.copy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <SectionTitle as="h2">{readableTitle(feature.title)}</SectionTitle>
        {feature.body ? <p className={styles.lead}>{feature.body}</p> : null}
        {spread ? null : bullets}
        {feature.cta ? (
          <ActionLink href={feature.cta.href} className={styles.solid}>
            {feature.cta.label}
          </ActionLink>
        ) : null}
      </div>
      {spread ? bullets : null}
    </div>
  );
}

function FeaturePhoto({
  feature,
  className,
  sizes,
}: {
  feature: FeatureSplitData;
  className: string;
  sizes: string;
}) {
  if (!feature.image?.src) return null;
  const src = originalAsset(feature.image.src);
  return (
    <div className={className}>
      <Image
        src={src}
        alt={feature.image.alt || feature.title}
        fill
        sizes={sizes}
        unoptimized
        className={styles.photo}
      />
    </div>
  );
}

export function GolfMarketingPage({ content }: GolfMarketingPageProps) {
  const offers = content.offerGroups.flatMap((group) => group.cards);
  const heroPhotoSource =
    content.hero.slides.find((slide) => slide.kind !== "video" && slide.src) ||
    content.features.find((feature) => feature.image?.src)?.image;
  const heroImage = heroPhotoSource?.src
    ? { src: originalAsset(heroPhotoSource.src), alt: heroPhotoSource.alt || content.title }
    : null;
  const hero = heroImage
    ? {
        ...content.hero,
        slides: [{ src: heroImage.src, alt: heroImage.alt, kind: "image" as const }],
      }
    : content.hero;
  const leads =
    content.leadSections.length > 0
      ? content.leadSections
      : content.leadSection
        ? [content.leadSection]
        : [];

  return (
    <main className={styles.page}>
      <ServiceHero
        title={content.title}
        hero={hero}
        backgroundPosition="center 42%"
        backgroundPositionMobile="center 28%"
      />

      {content.intro || offers.length > 0 ? (
        <section className={styles.index}>
          <div className="container">
            {content.intro?.title ? <SectionTitle as="h2">{content.intro.title}</SectionTitle> : null}
            {content.intro?.body ? <p className={styles.lead}>{content.intro.body}</p> : null}
            <div className={styles.indexList}>
              {offers.map((card, index) => (
                <article key={card.id || card.title} className={styles.indexRow}>
                  <span className={styles.indexNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={styles.indexTitle}>{card.title}</h3>
                  {card.body ? <p className={styles.body}>{card.body}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {content.features.map((feature, index) => {
        const id = chapterId(feature.title);
        const last = index === content.features.length - 1;
        const repeatsHero = Boolean(
          heroImage?.src && feature.image?.src && originalAsset(feature.image.src) === heroImage.src,
        );
        if (last) {
          return (
            <section key={feature.title} id={id} className={styles.wide}>
              <div className="container">
                <FeaturePhoto
                  feature={feature}
                  className={styles.wideFigure}
                  sizes="(min-width: 1320px) 1280px, 100vw"
                />
                <FeatureCopy feature={feature} spread />
              </div>
            </section>
          );
        }
        if (repeatsHero) {
          return (
            <section key={feature.title} id={id} className={styles.chapter}>
              <div className="container">
                <FeatureCopy feature={feature} spread />
              </div>
            </section>
          );
        }
        return (
          <section key={feature.title} id={id} className={`${styles.chapter} ${index % 2 === 1 ? styles.flip : ""}`}>
            <div className={`container ${styles.chapterGrid}`}>
              <FeatureCopy feature={feature} />
              <FeaturePhoto feature={feature} className={styles.figure} sizes="(max-width: 959px) 100vw, 640px" />
            </div>
          </section>
        );
      })}

      {content.videoSections.map((section) => (
        <section key={section.title || section.eyebrow || "film"} className={styles.film}>
          <div className="container">
            <div className={styles.copy}>
              {eyebrowLabel(section.eyebrow, section.title) ? (
                <p className={styles.eyebrow}>{eyebrowLabel(section.eyebrow, section.title)}</p>
              ) : null}
              {section.title ? <SectionTitle as="h2">{section.title}</SectionTitle> : null}
            </div>
            {heroImage?.src ? (
              <div className={styles.filmFrame}>
                <Image
                  src={heroImage.src}
                  alt={heroImage.alt || section.title || "Golf campaign"}
                  fill
                  unoptimized
                  sizes="(min-width: 1320px) 1280px, 100vw"
                  className={styles.photo}
                />
              </div>
            ) : null}
          </div>
        </section>
      ))}

      {content.processSection && content.processSection.steps.length > 0 ? (
        <section className={styles.process}>
          <div className="container">
            {content.processSection.title ? (
              <SectionTitle as="h2">{content.processSection.title}</SectionTitle>
            ) : null}
            <p className={styles.lead}>See how we turn strategy into measurable results.</p>
            <ol className={styles.steps}>
              {content.processSection.steps.map((step, index) => (
                <li key={step.title}>
                  <span>{step.number || String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  {step.body ? <p>{step.body}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {leads.map((lead, index) => (
        <section key={`lead-${lead.title || index}`} className={styles.chapter}>
          <div className="container">
            {lead.title ? <SectionTitle as="h2">{lead.title}</SectionTitle> : null}
            {lead.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className={styles.body}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}

      {content.mediaTabsSection ? <GolfChannels section={content.mediaTabsSection} /> : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion
          eyebrow={content.faqs.eyebrow}
          title={content.faqs.title}
          items={content.faqs.items}
        />
      ) : null}

      {content.relatedServices.length > 0 ? <RelatedServices services={content.relatedServices} /> : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
