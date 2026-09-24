import Link from "next/link";
import { BodyText, SectionTitle } from "@/components/typography";
import { EditorialColumns } from "@/components/sections/EditorialColumns";
import { FeatureSplitStack } from "@/components/sections/FeatureSplitStack";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { MediaCardGrid } from "@/components/sections/MediaCardGrid";
import { MediaTabs } from "@/components/sections/MediaTabs";
import { OverlayCardGrid } from "@/components/sections/OverlayCardGrid";
import { PageCta } from "@/components/sections/PageCta";
import { PartnerLogoGrid } from "@/components/sections/PartnerLogoGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceGallery } from "@/components/sections/ServiceGallery";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { VideoEmbed } from "@/components/sections/VideoEmbed";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./ServicePageView.module.css";

type MarketingProgramPageViewProps = {
  content: ServicePageContent;
};

/**
 * Industry marketing program pages (HVAC / Dental / Golf / HVAC Lead Generation).
 * Same content model as service pages, with program-oriented section order.
 */
export function MarketingProgramPageView({ content }: MarketingProgramPageViewProps) {
  const [firstOffers, ...moreOffers] = content.offerGroups;
  const packages =
    content.packageSections.length > 0
      ? content.packageSections
      : content.packageSection
        ? [content.packageSection]
        : [];
  const leads =
    content.leadSections.length > 0
      ? content.leadSections
      : content.leadSection
        ? [content.leadSection]
        : [];

  const packageCards = packages.flatMap((section) => section.cards);
  /** 4 capability cards → one compact row; 6 (HVAC) stays 3×2. */
  const packageColumns: 3 | 4 = packageCards.length === 6 ? 3 : 4;

  return (
    <main>
      <ServiceHero title={content.title} hero={content.hero} />

      {content.intro || firstOffers ? (
        <InfoCardGrid
          eyebrow={content.intro?.eyebrow}
          title={content.intro?.title}
          body={content.intro?.body}
          actions={content.intro?.actions}
          cards={firstOffers?.cards || []}
        />
      ) : null}

      {moreOffers.map((group, index) => (
        <InfoCardGrid
          key={`offers-${index}`}
          cards={group.cards}
          tone={index % 2 === 0 ? "muted" : "default"}
        />
      ))}

      {content.partnerLogos ? <PartnerLogoGrid section={content.partnerLogos} /> : null}

      {content.summary ? (
        <InfoCardGrid
          eyebrow={content.summary.eyebrow}
          title={content.summary.title}
          body={content.summary.body}
          cards={content.summary.cards}
          columns={3}
        />
      ) : null}

      {content.linkBanner ? (
        <section className={`section ${styles.linkBanner}`}>
          <div className={`container ${styles.linkBannerInner}`}>
            <SectionTitle as="h2">{content.linkBanner.title}</SectionTitle>
            <Link href={content.linkBanner.cta.href} className={styles.linkBannerCta}>
              {content.linkBanner.cta.label}
            </Link>
          </div>
        </section>
      ) : null}

      {leads.map((lead, index) => (
        <section
          key={`lead-${lead.title || index}-${lead.paragraphs[0]?.slice(0, 24) || index}`}
          className={`section ${styles.lead}`}
        >
          <div className={`container ${styles.leadInner}`}>
            {lead.title ? <SectionTitle as="h2">{lead.title}</SectionTitle> : null}
            {lead.paragraphs.map((paragraph) => (
              <BodyText key={paragraph.slice(0, 48)}>{paragraph}</BodyText>
            ))}
          </div>
        </section>
      ))}

      <FeatureSplitStack features={content.features} />

      {content.narrative ? <EditorialColumns section={content.narrative} /> : null}

      {content.videoSections.map((section) => (
        <VideoEmbed key={`${section.title || ""}-${section.src}`} section={section} />
      ))}

      {content.processSection ? <ProcessSteps section={content.processSection} /> : null}

      {content.statsSection ? <StatsGrid section={content.statsSection} /> : null}

      {packageCards.length > 0 ? (
        <InfoCardGrid
          title="Everything You Need to Grow"
          body={
            /dental/i.test(content.title)
              ? "From digital campaigns to local visibility and creative, we bring every part of your dental marketing together."
              : /golf/i.test(content.title)
                ? "From digital campaigns to local visibility and creative, we bring every part of your golf marketing together."
                : "From digital campaigns to co-op programs and creative, we bring every part of your HVAC marketing together."
          }
          cards={packageCards}
          columns={packageColumns}
          tone="default"
          introAlign="center"
          density="compact"
        />
      ) : null}

      {content.mediaTabsSection ? <MediaTabs section={content.mediaTabsSection} /> : null}

      {content.mediaCardSection ? <MediaCardGrid section={content.mediaCardSection} /> : null}

      {content.gallerySection ? <ServiceGallery section={content.gallerySection} /> : null}

      {content.overlayCards.length > 0 ? (
        <OverlayCardGrid cards={content.overlayCards} />
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
    </main>
  );
}
