import Link from "next/link";
import { BodyText, SectionTitle } from "@/components/typography";
import { FeatureSplitStack } from "@/components/sections/FeatureSplitStack";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { HeroCarousel } from "@/components/sections/digital-marketing/HeroCarousel";
import { PageCta } from "@/components/sections/PageCta";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { InfoCardGrid } from "@/components/sections/InfoCardGrid";
import { MediaCardGrid } from "@/components/sections/MediaCardGrid";
import { OverlayCardGrid } from "@/components/sections/OverlayCardGrid";
import { PartnerLogoGrid } from "@/components/sections/PartnerLogoGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ServiceGallery } from "@/components/sections/ServiceGallery";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./ServicePageView.module.css";

type ServicePageViewProps = {
  content: ServicePageContent;
};

export function ServicePageView({ content }: ServicePageViewProps) {
  const [firstOffers, ...moreOffers] = content.offerGroups;

  return (
    <main>
      <HeroCarousel slides={content.hero.slides} title={content.title} />

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

      {content.mediaCardSection ? (
        <MediaCardGrid section={content.mediaCardSection} />
      ) : null}

      {content.gallerySection ? (
        <ServiceGallery section={content.gallerySection} />
      ) : null}

      <FeatureSplitStack features={content.features} />

      {content.packageSections.length > 0
        ? content.packageSections.map((section, index) => (
            <InfoCardGrid
              key={`packages-${section.title || index}`}
              title={section.title || undefined}
              cards={section.cards}
              tone="muted"
            />
          ))
        : content.packageSection ? (
            <InfoCardGrid
              title={content.packageSection.title}
              cards={content.packageSection.cards}
              tone="muted"
            />
          ) : null}

      {content.processSection ? (
        <ProcessSteps section={content.processSection} />
      ) : null}

      {content.partnerLogos ? (
        <PartnerLogoGrid section={content.partnerLogos} />
      ) : null}

      {(content.leadSections.length > 0
        ? content.leadSections
        : content.leadSection
          ? [content.leadSection]
          : []
      ).map((lead, index) => (
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

      {content.overlayCards.length > 0 ? (
        <OverlayCardGrid cards={content.overlayCards} />
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
