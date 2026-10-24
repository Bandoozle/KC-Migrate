import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { labelCase } from "@/lib/eyebrow";
import type { ResourceGuideContent } from "@/lib/wordpress/resource-guide-types";
import type { ServiceMedia, ServicePageContent } from "@/lib/wordpress/service-page-types";
import { OutdoorFormatShowcase, type OutdoorFormat } from "./OutdoorFormatShowcase";
import styles from "./OutdoorAdvertisingPage.module.css";

type OutdoorAdvertisingPageProps = {
  content: ServicePageContent;
  /** Billboard Dimensions guide, the published source for format sizes. */
  dimensions?: ResourceGuideContent | null;
  /** Media-owner logo from the Kosick partner wall. */
  mediaOwner?: ServiceMedia | null;
};

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

/** Kosick client creative from the media library, captioned only by what each image shows. */
const STREET_WORK = [
  {
    src: `${UPLOADS}/2026/06/hvac-billboard-advertising.jpg`,
    alt: "Belyea Bros. high-efficiency heat pump billboard above a city street",
    brand: "Belyea Bros.",
    format: "Billboard",
    position: "50% 35%",
  },
  {
    src: `${UPLOADS}/2023/07/outdoor-advertising-1-scaled.jpg`,
    alt: "Trane “We run together” vertical poster among downtown towers",
    brand: "Trane",
    format: "Vertical poster",
    position: "52% 40%",
  },
  {
    src: `${UPLOADS}/2026/01/outdoor-advertising.jpg`,
    alt: "Trane high-efficiency heat pump billboard on a rooftop structure",
    brand: "Trane",
    format: "Rooftop billboard",
    position: "50% 30%",
  },
  {
    src: `${UPLOADS}/2024/03/transit-shelter-ads.webp`,
    alt: "Trane “We run together” poster in a transit shelter",
    brand: "Trane",
    format: "Transit shelter",
    position: "30% 50%",
  },
];

const FORMAT_IMAGES: Record<string, { match: RegExp; alt: string; position?: string }> = {
  billboard: {
    match: /home-services-billboards/i,
    alt: "Home Services billboard for GE residential HVAC against a blue sky",
    position: "55% 45%",
  },
  transit: {
    match: /transit-out-of-home/i,
    alt: "Elevated SkyTrain line crossing a downtown Vancouver street",
    position: "50% 45%",
  },
  street: {
    match: /\/2026\/06\/outdoor-advertising\.jpg/i,
    alt: "Illuminated poster in a transit shelter on a tree-lined sidewalk",
    position: "60% 50%",
  },
  digital: {
    match: /digital-superboard/i,
    alt: "Pattison digital superboard beside a multi-lane highway",
    position: "55% 50%",
  },
};

type Size = { label: string; width: number; height: number; display: string };

function sentences(value: string): string[] {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function specOf(dimensions: ResourceGuideContent | null | undefined, pattern: RegExp) {
  const section = dimensions?.sections.find((item) => pattern.test(item.title));
  return section?.spec?.replace(/^typical size:\s*/i, "").trim() || undefined;
}

/** Converts published sizes (feet ′ or inches ″) into width × height in feet. */
function sizesFrom(spec: string | undefined, label: string, portrait: boolean): Size[] {
  if (!spec) return [];
  return [...spec.replace(/\([^)]*\)/g, "").matchAll(/(\d+(?:\.\d+)?)\s*([′'″"])\s*[×x]\s*(\d+(?:\.\d+)?)\s*([′'″"])/g)].map((match) => {
    const toFeet = (value: string, unit: string) => (/[″"]/.test(unit) ? Number(value) / 12 : Number(value));
    const a = toFeet(match[1], match[2]);
    const b = toFeet(match[3], match[4]);
    return {
      label,
      width: portrait ? Math.min(a, b) : Math.max(a, b),
      height: portrait ? Math.max(a, b) : Math.min(a, b),
      display: `${match[1]}${match[2]} × ${match[3]}${match[4]}`,
    };
  });
}

function listFrom(sentence: string | undefined, pattern: RegExp) {
  const list = sentence?.match(pattern)?.[1];
  return list
    ? list
        .split(/,\s*(?:and\s+)?|\s+and\s+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
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

export function OutdoorAdvertisingPage({ content, dimensions, mediaOwner }: OutdoorAdvertisingPageProps) {
  const essay = content.leadSections.flatMap((section) => section.paragraphs).filter(Boolean);
  const lines = essay.flatMap(sentences);
  const lead = lines[0] || "";
  const comma = lead.indexOf(", Kosick");
  const headline = comma > 40 ? `${lead.slice(0, comma)}.` : lead;
  const rest = [comma > 40 ? lead.slice(comma + 2) : "", ...lines.slice(1)].filter(Boolean);
  const planningTitle = rest.find((line) => /forgettable placement/i.test(line));
  const planningLead = rest.find((line) => /study traffic patterns/i.test(line));
  const support = rest.filter((line) => line !== planningTitle && line !== planningLead);
  const marketsLine = rest.find((line) => /Vancouver/.test(line));

  const media = [
    ...content.features.map((feature) => feature.image),
    ...content.overlayCards.map((card) => card.image),
    ...content.hero.slides.filter((slide) => slide.kind === "image"),
  ].filter((image): image is { src: string; alt: string } => Boolean(image?.src));
  const imageFor = (key: keyof typeof FORMAT_IMAGES) => {
    const config = FORMAT_IMAGES[key];
    const found = media.find((image) => config.match.test(image.src));
    return found ? { src: found.src, alt: config.alt, position: config.position } : null;
  };

  const cards = content.offerGroups.flatMap((group) => group.cards).filter((card) => card.title);
  const card = (pattern: RegExp) => cards.find((item) => pattern.test(item.title));
  const feature = (pattern: RegExp) => content.features.find((item) => pattern.test(item.title));
  const faq = (pattern: RegExp) => content.faqs?.items.find((item) => pattern.test(item.question));
  const price = (value?: string) => (value && /\$\d/.test(value) ? labelCase(value) : undefined);
  const cta = (value?: { label: string; href: string } | null) =>
    value ? { ...value, label: labelCase(value.label) } : null;

  const billboardFeature = feature(/billboard poster/i);
  const transitFeature = feature(/transit/i);
  const streetFeature = feature(/street/i);
  const superboard = feature(/superboard/i);
  const durationFaq = faq(/minimum campaign duration/i);
  const digitalNote = durationFaq?.answer
    .match(/[^.]*digital out-of-home[^.]*\./i)?.[0]
    ?.trim()
    .replace(/^however,\s*(\w)/i, (_, first: string) => first.toUpperCase());
  const digitalGuide = dimensions?.sections.find((item) => /digital/i.test(item.title));

  const candidates: (OutdoorFormat | null)[] = [
    (() => {
      const summary = card(/billboard/i);
      const image = imageFor("billboard");
      if (!summary || !image) return null;
      return {
        id: "billboards",
        label: labelCase(summary.title.replace(/\s+advertising$/i, "s")),
        summary: summary.body,
        title: billboardFeature?.title,
        price: price(billboardFeature?.eyebrow),
        body: billboardFeature?.body,
        tags: billboardFeature?.bullets ?? [],
        spec: specOf(dimensions, /^horizontal poster/i),
        cta: cta(billboardFeature?.cta),
        image,
      };
    })(),
    (() => {
      const summary = card(/transit/i);
      const image = imageFor("transit");
      if (!summary || !image) return null;
      return {
        id: "transit",
        label: labelCase(summary.title.replace(/\s+advertising$/i, "")),
        summary: summary.body,
        title: transitFeature?.title,
        price: price(transitFeature?.eyebrow),
        body: transitFeature?.body,
        tags: transitFeature?.bullets ?? [],
        cta: cta(transitFeature?.cta),
        image,
      };
    })(),
    (() => {
      const summary = card(/street/i);
      const image = imageFor("street");
      if (!summary || !image) return null;
      return {
        id: "street-level",
        label: labelCase(summary.title.replace(/\s+displays?$/i, "")),
        summary: summary.body,
        title: streetFeature?.title,
        price: price(streetFeature?.eyebrow),
        body: streetFeature?.body,
        tags: streetFeature?.bullets ?? [],
        spec: specOf(dimensions, /transit shelter/i),
        cta: cta(streetFeature?.cta),
        image,
      };
    })(),
    (() => {
      const summary = card(/digital/i);
      const image = imageFor("digital");
      if (!summary || !image) return null;
      return {
        id: "digital",
        label: "Digital",
        summary: summary.body,
        title: summary.title,
        body: [digitalGuide?.body, digitalNote].filter(Boolean).join(" ") || undefined,
        tags: [],
        spec: specOf(dimensions, /digital/i),
        cta: content.cta?.primary ?? null,
        image,
      };
    })(),
  ];
  const formats = candidates.filter((format): format is OutdoorFormat => Boolean(format));

  const superSizes = sizesFrom(specOf(dimensions, /^superboard/i), "Superboard", false);
  const scale: Size[] = [
    ...sizesFrom(specOf(dimensions, /transit shelter/i), "Transit shelter", true),
    ...sizesFrom(specOf(dimensions, /^horizontal poster/i), "Horizontal poster", false),
    ...superSizes,
  ];
  const scaleHeight = Math.max(...scale.map((size) => size.height), 1);
  const superImage = superboard?.image;

  const locationFaq = faq(/choose billboard locations/i);
  const trackingFaq = faq(/track the performance/i);
  const criteria = listFrom(locationFaq?.answer, /We analyze (.+?)\./i);
  const locationDetail = locationFaq?.answer.match(/\.\s+(Our team[^.]+\.)/i)?.[1];
  const measures = listFrom(trackingFaq?.answer, /We measure (.+?)\./i);
  const reportDetail = trackingFaq?.answer.match(/(Post-campaign[^.]+\.)/i)?.[1];
  const markets = listFrom(marketsLine, /placements in (.+?) nationwide/i).map((market) =>
    market.replace(/^high-traffic markets$/i, "High-traffic markets nationwide"),
  );
  const intro = content.intro?.title.replace(/Billlboard/g, "Billboard");

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={content.hero} />

      {headline ? (
        <section className={`section ${styles.street}`} aria-labelledby="outdoor-intro">
          <div className={`container ${styles.streetGrid}`}>
            <div className={styles.streetCopy}>
              <h2 id="outdoor-intro" className={styles.sectionTitle}>
                {headline}
              </h2>
              {support[0] ? <p className={styles.lead}>{support[0]}</p> : null}
              {support.slice(1).map((line) => (
                <p key={line.slice(0, 48)} className={styles.body}>
                  {line}
                </p>
              ))}
              {content.cta?.primary ? (
                <Link className={styles.solid} href={content.cta.primary.href}>
                  {content.cta.primary.label}
                  <ArrowIcon />
                </Link>
              ) : null}
            </div>
            <ul className={styles.streetWall}>
              {STREET_WORK.map((work) => (
                <li key={work.src} className={styles.streetTile}>
                  <Image
                    src={work.src}
                    alt={work.alt}
                    fill
                    sizes="(max-width: 899px) 50vw, 30vw"
                    style={{ objectPosition: work.position }}
                  />
                  <p className={styles.tileCaption}>
                    <strong>{work.brand}</strong>
                    <span>{work.format}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {intro && formats.length > 1 ? (
        <section className={`section ${styles.formats}`} aria-labelledby="outdoor-formats">
          <div className="container">
            <h2 id="outdoor-formats" className={styles.sectionTitle}>
              {intro}
            </h2>
            <OutdoorFormatShowcase formats={formats} />
          </div>
        </section>
      ) : null}

      {superboard ? (
        <section className={`section ${styles.superboard}`} aria-labelledby="outdoor-superboards">
          <div className="container">
            {superImage?.src ? (
              <figure className={styles.superPhoto}>
                <Image
                  src={superImage.src}
                  alt="Trane “Heat Cool Clean” superboard against a blue sky"
                  fill
                  sizes="(max-width: 1440px) 100vw, 1440px"
                />
                <figcaption className={styles.superChip}>
                  <span>Superboard</span>
                </figcaption>
              </figure>
            ) : null}
            <div className={styles.superGrid}>
              <div className={styles.superCopy}>
                <div className={styles.superHead}>
                  <h2 id="outdoor-superboards" className={styles.sectionTitle}>
                    {superboard.title}
                  </h2>
                  {price(superboard.eyebrow) ? <p className={styles.priceDark}>{price(superboard.eyebrow)}</p> : null}
                </div>
                {superboard.body ? <p className={styles.bodyDark}>{superboard.body}</p> : null}
                {(superboard.bullets?.length ?? 0) > 0 ? (
                  <ul className={styles.superTags}>
                    {superboard.bullets?.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {superboard.cta ? (
                  <Link className={styles.ghost} href={superboard.cta.href}>
                    {labelCase(superboard.cta.label)}
                    <ArrowIcon />
                  </Link>
                ) : null}
              </div>

              {scale.length > 1 ? (
                <figure className={styles.scale}>
                  <figcaption className={styles.scaleTitle}>Typical sizes, drawn to scale</figcaption>
                  <div className={styles.scaleRow} aria-hidden="true">
                    {scale.map((size, index) => (
                      <div
                        key={`${size.display}-${index}`}
                        className={styles.scaleItem}
                        style={{ flexGrow: size.width, flexBasis: 0 }}
                      >
                        <span className={styles.scaleIndex}>{index + 1}</span>
                        <span
                          className={styles.scaleBoard}
                          data-super={/superboard/i.test(size.label) ? "true" : "false"}
                          style={{ height: `${(size.height / scaleHeight) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <ol className={styles.scaleLegend}>
                    {scale.map((size, index) => (
                      <li key={`${size.display}-${index}`}>
                        <span className={styles.scaleIndex}>{index + 1}</span>
                        <span>
                          <strong>{size.display}</strong>
                          {size.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className={styles.scaleNote}>
                    Sizes from our{" "}
                    <Link href="/services/outdoor-advertising/billboard-dimensions/">billboard dimensions guide</Link>.
                  </p>
                </figure>
              ) : null}
            </div>

            {content.linkBanner ? (
              <div className={styles.sizes}>
                <h2 className={styles.sizesTitle}>{content.linkBanner.title}</h2>
                <Link className={styles.light} href={content.linkBanner.cta.href}>
                  {content.linkBanner.cta.label}
                  <ArrowIcon />
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {planningTitle ? (
        <section className={`section ${styles.planning}`} aria-labelledby="outdoor-planning">
          <div className="container">
            <h2 id="outdoor-planning" className={styles.planningTitle}>
              {planningTitle}
            </h2>
            {planningLead ? <p className={styles.lead}>{planningLead}</p> : null}
            <div className={styles.planningGrid}>
              {locationFaq ? (
                <article className={styles.planningColumn}>
                  <span className={styles.planningIndex}>01</span>
                  <h3 className={styles.planningHeading}>{locationFaq.question}</h3>
                  {criteria.length > 0 ? (
                    <ul className={styles.checklist}>
                      {criteria.map((item) => (
                        <li key={item}>{labelCase(item)}</li>
                      ))}
                    </ul>
                  ) : null}
                  {locationDetail ? <p className={styles.columnText}>{locationDetail}</p> : null}
                </article>
              ) : null}

              {markets.length > 0 || mediaOwner ? (
                <article className={styles.planningColumn}>
                  <span className={styles.planningIndex}>02</span>
                  <h3 className={styles.planningHeading}>Markets and media owners</h3>
                  {markets.length > 0 ? (
                    <ul className={styles.markets}>
                      {markets.map((market) => (
                        <li key={market}>{market}</li>
                      ))}
                    </ul>
                  ) : null}
                  {mediaOwner ? (
                    <div className={styles.owner}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaOwner.src} alt="Pattison Outdoor Advertising" />
                      <p>Pattison Outdoor Advertising is one of our media partners.</p>
                    </div>
                  ) : null}
                </article>
              ) : null}

              {trackingFaq ? (
                <article className={styles.planningColumn}>
                  <span className={styles.planningIndex}>03</span>
                  <h3 className={styles.planningHeading}>{trackingFaq.question}</h3>
                  {measures.length > 0 ? (
                    <ul className={styles.checklist}>
                      {measures.map((item) => (
                        <li key={item}>{labelCase(item)}</li>
                      ))}
                    </ul>
                  ) : null}
                  {reportDetail ? <p className={styles.columnText}>{reportDetail}</p> : null}
                </article>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {content.faqs && content.faqs.items.length > 0 ? (
        <FaqAccordion eyebrow={content.faqs.eyebrow} title={content.faqs.title} items={content.faqs.items} />
      ) : null}

      {content.cta ? <PageCta cta={content.cta} /> : null}
    </main>
  );
}
