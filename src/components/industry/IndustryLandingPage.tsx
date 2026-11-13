import type { ReactNode } from "react";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { servicePath, type Industry, type IndustryLanding } from "@/lib/industries";
import { ORGANIZATION_REF } from "@/lib/seo/organization";
import { canonicalUrl } from "@/lib/site";
import { INDUSTRY_FAQS } from "@/lib/industries/faqs";
import { IndustryFaqs } from "./IndustryFaqs";
import { IndustryIntro } from "./IndustryIntro";
import { IndustryOffers } from "./IndustryOffers";
import { IndustryReasons } from "./IndustryReasons";
import { RetailAttention } from "./RetailAttention";
import "@/styles/industry-themes.css";
import styles from "./IndustryLandingPage.module.css";

const PHONE = { label: "604.925.5800", href: "tel:+16049255800" };

/* These pages have no Rank Math record, so their structured data is written here */
function landingJsonLd(industry: Industry & { landing: IndustryLanding }) {
  const url = canonicalUrl(industry.path);
  const organization = ORGANIZATION_REF;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: industry.name,
        description: industry.landing.seo.description,
        url,
        areaServed: "CA",
        provider: organization,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: industry.name,
          itemListElement: industry.services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title, url: canonicalUrl(servicePath(industry, service)) },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Marketing Programs", item: canonicalUrl("/marketing-programs/") },
          { "@type": "ListItem", position: 3, name: industry.name, item: url },
        ],
      },
    ],
  };
}

type IndustryLandingPageProps = {
  industry: Industry & { landing: IndustryLanding };
  /** The industry's own interactive journey, passed in so each page loads only its own. */
  journey: ReactNode;
};

/** Main page for an industry that has no WordPress page: the shared service hero, then the industry's own sections. */
export function IndustryLandingPage({ industry, journey }: IndustryLandingPageProps) {
  const { landing } = industry;
  const [introImage, ...reasonPhotos] = landing.gallery;

  return (
    <main className={`${styles.page} industry-${industry.id}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd(industry)).replace(/</g, "\\u003c") }}
      />
      <ServiceHero
        title={industry.name}
        hero={{
          slides: [{ src: landing.hero.image.src, alt: landing.hero.image.alt }],
          eyebrow: industry.services.map((service) => service.title.replace(/ & .*$/, "")).join(" • "),
          displayTitle: "Strategic",
          titleSecondary: industry.name,
          subtitle: landing.hero.lead,
        }}
        backgroundPosition={landing.hero.image.position}
      />
      {journey}

      {/* Intro: why the industry needs its own approach, with the first photograph */}
      {landing.moments ? (
        <RetailAttention label={landing.hero.label} landing={{ ...landing, moments: landing.moments }} />
      ) : introImage ? (
        <IndustryIntro
          industry={industry.id}
          headingId="ind-intro"
          label={landing.hero.label}
          title={landing.intro.title}
          paragraphs={landing.intro.paragraphs}
          image={introImage}
        />
      ) : null}

      <IndustryOffers industry={industry} headingId="ind-offers" />

      {/* How we plan: composed differently for each industry */}
      <IndustryReasons industry={industry} photos={reasonPhotos} />

      <IndustryFaqs items={INDUSTRY_FAQS[industry.id]} />

      <PageCta
        cta={{
          title: industry.cta.title,
          description: industry.cta.description,
          primary: { label: "Contact us", href: "/contact/" },
          phone: PHONE,
        }}
      />
    </main>
  );
}
