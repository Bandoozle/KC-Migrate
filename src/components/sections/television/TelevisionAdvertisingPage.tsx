import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { RelatedServices } from "@/components/sections/ads/RelatedServices";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import {
  TV_BENEFITS,
  TV_CAPABILITIES,
  TV_HERO,
  TV_NETWORKS,
  TV_START,
  TV_WORK,
} from "@/content/television-page";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { TelevisionJourney } from "./TelevisionJourney";
import { TelevisionModes } from "./TelevisionModes";
import { TelevisionReach } from "./TelevisionReach";
import styles from "./TelevisionAdvertisingPage.module.css";

type TelevisionAdvertisingPageProps = {
  content: ServicePageContent;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M13 6l6 6-6 6"
      />
    </svg>
  );
}

export function TelevisionAdvertisingPage({ content }: TelevisionAdvertisingPageProps) {
  const video =
    content.hero.slides.find((slide) => slide.kind === "video" && /trane-web/i.test(slide.src)) ||
    content.hero.slides.find((slide) => slide.kind === "video");

  const heroSlides =
    content.hero.slides.length > 0
      ? content.hero.slides
      : [{ src: "/images/television/service-broadcast.jpg", alt: "Television advertising" }];

  const hero = {
    ...content.hero,
    slides: heroSlides,
    eyebrow: undefined,
    displayTitle: TV_HERO.displayTitle,
    titleSecondary: TV_HERO.titleSecondary,
    subtitle: TV_HERO.subtitle,
    cta: TV_HERO.cta,
    secondaryCta: TV_HERO.secondaryCta,
  };

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} cinematic />

      <section className={styles.capabilities} aria-labelledby="tv-capabilities">
        <div className={`container ${styles.capabilitiesInner}`}>
          <header className={styles.sectionIntro}>
            <h2 id="tv-capabilities" className={styles.sectionTitle}>
              {TV_CAPABILITIES.title}
            </h2>
            <p className={styles.sectionLead}>{TV_CAPABILITIES.lead}</p>
          </header>

          <ul className={styles.capabilityList}>
            {TV_CAPABILITIES.items.map((item, index) => (
              <Reveal key={item.id} as="li" delay={index * 90} className={styles.capability}>
                <figure className={styles.capabilityMedia}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1099px) 50vw, 32vw"
                    style={{ objectFit: "cover", objectPosition: item.image.position }}
                  />
                </figure>
                <h3 className={styles.capabilityTitle}>{item.title}</h3>
                <p className={styles.capabilityBody}>{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <TelevisionModes />

      <TelevisionReach />

      <section className={styles.benefits} aria-labelledby="tv-benefits">
        <div className={`container ${styles.benefitsInner}`}>
          <h2 id="tv-benefits" className={styles.sectionTitle}>
            {TV_BENEFITS.title}
          </h2>
          <div className={styles.benefitGrid}>
            {TV_BENEFITS.items.map((item, index) => (
              <article
                key={item.id}
                className={styles.benefit}
                data-layout={index % 2 === 0 ? "image-left" : "image-right"}
              >
                <div className={styles.benefitMedia}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 899px) 100vw, 48vw"
                    className={styles.benefitImage}
                  />
                </div>
                <div className={styles.benefitCopy}>
                  <p className={styles.benefitIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className={styles.benefitTitle}>{item.title}</h3>
                  <p className={styles.benefitBody}>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TelevisionJourney />

      <section className={styles.work} aria-labelledby="tv-work">
        <div className="container">
          <header className={styles.sectionIntro}>
            <h2 id="tv-work" className={styles.workTitle}>
              {TV_WORK.title}
            </h2>
            <p className={styles.workLead}>{TV_WORK.lead}</p>
          </header>

          {video ? (
            <Reveal variant="fade">
              <figure className={styles.screen}>
                <video
                  className={styles.video}
                  controls
                  playsInline
                  preload="metadata"
                  poster={TV_WORK.featured.poster}
                  src={video.src}
                  aria-label={`${TV_WORK.featured.client} television commercial, an example of Kosick’s work`}
                />
                <figcaption className={styles.screenCaption}>
                  <span className={styles.screenClient}>
                    {TV_WORK.featured.client} · “{TV_WORK.featured.line}”
                  </span>
                  <span>{TV_WORK.featured.caption}</span>
                </figcaption>
              </figure>
            </Reveal>
          ) : null}

          <ul className={styles.frames}>
            {TV_WORK.featured.frames.map((frame) => (
              <li key={frame.src} className={styles.frame}>
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  width={640}
                  height={360}
                  sizes="(max-width: 639px) 50vw, 25vw"
                  className={styles.frameImage}
                />
                {frame.super ? <span className={styles.frameSuper}>{frame.super}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {content.partnerLogos && content.partnerLogos.logos.length > 0 ? (
        <section className={styles.networks} aria-labelledby="tv-networks">
          <div className="container">
            <header className={styles.sectionIntro}>
              <h2 id="tv-networks" className={styles.sectionTitle}>
                {content.partnerLogos.title || "Networks and platforms"}
              </h2>
              {content.partnerLogos.description ? (
                <p className={styles.sectionLead}>{content.partnerLogos.description}</p>
              ) : (
                <p className={styles.sectionLead}>
                  Direct relationships across major Canadian and U.S. networks, plus Connected TV and
                  streaming environments, planned as part of the same campaign.
                </p>
              )}
            </header>
            {/* The same logo files with their white backgrounds removed, each balanced to one visual size */}
            <ul className={styles.brandWall}>
              {TV_NETWORKS.map((logo, index) => (
                <Reveal key={logo.name} as="li" variant="fade" delay={(index % 5) * 50} className={styles.brandTile}>
                  <Image src={logo.src} alt={logo.name} width={480} height={240} sizes="(max-width: 639px) 45vw, (max-width: 1099px) 22vw, 220px" />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className={styles.start} aria-labelledby="tv-start">
        <div className={`container ${styles.startInner}`}>
          <div className={styles.startCopy}>
            <h2 id="tv-start" className={styles.sectionTitle}>
              {TV_START.title}
            </h2>
            <p className={styles.sectionLead}>{TV_START.lead}</p>
            <Link className={styles.solid} href={TV_START.cta.href}>
              {TV_START.cta.label}
              <ArrowIcon />
            </Link>
          </div>
          <ol className={styles.startSteps}>
            {TV_START.steps.map((step, index) => (
              <li key={step.title} className={styles.startStep}>
                <p className={styles.startIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className={styles.startTitle}>{step.title}</h3>
                <p className={styles.startBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      <RelatedServices
        title="Television works harder with the rest of the media mix."
        current="/services/television-advertising/"
        include={[
          "/services/digital-connected-tv/",
          "/services/radio-advertising/",
          "/services/outdoor-advertising/",
          "/services/creative/",
        ]}
      />

      {content.cta ? (
        <PageCta
          cta={{
            ...content.cta,
            primary: { label: TV_START.cta.label, href: TV_START.cta.href },
          }}
        />
      ) : null}
    </main>
  );
}
