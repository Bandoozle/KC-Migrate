import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FaqAccordion } from "@/components/sections/digital-marketing/FaqAccordion";
import { PageCta } from "@/components/sections/PageCta";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { SectionTitle } from "@/components/typography";
import { labelCase } from "@/lib/eyebrow";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";
import styles from "./SocialMediaMarketingPage.module.css";

const UPLOADS = "https://staging.kosick.com/wp-content/uploads";

const BANNER = {
  src: `${UPLOADS}/2026/02/social-media-content-creation.jpg`,
  alt: "View from the bow of a boat heading into a Cabo sunset",
};

const PLATFORMS = [
  { name: "YouTube", src: `${UPLOADS}/2025/11/youtube-marketing.jpg`, alt: "YouTube social media management" },
  { name: "Facebook & Meta", src: `${UPLOADS}/2025/11/facebook-marketing.jpg`, alt: "Facebook and Meta social media marketing" },
  { name: "Instagram", src: `${UPLOADS}/2025/11/instagram-marketing.jpg`, alt: "Instagram social media marketing" },
  { name: "TikTok", src: `${UPLOADS}/2025/11/tiktok-marketing.jpg`, alt: "TikTok advertising" },
];

/* Matched to the three WordPress features in order */
const FEATURE_IMAGES = [
  { src: `${UPLOADS}/2026/06/social-media-advertising.jpg`, alt: "The Kosick Instagram profile on a phone beside a laptop" },
  { src: `${UPLOADS}/2026/06/hvac-social-media-marketing-1.jpg`, alt: "Instagram posts for a heating and air conditioning brand" },
  { src: `${UPLOADS}/2026/06/social-media-content-marketing-1.jpg`, alt: "A social analytics dashboard on a laptop" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type SocialMediaMarketingPageProps = {
  content: ServicePageContent;
};

export function SocialMediaMarketingPage({ content }: SocialMediaMarketingPageProps) {
  const { hero, faqs, cta, gallerySection: gallery } = content;
  const pillars = content.offerGroups[0]?.cards ?? [];
  const features = content.features.slice(0, 3);

  return (
    <main className={styles.page}>
      <ServiceHero title={content.title} hero={hero} />

      {/* Banner: one wide photograph with the four pillars locked to its lower edge */}
      <section className={styles.banner} aria-labelledby="sm-pillars">
        <div className="container">
          <h2 id="sm-pillars" className={styles.visuallyHidden}>
            {labelCase(content.intro?.title || "What we offer")}
          </h2>
          <Reveal variant="fade">
            <div className={styles.bannerFrame}>
              <Image src={BANNER.src} alt={BANNER.alt} fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
            </div>
          </Reveal>
          {pillars.length > 0 ? (
            <ol className={styles.pillars}>
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.id} as="li" delay={index * 90} className={styles.pillar}>
                  <span className={styles.pillarNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  {pillar.body ? <p className={styles.pillarBody}>{pillar.body}</p> : null}
                </Reveal>
              ))}
            </ol>
          ) : null}
        </div>
      </section>

      {/* Platforms: headline beside two ruled lists, then one tile per platform */}
      {gallery ? (
        <section className={styles.platforms} aria-labelledby="sm-platforms">
          <div className="container">
            <div className={styles.platformHead}>
              <div>
                <p className={styles.label}>Every channel</p>
                <SectionTitle id="sm-platforms" className={styles.titleOnDark}>
                  {gallery.title}
                </SectionTitle>
                {gallery.body ? <p className={styles.lead}>{gallery.body}</p> : null}
              </div>
              <div className={styles.lists}>
                <div>
                  <p className={styles.listLabel}>Formats</p>
                  <ul className={styles.list}>
                    {(gallery.labels ?? []).map((label) => (
                      <li key={label}>{label}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={styles.listLabel}>Platforms</p>
                  <ul className={styles.list}>
                    {PLATFORMS.map((platform) => (
                      <li key={platform.name}>{platform.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <ul className={styles.tiles}>
              {PLATFORMS.map((platform, index) => (
                <Reveal key={platform.name} as="li" delay={index * 90} className={styles.tile}>
                  <div className={styles.tileFrame}>
                    <Image src={platform.src} alt={platform.alt} fill sizes="(min-width: 960px) 25vw, 50vw" className={styles.cover} />
                  </div>
                  <span className={styles.tileLabel}>{platform.name}</span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Features: label, title and image on the left; copy and points on the right */}
      {features.length > 0 ? (
        <section className={styles.features} aria-label="How we work">
          <div className="container">
            {features.map((feature, index) => {
              const image = FEATURE_IMAGES[index];
              const id = `sm-feature-${index}`;
              return (
                <article key={feature.title} className={styles.feature} aria-labelledby={id}>
                  <div className={styles.featureLead}>
                    {feature.eyebrow ? <p className={styles.label}>{labelCase(feature.eyebrow)}</p> : null}
                    <h2 id={id} className={styles.featureTitle}>
                      {labelCase(feature.title)}
                    </h2>
                    {image ? (
                      <Reveal variant="fade" className={styles.featureMedia}>
                        <div className={styles.featureFrame}>
                          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 960px) 35vw, 100vw" className={styles.cover} />
                        </div>
                      </Reveal>
                    ) : null}
                  </div>
                  <div className={styles.featureCopy}>
                    <p className={styles.body}>{feature.body}</p>
                    {feature.bullets && feature.bullets.length > 0 ? (
                      <ul className={styles.points}>
                        {feature.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {feature.cta ? (
                      <Link className={styles.textLink} href={feature.cta.href}>
                        {labelCase(feature.cta.label)}
                        <ArrowIcon />
                      </Link>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {faqs && faqs.items.length > 0 ? (
        <FaqAccordion eyebrow="" title={labelCase(faqs.title)} items={faqs.items} />
      ) : null}

      {cta ? <PageCta cta={cta} /> : null}
    </main>
  );
}
