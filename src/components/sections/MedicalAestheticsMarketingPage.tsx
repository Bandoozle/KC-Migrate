import Image from "next/image";
import Link from "next/link";
import { IndustryIntro } from "@/components/industry/IndustryIntro";
import { IndustryOffers } from "@/components/industry/IndustryOffers";
import { IndustryReasons } from "@/components/industry/IndustryReasons";
import { Reveal } from "@/components/motion/Reveal";
import { PageCta } from "@/components/sections/PageCta";
import { ProcessTrack } from "@/components/sections/ProcessSteps";
import { AestheticsJourney } from "@/components/industry/journeys/AestheticsJourney";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { getIndustry, servicePath, type Industry, type IndustryLanding } from "@/lib/industries";
import { canonicalUrl } from "@/lib/site";
import "@/styles/industry-themes.css";
import styles from "./MedicalAestheticsMarketingPage.module.css";

const UP = "/wp-content/uploads";
const PHONE = { label: "604.925.5800", href: "tel:+16049255800" };

const JOURNEY = [
  { name: "Get found", line: "Search and local visibility for treatments." },
  { name: "Get trusted", line: "Calm brand, reviews and clear education." },
  { name: "Get booked", line: "Treatment pages that convert to appointments." },
  { name: "Keep buying", line: "Retail, recall and product follow-up." },
];

const TRUST_POINTS = [
  { name: "Treatment pages", line: "Plain-language pages for the procedures you want to grow." },
  { name: "Reviews & reputation", line: "Genuine client proof that feels clinical, not salesy." },
  { name: "Booking & cart", line: "One brand system for appointments and product sales." },
];

const SYSTEM = [
  { group: "Get found", items: ["Local SEO", "Google Ads", "Business Profile"] },
  { group: "Build trust", items: ["Branding", "Content", "Reviews"] },
  { group: "Convert", items: ["Website", "Booking UX", "E-commerce"] },
  { group: "Stay connected", items: ["Social", "Email", "Retail"] },
  { group: "Measure", items: ["Analytics", "Reporting", "Strategy"] },
];

const SKINFOLIO = [
  {
    src: `${UP}/2023/09/medical-aesthetics.png`,
    alt: "A Skinfolio ad with SkinCeuticals bottles in black and white",
    label: "Brand",
    className: styles.mosaicBrand,
  },
  {
    src: `${UP}/2026/02/aesthetic-clinic-marketing.jpg`,
    alt: "SkinCeuticals serums lined up with a dropper above them",
    label: "Retail",
    className: styles.mosaicRetail,
  },
  {
    src: `${UP}/2022/01/medical-aesthetics.webp`,
    alt: "A serum dropper and cream on a glass dish",
    label: "Product",
    className: styles.mosaicProduct,
  },
  {
    src: `${UP}/2026/02/medical-skincare-marketing.jpg`,
    alt: "A skincare bottle resting on rippled blue water",
    label: "Campaign",
    className: styles.mosaicCampaign,
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function landingJsonLd(industry: Industry & { landing: IndustryLanding }) {
  const url = canonicalUrl(industry.path);
  const organization = { "@type": "Organization", name: "Kosick Communications", url: canonicalUrl("/") };
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

/** Medical aesthetics main page: industry sections plus Skinfolio-led journey content. */
export function MedicalAestheticsMarketingPage() {
  const industry = getIndustry("medical-aesthetics");
  const landing = industry.landing;
  if (!landing) return null;

  const [introImage, ...reasonPhotos] = landing.gallery;
  const industryWithLanding = { ...industry, landing };

  return (
    <main className={`${styles.page} industry-medical-aesthetics`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd(industryWithLanding)).replace(/</g, "\\u003c") }}
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
      <AestheticsJourney />

      {introImage ? (
        <IndustryIntro
          industry={industry.id}
          headingId="ma-intro"
          label={landing.hero.label}
          title={landing.intro.title}
          paragraphs={landing.intro.paragraphs}
          image={introImage}
        />
      ) : null}

      <section className={styles.journey} aria-labelledby="ma-journey">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>The client journey</p>
              <SectionTitle id="ma-journey" className={styles.title}>
                Marketing built for aesthetics clinics.
              </SectionTitle>
            </div>
            <p className={styles.lead}>
              From the first search to the booked treatment and the products they take home, every channel supports the
              same calm, credible clinic brand.
            </p>
          </div>
          <ProcessTrack
            className={styles.journeyTrack}
            steps={JOURNEY.map((stage, index) => ({
              number: String(index + 1),
              title: stage.name,
              body: stage.line,
            }))}
          />
        </div>
      </section>

      <IndustryOffers industry={industry} headingId="ma-offers" />

      <section className={styles.trust} aria-labelledby="ma-trust">
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustCopy}>
              <p className={styles.label}>Conversion &amp; reputation</p>
              <SectionTitle id="ma-trust" className={styles.display}>
                Turn research into bookings and product sales.
              </SectionTitle>
              <p className={styles.lead}>
                Aesthetics clients compare clinics carefully. Clear treatment pages, genuine reviews and a simple path
                to book or buy make that decision easier.
              </p>
              <ul className={styles.points}>
                {TRUST_POINTS.map((point) => (
                  <li key={point.name}>
                    <span className={styles.pointName}>{point.name}</span>
                    <span className={styles.pointLine}>{point.line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Reveal variant="fade" className={styles.trustMedia}>
              <div className={styles.trustPhoto}>
                <Image
                  src={`${UP}/2026/02/aesthetic-clinic-marketing.jpg`}
                  alt="SkinCeuticals serums lined up with a dropper above them"
                  fill
                  sizes="(min-width: 960px) 50vw, 100vw"
                  className={styles.cover}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.campaign} aria-labelledby="ma-campaign">
        <div className="container">
          <div className={styles.campaignHead}>
            <p className={styles.labelOnDark}>Skinfolio Medesthetics</p>
            <SectionTitle id="ma-campaign" className={styles.displayOnDark}>
              One clinic brand across treatments and retail.
            </SectionTitle>
            <p className={styles.leadOnDark}>
              Brand, website, e-commerce and campaigns planned so Skinfolio Medesthetics feels as considered online as
              it does in the clinic.
            </p>
          </div>
          <div className={styles.mosaic}>
            {SKINFOLIO.map((tile, index) => (
              <Reveal key={tile.label} variant="fade" delay={index * 90} className={`${styles.mosaicTile} ${tile.className}`}>
                <Image src={tile.src} alt={tile.alt} fill sizes="(min-width: 960px) 40vw, 100vw" className={styles.cover} />
                <span className={styles.mosaicLabel}>{tile.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <IndustryReasons industry={industryWithLanding} photos={reasonPhotos} />

      <section className={styles.system} aria-labelledby="ma-system">
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.label}>Everything you need to grow</p>
              <SectionTitle id="ma-system" className={styles.title}>
                One system for clinic growth.
              </SectionTitle>
            </div>
          </div>
          <div className={styles.groups}>
            {SYSTEM.map((group, index) => (
              <div key={group.group} className={styles.group}>
                <span className={styles.groupNumber}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.groupName}>{group.group}</h3>
                <ul className={styles.groupItems}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link className={styles.button} href="/contact/">
            Talk to our team
            <ArrowIcon />
          </Link>
        </div>
      </section>

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
