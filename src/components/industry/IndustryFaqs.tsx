import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { faqJsonLd } from "@/lib/industries/faqs";
import type { FaqItem } from "@/lib/wordpress/digital-marketing";

/** The shared FAQ accordion plus its FAQPage structured data, for pages without a WordPress FAQ. */
export function IndustryFaqs({ items }: { items: FaqItem[] | undefined }) {
  if (!items || items.length === 0) return null;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)).replace(/</g, "\\u003c") }}
      />
      <FaqAccordion eyebrow="" title="Frequently asked questions" items={items} />
    </>
  );
}
