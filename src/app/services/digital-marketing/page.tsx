import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { FeatureSplit } from "@/components/sections/digital-marketing/FeatureSplit";
import { OfferCards } from "@/components/sections/digital-marketing/OfferCards";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { PageCta } from "@/components/sections/digital-marketing/PageCta";
import { RelatedServices } from "@/components/sections/digital-marketing/RelatedServices";
import { getDigitalMarketingContent } from "@/lib/wordpress/digital-marketing";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/digital-marketing/");
}

export default async function DigitalMarketingPage() {
  const content = await getDigitalMarketingContent();

  return (
    <main>
      <ServiceHero title={content.title} hero={content.hero} />
      <OfferCards
        eyebrow={content.offers.eyebrow}
        title={content.offers.title}
        cards={content.offers.cards}
      />
      {content.features.map((feature) => (
        <FeatureSplit key={`${feature.eyebrow}-${feature.title}`} feature={feature} />
      ))}
      <FaqAccordion
        eyebrow={content.faqs.eyebrow}
        title={content.faqs.title}
        items={content.faqs.items}
      />
      <RelatedServices services={content.relatedServices} />
      <PageCta cta={content.cta} />
    </main>
  );
}
