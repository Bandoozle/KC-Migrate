import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/typography";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { PageCta } from "@/components/sections/PageCta";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import type { FeatureSplitData } from "@/components/sections/FeatureSplit";
import { eyebrowLabel } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./DentalMarketingPage.module.css";

type DentalMarketingPageProps = {
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

export function DentalMarketingPage({ content }: DentalMarketingPageProps) {
  const offers = content.offerGroups.flatMap((group) => group.cards);
  const packages =
    content.packageSections.length > 0
      ? content.packageSections
      : content.packageSection
        ? [content.packageSection]
        : [];
  const packageCards = packages.flatMap((section) => section.cards);
  const leads =
    content.leadSections.length > 0
      ? content.leadSections
      : content.leadSection
        ? [content.leadSection]
        : [];

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {offers.length > 0 ? (
        <section className={styles.journey} aria-label="Patient journey">
          <div className="container">
            {content.intro?.title ? <SectionTitle as="h2">{content.intro.title}</SectionTitle> : null}
            {content.intro?.body ? <p className={styles.lead}>{content.intro.body}</p> : null}
            <div className={styles.journeyList}>
              {offers.map((card, index) => {
                const offerTargets = [0, 0, 1, 1];
                const feature = content.features[offerTargets[index] ?? index];
                const href = feature ? `#${chapterId(feature.title)}` : undefined;
                const inner = (
                  <>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{card.title}</strong>
                    {card.body ? <p>{card.body}</p> : null}
                  </>
                );
                return href ? (
                  <a key={card.id || card.title} href={href} className={styles.journeyStep}>
                    {inner}
                  </a>
                ) : (
                  <article key={card.id || card.title} className={styles.journeyStep}>
                    {inner}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <div className={styles.chapters}>
        {content.features.map((feature) => (
          <DentalChapter key={feature.title} feature={feature} />
        ))}
      </div>

      {packageCards.length > 0 ? (
        <section className={styles.menu}>
          <div className="container">
            <SectionTitle as="h2">Everything You Need to Grow</SectionTitle>
            <p className={styles.lead}>
              From digital campaigns to local visibility and creative, we bring every part of your dental marketing
              together.
            </p>
            <div className={styles.menuGrid}>
              {packageCards.map((card) => (
                <article key={card.id || card.title}>
                  <h3>{card.title}</h3>
                  {card.body ? <p className={styles.body}>{card.body}</p> : null}
                  {card.items && card.items.length > 0 ? (
                    <ul>
                      {card.items.map((item) => (
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

      {leads.map((lead, index) => (
        <section key={`lead-${lead.title || index}`} className={styles.menu}>
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

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion
          eyebrow={content.faqs.eyebrow}
          title={content.faqs.title}
          items={content.faqs.items}
        />
      ) : null}

      {content.relatedServices.length > 0 ? <RelatedServices services={content.relatedServices} /> : null}

      {content.cta ? (
        <PageCta
          cta={
            /email/i.test(`${content.cta.title} ${content.cta.description || ""}`)
              ? {
                  ...content.cta,
                  title: "Ready to Grow Your Practice?",
                  description:
                    "Let’s talk about a dental marketing plan that helps your practice get found, earn trust, and turn interest into booked appointments.",
                }
              : content.cta
          }
        />
      ) : null}
    </main>
  );
}

function DentalChapter({ feature }: { feature: FeatureSplitData }) {
  const eyebrow = eyebrowLabel(feature.eyebrow, feature.title);
  return (
    <section id={chapterId(feature.title)} className={styles.chapter}>
      <div className={`container ${styles.chapterGrid}`}>
        <div className={styles.copy}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <SectionTitle as="h2">{readableTitle(feature.title)}</SectionTitle>
          {feature.body ? <p className={styles.body}>{feature.body}</p> : null}
          {feature.bullets && feature.bullets.length > 0 ? (
            <ul className={styles.bullets}>
              {feature.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {feature.cta ? (
            <ActionLink href={feature.cta.href} className={styles.solid}>
              {feature.cta.label}
            </ActionLink>
          ) : null}
        </div>
        {feature.image?.src ? (
          <div className={styles.figure}>
            <Image
              src={feature.image.src}
              alt={feature.image.alt || feature.title}
              fill
              sizes="(max-width: 959px) 100vw, 34vw"
              className={styles.photo}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
