import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import type { Industry, IndustryLanding } from "@/lib/industries";
import { IndustryIntro } from "./IndustryIntro";
import { IndustryOffers } from "./IndustryOffers";
import { IndustryReasons } from "./IndustryReasons";
import { RetailAttention } from "./RetailAttention";
import "@/styles/industry-themes.css";
import styles from "./IndustryLandingPage.module.css";

const PHONE = { label: "604.925.5800", href: "tel:+16049255800" };

type IndustryLandingPageProps = {
  industry: Industry & { landing: IndustryLanding };
};

/** Main page for an industry that has no WordPress page: the shared service hero, then the industry's own sections. */
export function IndustryLandingPage({ industry }: IndustryLandingPageProps) {
  const { landing } = industry;
  const [introImage, ...reasonPhotos] = landing.gallery;

  return (
    <main className={`${styles.page} industry-${industry.id}`}>
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
