import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { Eyebrow, SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import { VideoFormatShowcase, type VideoDevice, type VideoFormat } from "./VideoFormatShowcase";
import styles from "./DigitalVideoAdvertisingPage.module.css";

type DigitalVideoAdvertisingPageProps = {
  content: ServicePageContent;
};

type Shot = { src: string; alt: string; position?: string };

const FORMAT_PRESENTATION: Record<
  string,
  { meta: string; devices: VideoDevice[]; visual: VideoFormat["visual"]; shot?: "living" | "tablet"; spec?: string }
> = {
  instream: {
    meta: "Pre-roll and mid-roll",
    devices: ["laptop", "tablet", "phone"],
    visual: "photo",
    shot: "tablet",
  },
  ctv: {
    meta: "Over-the-top",
    devices: ["tv"],
    visual: "photo",
    shot: "living",
  },
  outstream: {
    meta: "Desktop and mobile",
    devices: ["laptop", "phone"],
    visual: "article",
  },
  vertical: {
    meta: "300 × 600",
    devices: ["phone"],
    visual: "phone",
    spec: "300 × 600",
  },
};

function formatKey(title: string) {
  if (/in-stream|pre-roll/i.test(title)) return "instream";
  if (/outstream/i.test(title)) return "outstream";
  if (/vertical/i.test(title)) return "vertical";
  if (/connected|\bott\b/i.test(title)) return "ctv";
  return "";
}

function shotFrom(content: ServicePageContent, pattern: RegExp, alt: string, position: string): Shot | null {
  const image = content.features.map((feature) => feature.image).find((item) => item?.src && pattern.test(item.src));
  if (!image?.src) return null;
  return { src: image.src, alt, position };
}

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

export function DigitalVideoAdvertisingPage({ content }: DigitalVideoAdvertisingPageProps) {
  const reach = content.features.find((feature) => /streaming platforms/i.test(feature.title));
  const mix = content.features.find((feature) => /media mix/i.test(feature.title));
  const targeting = content.features.find((feature) => /creative|audiences/i.test(feature.title));

  const prime = shotFrom(
    content,
    /tv-streaming-advertising/i,
    "Living-room television open to the Prime Video app",
    "50% 46%",
  );
  const living = shotFrom(
    content,
    /digital-streaming-advertising-1/i,
    "Wall-mounted television showing a Formula 1 race in a living room",
    "50% 38%",
  );
  const tablet = shotFrom(
    content,
    /streaming-ads/i,
    "Tablet playing a motorsport video, with the TSN mark in the corner",
    "36% 100%",
  );
  const shots = { living, tablet };

  const formats: VideoFormat[] = (content.mediaCardSection?.cards ?? []).flatMap((card) => {
    const key = formatKey(card.title);
    const presentation = FORMAT_PRESENTATION[key];
    if (!presentation || !card.body) return [];
    const image = presentation.shot ? shots[presentation.shot] ?? undefined : undefined;
    if (presentation.visual === "photo" && !image) return [];
    return [
      {
        id: key,
        label: card.title,
        meta: presentation.meta,
        body: card.body,
        devices: presentation.devices,
        visual: presentation.visual,
        image,
        spec: presentation.spec,
      },
    ];
  });

  const plans = [mix, targeting].filter((feature) => feature?.title);

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {reach ? (
        <section className={`section ${styles.screen}`} aria-labelledby="dv-reach">
          <div className="container">
            <div className={styles.screenHead}>
              <Eyebrow heading={reach.title}>{reach.eyebrow}</Eyebrow>
              <SectionTitle as="h2" id="dv-reach" className={styles.sectionTitle}>
                {labelCase(reach.title)}
              </SectionTitle>
            </div>
            {prime ? (
              <figure className={styles.cinema}>
                <Image
                  src={prime.src}
                  alt={prime.alt}
                  fill
                  sizes="(min-width: 900px) 1120px, 100vw"
                  className={styles.cinemaImage}
                  style={{ objectPosition: prime.position }}
                  priority
                />
              </figure>
            ) : null}
            <div className={styles.screenLower}>
              {reach.body ? <p className={styles.lead}>{reach.body}</p> : null}
              {(reach.bullets?.length ?? 0) > 0 ? (
                <ul className={styles.slate}>
                  {reach.bullets?.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            {reach.cta ? (
              <Link className={styles.solid} href={reach.cta.href}>
                {labelCase(reach.cta.label)}
                <ArrowIcon />
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      {formats.length > 0 ? (
        <section className={`section ${styles.formats}`} aria-labelledby="dv-formats">
          <div className="container">
            <SectionTitle as="h2" id="dv-formats" className={styles.sectionTitle}>
              {labelCase(content.mediaCardSection?.title || "Digital video advertising formats")}
            </SectionTitle>
            <VideoFormatShowcase formats={formats} />
          </div>
        </section>
      ) : null}

      {plans.length > 0 ? (
        <section className={`section ${styles.plan}`}>
          <div className={`container ${styles.planGrid}`}>
            {plans.map((feature) =>
              feature ? (
                <article key={feature.title} className={styles.planArticle}>
                  <Eyebrow heading={feature.title}>{feature.eyebrow}</Eyebrow>
                  <SectionTitle as="h2" className={styles.sectionTitle}>
                    {labelCase(feature.title)}
                  </SectionTitle>
                  {feature.body ? <p className={styles.body}>{feature.body}</p> : null}
                  {(feature.bullets?.length ?? 0) > 0 ? (
                    <ul className={styles.log}>
                      {feature.bullets?.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                  {feature.cta ? (
                    <Link className={styles.solid} href={feature.cta.href}>
                      {labelCase(feature.cta.label)}
                      <ArrowIcon />
                    </Link>
                  ) : null}
                </article>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {content.partnerLogos && content.partnerLogos.logos.length > 0 ? (
        <section className={`section ${styles.partners}`} aria-labelledby="dv-partners">
          <div className="container">
            <SectionTitle as="h2" id="dv-partners" className={styles.sectionTitle}>
              {content.partnerLogos.title}
            </SectionTitle>
            <ul className={styles.partnerGrid}>
              {content.partnerLogos.logos.map((logo, index) => {
                const name = getPartnerName(logo, index);
                return (
                  <li key={`${logo.src}-${index}`} className={styles.partner}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt="" className={styles.partnerLogo} />
                    <span className={styles.partnerName}>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.relatedServices.length > 0 ? (
        <section className={`section ${styles.related}`}>
          <div className={`container ${styles.relatedGrid}`}>
            {content.relatedServices.map((service) => (
              <article key={service.title} className={styles.relatedColumn}>
                <h3 className={styles.relatedTitle}>{service.title}</h3>
                <ul className={styles.relatedList}>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
