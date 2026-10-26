import Image from "next/image";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { getPartnerName } from "@/components/sections/PartnerLogoGrid";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionDescription, SectionTitle, SubsectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServiceMedia, ServicePageContent } from "@/lib/wordpress/service-page-types";
import { PartnerLandscape } from "./PartnerLandscape";
import styles from "./DigitalVideoAdvertisingPage.module.css";

type DigitalVideoAdvertisingPageProps = {
  content: ServicePageContent;
};

type Shot = { src: string; alt: string };

const MEASURES = [
  "Video completion rate",
  "Reach and frequency",
  "Brand lift",
  "Website visit attribution",
  "Cross-device conversions",
];

const PARTNER_GROUPS: Array<{ title: string; test: RegExp }> = [
  { title: "Sports", test: /sportsnet|tsn|espn|golf/i },
  { title: "Streaming", test: /crave|hulu/i },
  { title: "News", test: /cnn|cp24|global|cbc/i },
  { title: "Entertainment", test: /fox|nbc|cbs|discovery|hgtv|tlc|food|rogers|\be!/i },
  { title: "Audio", test: /spotify/i },
];

function findShot(content: ServicePageContent, pattern: RegExp, alt: string): Shot | null {
  const pool: Array<ServiceMedia | null | undefined> = [
    ...content.features.map((feature) => feature.image),
    ...(content.partnerLogos?.logos ?? []),
    ...(content.mediaCardSection?.cards.map((card) => card.image) ?? []),
  ];
  const image = pool.find((item) => item?.src && pattern.test(item.src));
  return image?.src ? { src: image.src, alt } : null;
}

export function DigitalVideoAdvertisingPage({ content }: DigitalVideoAdvertisingPageProps) {
  const mix = content.features.find((feature) => /media mix/i.test(feature.title));
  const targeting = content.features.find((feature) => /creative|audiences/i.test(feature.title));
  const streamShot = findShot(
    content,
    /streaming-ads/i,
    "Tablet playing a motorsport video, with the TSN mark in the corner",
  );
  const screenShot = findShot(
    content,
    /digital-streaming-advertising-1/i,
    "Wall-mounted television showing a Formula 1 race",
  );
  const roomShot = findShot(
    content,
    /tv-streaming-advertising/i,
    "Living-room television open to the Prime Video app",
  );

  const formats = [
    {
      key: "ctv",
      kicker: "Streaming TV",
      title: "Connected TV",
      benefit: "Big-screen reach, targeted digitally.",
      body: "Run video ads across streaming environments and connected TVs, with audience and geographic targeting built in.",
      image: roomShot,
    },
    {
      key: "preroll",
      kicker: "Online video",
      title: "Pre-roll and mid-roll",
      benefit: "Reach viewers around the content they already watch.",
      body: "Place video before or during online programming across desktop, mobile and publisher platforms.",
      image: streamShot,
    },
    {
      key: "incontent",
      kicker: "In-page video",
      title: "Outstream and vertical",
      benefit: "Video placements built beyond the player.",
      body: "Reach audiences inside articles, mobile feeds and other premium digital content without requiring a traditional video stream.",
      image: screenShot,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Audience",
      body: "Target the right viewers by geography, interests and behaviour.",
    },
    {
      number: "02",
      title: "Creative",
      body: "Match the message and format to how the audience watches.",
    },
    {
      number: "03",
      title: "Placement",
      body: "Run across Connected TV, online video and premium digital inventory.",
    },
    {
      number: "04",
      title: "Optimization",
      body: "Adjust in real time to improve reach, frequency and efficiency.",
    },
  ];

  const quadrants = [
    {
      title: "Message",
      body: "Creative is optimized for the platform and the format it runs in.",
    },
    {
      title: "Audience",
      body: "Targeting uses demographics, interests, geography, and behaviour.",
    },
    {
      title: "Placement",
      body: "Spots run on streaming apps, in-stream video, outstream, and vertical units.",
    },
    {
      title: "Timing",
      body: "The plan meets people while they are watching, then adjusts during the flight.",
    },
  ];

  const partners = (content.partnerLogos?.logos ?? []).flatMap((logo, index) => {
    const name = getPartnerName(logo, index);
    return name.startsWith("Partner ") ? [] : [{ ...logo, name }];
  }).filter((logo, index, all) => all.findIndex((item) => item.name === logo.name) === index);
  const grouped = PARTNER_GROUPS.map((group) => ({
    title: group.title,
    logos: partners.filter((logo) => group.test.test(logo.name)).map(({ src, name }) => ({ src, name })),
  })).filter((group) => group.logos.length > 0);
  const groupedNames = new Set(grouped.flatMap((group) => group.logos.map((logo) => logo.name)));
  const other = partners.filter((logo) => !groupedNames.has(logo.name)).map(({ src, name }) => ({ src, name }));
  // Anything that matches no category stays visible rather than disappearing.
  if (other.length > 0) grouped.push({ title: "More", logos: other });

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      <section className={`section ${styles.formats}`} aria-labelledby="dv-formats">
        <div className="container">
          <div className={styles.sectionHead}>
            <SectionTitle as="h2" id="dv-formats">
              Where the spot runs
            </SectionTitle>
            <SectionDescription>
              Reach the right audience across connected TV, online video and premium publisher placements.
            </SectionDescription>
          </div>
          <div className={styles.formatGrid}>
            {formats.map((format) => (
              <article key={format.key} className={styles.formatCard}>
                {format.image ? (
                  <div className={styles.formatVisual}>
                    <Image
                      src={format.image.src}
                      alt={format.image.alt}
                      fill
                      sizes="(min-width: 900px) 360px, 100vw"
                      className={styles.shot}
                    />
                  </div>
                ) : null}
                <div className={styles.formatText}>
                  <p className={styles.kicker}>{format.kicker}</p>
                  <SubsectionTitle className={styles.formatTitle}>{format.title}</SubsectionTitle>
                  <p className={styles.benefit}>{format.benefit}</p>
                  <p className={styles.body}>{format.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.steps}`} aria-labelledby="dv-steps">
        <div className="container">
          <div className={styles.sectionHead}>
            <SectionTitle as="h2" id="dv-steps" className={styles.onDark}>
              How a flight is planned
            </SectionTitle>
            {mix?.body ? <p className={styles.darkLead}>{mix.body}</p> : null}
          </div>
          <ol className={styles.stepList}>
            {steps.map((step) => (
              <li key={step.number} className={styles.step}>
                <span className={styles.stepNumber}>{step.number}</span>
                <SubsectionTitle as="h3" className={styles.stepTitle}>
                  {step.title}
                </SubsectionTitle>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {targeting ? (
        <section className={`section ${styles.brief}`} aria-labelledby="dv-brief">
          <div className={`container ${styles.briefGrid}`}>
            <div>
              <SectionTitle as="h2" id="dv-brief">
                {labelCase(targeting.title)}
              </SectionTitle>
              {targeting.body ? <SectionDescription>{targeting.body}</SectionDescription> : null}
            </div>
            <div className={styles.quadrants}>
              {quadrants.map((item) => (
                <article key={item.title} className={styles.quadrant}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`section ${styles.report}`} aria-labelledby="dv-report">
        <div className={`container ${styles.reportGrid}`}>
          <div>
            <SectionTitle as="h2" id="dv-report" className={styles.onDark}>
              Measured while the flight is live
            </SectionTitle>
            <p className={styles.darkLead}>
              Reporting covers completion, reach and frequency, brand lift, site-visit attribution, and cross-device
              conversions, with room to adjust the campaign in-flight.
            </p>
          </div>
          <div className={styles.reportFrame}>
            <p className={styles.reportLabel}>What the report tracks</p>
            <ul className={styles.measures}>
              {MEASURES.map((measure, index) => (
                <li key={measure}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {measure}
                </li>
              ))}
            </ul>
            <p className={styles.reportNote}>Labels only. Not sample results.</p>
          </div>
        </div>
      </section>

      {grouped.length > 0 ? (
        <section className={`section ${styles.partners}`} aria-labelledby="dv-partners">
          <div className="container">
            <div className={styles.sectionHead}>
              <SectionTitle as="h2" id="dv-partners">
                Where your ads can appear
              </SectionTitle>
              <SectionDescription>Premium sports, streaming, news and entertainment inventory.</SectionDescription>
            </div>
            <PartnerLandscape groups={grouped} />
          </div>
        </section>
      ) : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.relatedServices.length > 0 ? (
        <section className={`section ${styles.related}`} aria-label="Related media">
          <div className={`container ${styles.relatedGrid}`}>
            {content.relatedServices.map((service) => (
              <article key={service.title}>
                <h3>{service.title}</h3>
                <ul>
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
