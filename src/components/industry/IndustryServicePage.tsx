import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageCta } from "@/components/sections/PageCta";
import { ProcessTrack } from "@/components/sections/ProcessSteps";
import { PageTitle, SectionTitle } from "@/components/typography";
import { serviceHeroActions } from "@/lib/content/industry-heroes";
import { servicePath, type Industry, type IndustryId, type IndustryService } from "@/lib/industries";
import { canonicalUrl } from "@/lib/site";
import { Breadcrumbs } from "./Breadcrumbs";
import { IndustryIntro } from "./IndustryIntro";
import "@/styles/industry-themes.css";
import styles from "./IndustryServicePage.module.css";

type Variant = { hero: string; offers: string };

/* One content structure; each industry composes the hero and its offers differently */
const VARIANTS: Record<IndustryId, Variant> = {
  hvac: { hero: "heroSplit", offers: "offersRows" },
  "medical-dental": { hero: "heroFramed", offers: "offersTiles" },
  golf: { hero: "heroCourse", offers: "offersScorecard" },
  retail: { hero: "heroEditorial", offers: "offersIndex" },
  "specialty-retail": { hero: "heroShopfront", offers: "offersTags" },
  construction: { hero: "heroBlueprint", offers: "offersSpec" },
  travel: { hero: "heroPostcard", offers: "offersItinerary" },
};

/* Hero photography fills the hero on these; elsewhere it sits in a frame */
const BACKDROP_HEROES = new Set(["heroCourse", "heroPostcard"]);
const DARK_HEROES = new Set(["heroCourse", "heroPostcard", "heroEditorial", "heroBlueprint"]);

const PHONE = { label: "604.925.5800", href: "tel:+16049255800" };

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

function offerIndex(id: IndustryId, index: number): string {
  const n = index + 1;
  if (id === "golf") return `Hole ${n}`;
  if (id === "construction") return `Spec ${String(n).padStart(2, "0")}`;
  if (id === "travel") return `Stop ${n}`;
  return String(n).padStart(2, "0");
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function serviceJsonLd(industry: Industry, service: IndustryService) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.title} for ${industry.name.replace(/ Marketing$/, "")}`,
    serviceType: service.title,
    description: service.seo.description,
    url: canonicalUrl(servicePath(industry, service)),
    areaServed: "CA",
    provider: {
      "@type": "Organization",
      name: "Kosick Communications",
      url: canonicalUrl("/"),
    },
  };
}

type IndustryServicePageProps = {
  industry: Industry;
  service: IndustryService;
};

export function IndustryServicePage({ industry, service }: IndustryServicePageProps) {
  const variant = VARIANTS[industry.id];
  const backdrop = BACKDROP_HEROES.has(variant.hero);
  const actions = serviceHeroActions();
  const siblings = industry.services.filter((entry) => entry.slug !== service.slug);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Marketing Programs", href: "/marketing-programs/" },
    { label: industry.name, href: industry.path },
    { label: service.title, href: servicePath(industry, service) },
  ];
  const [introImage, ...deliverablePhotos] = service.gallery;
  const image = service.hero.image;
  const imageStyle = image.position ? { objectPosition: image.position } : undefined;

  return (
    <main className={`${styles.page} industry-${industry.id}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(industry, service)).replace(/</g, "\\u003c") }}
      />

      {/* Hero: same copy everywhere, composed per industry */}
      <header className={`${styles.hero} ${styles[variant.hero]}`}>
        {backdrop ? (
          <div className={styles.heroBackdrop}>
            <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className={styles.cover} style={imageStyle} />
          </div>
        ) : null}
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <Breadcrumbs items={crumbs} tone={DARK_HEROES.has(variant.hero) ? "dark" : "light"} />
            <p className={styles.heroLabel}>{service.hero.label}</p>
            <PageTitle className={styles.heroTitle}>{service.hero.title}</PageTitle>
            <p className={styles.heroLead}>{service.hero.lead}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={actions.cta.href}>
                {actions.cta.label}
                <ArrowIcon />
              </Link>
              <a className={styles.secondary} href={PHONE.href}>
                Call {PHONE.label}
              </a>
            </div>
          </div>
          {backdrop ? null : (
            <div className={styles.heroFigure}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 960px) 46vw, 100vw"
                className={styles.cover}
                style={imageStyle}
              />
            </div>
          )}
          <div className={styles.heroNote}>
            <p className={styles.heroNoteTitle}>In this service</p>
            <ol>
              {service.offers.map((offer, index) => (
                <li key={offer.title}>
                  <span className={styles.heroNoteIndex}>{offerIndex(industry.id, index)}</span>
                  {offer.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </header>

      {/* Intro: what the service means for this industry, with the first supporting photograph */}
      {introImage ? (
        <IndustryIntro
          industry={industry.id}
          headingId="svc-intro"
          label={industry.name}
          title={service.intro.title}
          paragraphs={service.intro.paragraphs}
          image={introImage}
        />
      ) : null}

      {/* What we offer: the capabilities inside this service, as information cards */}
      <section className={`${styles.offers} ${styles[variant.offers]}`} aria-labelledby="svc-offers">
        <div className="container">
          <p className={styles.label}>{service.title}</p>
          <SectionTitle id="svc-offers" className={styles.title}>
            What we offer
          </SectionTitle>
          <p className={styles.lead}>
            {NUMBER_WORDS[service.offers.length] ?? service.offers.length} capabilities, planned and run together for{" "}
            {industry.noun === "medical and dental" ? "medical and dental practices" : `${industry.noun} businesses`}.
          </p>
          <ol className={styles.offerList}>
            {service.offers.map((offer, index) => (
              <Reveal key={offer.title} as="li" delay={index * 90} className={styles.offer}>
                <span className={styles.offerIndex}>{offerIndex(industry.id, index)}</span>
                <h3 className={styles.offerTitle}>{offer.title}</h3>
                <p className={styles.offerBody}>{offer.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables: the checklist beside the rest of the service's photography */}
      <section className={styles.deliverables} aria-labelledby="svc-deliverables">
        <div className={`container ${styles.deliverablesGrid}`} data-photos={deliverablePhotos.length}>
          <div className={styles.deliverablesCopy}>
            <p className={styles.label}>Capabilities &amp; deliverables</p>
            <SectionTitle id="svc-deliverables" className={styles.title}>
              What you get.
            </SectionTitle>
            <ul className={styles.checklist}>
              {service.deliverables.map((item) => (
                <li key={item}>
                  <span className={styles.check}>
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {deliverablePhotos.length > 0 ? (
            <ul className={styles.deliverablesPhotos} aria-label={`${service.title} examples`}>
              {deliverablePhotos.map((photo, index) => (
                <Reveal key={photo.src} as="li" variant="fade" delay={index * 90} className={styles.deliverablesPhoto}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 960px) 40vw, 100vw"
                    className={styles.cover}
                    style={photo.position ? { objectPosition: photo.position } : undefined}
                  />
                </Reveal>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Benefits and where the service is used */}
      <section className={styles.benefits} aria-labelledby="svc-benefits">
        <div className="container">
          <p className={styles.label}>Benefits</p>
          <SectionTitle id="svc-benefits" className={styles.title}>
            What it changes for you.
          </SectionTitle>
          <ul className={styles.benefitGrid}>
            {service.benefits.map((benefit, index) => (
              <Reveal key={benefit.title} as="li" delay={index * 90} className={styles.benefit}>
                <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </Reveal>
            ))}
          </ul>
          <div className={styles.applications}>
            <h3 className={styles.applicationsTitle}>Real-world applications</h3>
            <ul>
              {service.applications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Approach: how Kosick runs the service */}
      <section className={styles.approach} aria-labelledby="svc-approach">
        <div className="container">
          <p className={styles.label}>How Kosick approaches it</p>
          <SectionTitle id="svc-approach" className={styles.title}>
            {NUMBER_WORDS[service.approach.length] ?? service.approach.length} steps, one team.
          </SectionTitle>
          <p className={styles.lead}>Strategy, creative, media and reporting stay with the same people from start to finish.</p>
          <ProcessTrack
            className={styles.approachTrack}
            steps={service.approach.map((step, index) => ({ number: String(index + 1), title: step.title, body: step.body }))}
          />
        </div>
      </section>

      {/* Related: the other services for this industry, then Kosick's general pages */}
      <section className={styles.related} aria-labelledby="svc-related">
        <div className="container">
          <p className={styles.label}>Related services</p>
          <SectionTitle id="svc-related" className={styles.title}>
            More from {industry.name}.
          </SectionTitle>
          <ul className={styles.relatedGrid}>
            {siblings.map((sibling) => (
              <li key={sibling.slug}>
                <Link href={servicePath(industry, sibling)} className={styles.relatedCard}>
                  <span className={styles.relatedName}>{sibling.title}</span>
                  <span className={styles.relatedLine}>{sibling.summary}</span>
                  <span className={styles.relatedMore}>
                    View service
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={industry.path} className={`${styles.relatedCard} ${styles.relatedHome}`}>
                <span className={styles.relatedName}>All {industry.name} services</span>
                <span className={styles.relatedLine}>Every service for {industry.noun} clients, in one place.</span>
                <span className={styles.relatedMore}>
                  Back to {industry.name}
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          </ul>
          {service.related.length > 0 ? (
            <div className={styles.further}>
              <h3 className={styles.furtherTitle}>Also from Kosick</h3>
              <ul>
                {service.related.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.textLink}>
                      {link.label}
                      <ArrowIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <PageCta
        cta={{
          title: industry.cta.title,
          description: industry.cta.description,
          primary: { label: "Contact us", href: actions.cta.href },
          phone: PHONE,
        }}
      />
    </main>
  );
}
