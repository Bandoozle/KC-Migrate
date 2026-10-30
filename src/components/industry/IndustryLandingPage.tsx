import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import type { Industry, IndustryLanding } from "@/lib/industries";
import { IndustryOffers } from "./IndustryOffers";
import "@/styles/industry-themes.css";
import styles from "./IndustryLandingPage.module.css";

const PHONE = { label: "604.925.5800", href: "tel:+16049255800" };

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type IndustryLandingPageProps = {
  industry: Industry & { landing: IndustryLanding };
};

/** Main page for an industry that has no WordPress page: the shared service hero, then the industry's own sections. */
export function IndustryLandingPage({ industry }: IndustryLandingPageProps) {
  const { landing } = industry;

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

      {/* Intro: why the industry needs its own approach */}
      <section className={styles.intro} aria-labelledby="ind-intro">
        <div className="container">
          <p className={styles.label}>{landing.hero.label}</p>
          <SectionTitle id="ind-intro" className={styles.title}>
            {landing.intro.title}
          </SectionTitle>
          <div className={styles.introBody}>
            {landing.intro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <IndustryOffers industry={industry} headingId="ind-offers" />

      {/* How the industry differs, beside the photography that shows it */}
      <section className={styles.reasons} aria-labelledby="ind-reasons">
        <div className="container">
          <p className={styles.label}>How we plan {industry.noun} marketing</p>
          <SectionTitle id="ind-reasons" className={styles.title}>
            Built around how your customers decide.
          </SectionTitle>
          <ol className={styles.reasonGrid}>
            {landing.reasons.map((reason, index) => (
              <Reveal key={reason.title} as="li" delay={index * 80} className={styles.reason}>
                <span className={styles.reasonIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p>{reason.body}</p>
              </Reveal>
            ))}
          </ol>
          <ul className={styles.gallery} data-count={landing.gallery.length}>
            {landing.gallery.map((photo, index) => (
              <Reveal key={photo.src} as="li" variant="fade" delay={index * 90} className={styles.galleryItem}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 960px) 33vw, 100vw"
                  className={styles.cover}
                  style={photo.position ? { objectPosition: photo.position } : undefined}
                />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {landing.reading.length > 0 ? (
        <section className={styles.reading} aria-labelledby="ind-reading">
          <div className="container">
            <SectionTitle as="h2" id="ind-reading" className={styles.readingTitle}>
              Further reading
            </SectionTitle>
            <ul>
              {landing.reading.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.textLink}>
                    {link.label}
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

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
