import { FeatureSplit } from "@/components/sections/FeatureSplit";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { PageCta } from "@/components/sections/PageCta";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { PromoBand } from "@/components/sections/PromoBand";
import { VideoEmbed } from "@/components/sections/VideoEmbed";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./CorporateEventsPageView.module.css";

type CorporateEventsPageViewProps = {
  content: ServicePageContent;
};

/**
 * Corporate Events composition: hero with slider copy → feature splits →
 * process → videos → promo band → FAQ → related → CTA.
 * Uses ServicePageContent but does not share ServicePageView section order.
 */
export function CorporateEventsPageView({ content }: CorporateEventsPageViewProps) {
  const heroTitle = content.hero.displayTitle || content.title;

  return (
    <main className={styles.main}>
      <HeroBanner
        slides={content.hero.slides.map((slide) => ({
          src: slide.src,
          alt: slide.alt || heroTitle,
          kind: slide.kind,
        }))}
        title={heroTitle}
        eyebrow={content.hero.eyebrow}
        subtitle={content.hero.subtitle}
        cta={content.hero.cta}
      />

      {content.features.map((feature, index) => (
        <FeatureSplit
          key={`${feature.eyebrow || ""}-${feature.title}-${index}`}
          feature={feature}
        />
      ))}

      {content.processSection ? (
        <ProcessSteps section={content.processSection} />
      ) : null}

      {content.videoSections.map((section) => (
        <VideoEmbed key={section.src} section={section} />
      ))}

      {content.promoBand ? <PromoBand band={content.promoBand} /> : null}

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
