"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CardTitle,
  SectionDescription,
  SectionTitle,
} from "@/components/typography";
import type { RelatedService } from "@/lib/wordpress/digital-marketing";
import styles from "./ServiceDirectory.module.css";

type ServiceDirectoryProps = {
  services: RelatedService[];
};

type CategoryVisual = {
  src: string;
  alt: string;
};

/** Real public routes only — never invent # / placeholder destinations. */
const CATEGORY_HREF: Record<string, string> = {
  "google ad management": "/services/digital-marketing/",
  "e-commerce marketing": "/services/website-development/",
  "social ad management": "/services/social-media-marketing/",
  "website management": "/services/website-development/",
};

const CATEGORY_VISUAL: Record<string, CategoryVisual> = {
  "google ad management": {
    src: "/wp-content/uploads/2023/06/google-ads-1-750x475.jpeg",
    alt: "Google Ads campaign reporting on a laptop",
  },
  "e-commerce marketing": {
    src: "/wp-content/uploads/2026/03/website-development-e-commerce.jpg",
    alt: "E-commerce website and product merchandising",
  },
  "social ad management": {
    src: "/wp-content/uploads/2026/06/social-media-advertising.jpg",
    alt: "Social media advertising on a phone beside a laptop",
  },
  "website management": {
    src: "/wp-content/uploads/2026/07/Honest-Cleaning-Website.jpg",
    alt: "Custom business website design on a laptop",
  },
};

const ITEM_HREF: Record<string, string> = {
  "google ads management & optimization": "/services/digital-marketing/#dm-channels",
  "ppc keyword research & bid management": "/services/search-engine-optimization/",
  "display advertising": "/services/digital-marketing/#dm-channels",
  "remarketing campaigns": "/services/digital-marketing/#dm-channels",
  "e-commerce web development": "/services/website-development/",
  "e-commerce seo page optimization": "/services/search-engine-optimization/",
  "shopping cart abandonment campaigns": "/services/email-marketing/",
  "e-commerce ppc & google ads": "/services/digital-marketing/#dm-channels",
  "facebook & instagram advertising": "/services/social-media-marketing/",
  "linkedin advertising": "/services/social-media-marketing/",
  "youtube advertising & video marketing": "/services/digital-connected-tv/",
  "social media seo & content optimization": "/services/social-media-marketing/",
  "custom web development": "/services/website-development/",
  "seo-optimized website development": "/services/website-development/",
  "landing page development": "/services/website-development/",
  "e-commerce platform development": "/services/website-development/",
};

function keyOf(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveCategoryHref(service: RelatedService): string | null {
  if (service.href && service.href !== "#") return service.href;
  return CATEGORY_HREF[keyOf(service.title)] ?? null;
}

function resolveItemHref(label: string, categoryHref: string | null): string | null {
  return ITEM_HREF[keyOf(label)] ?? categoryHref;
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

/**
 * Digital Marketing service directory as a four-card navigation grid.
 */
export function ServiceDirectory({ services }: ServiceDirectoryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  if (services.length === 0) return null;

  const enriched = services.map((service) => {
    const href = resolveCategoryHref(service);
    const visual = CATEGORY_VISUAL[keyOf(service.title)] ?? null;
    const items = service.items.map((label) => ({
      label,
      href: resolveItemHref(label, href),
    }));
    return { ...service, href, visual, items };
  });

  const activeVisual = enriched[activeImage]?.visual ?? enriched[0]?.visual;

  return (
    <section
      className={styles.section}
      aria-labelledby="dm-service-directory"
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.masthead}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Service directory</p>
            <SectionTitle id="dm-service-directory">
              Explore our digital marketing services
            </SectionTitle>
            <SectionDescription className={styles.lead}>
              From paid search and social to commerce and websites, browse the
              channels we run and jump into the service that fits your next
              campaign.
            </SectionDescription>
          </div>

          {activeVisual ? (
            <div className={styles.media} aria-hidden="true">
              {enriched.map((service, index) =>
                service.visual ? (
                  <Image
                    key={service.visual.src}
                    src={service.visual.src}
                    alt=""
                    fill
                    sizes="(max-width: 899px) 100vw, 42vw"
                    className={`${styles.mediaImage} ${
                      index === activeImage ? styles.mediaImageActive : ""
                    }`}
                  />
                ) : null,
              )}
              <div className={styles.mediaWash} />
            </div>
          ) : null}
        </div>

        <div className={styles.grid}>
          {enriched.map((service, index) => (
            <article
              key={service.title}
              className={`${styles.card} ${
                hoveredCard === index ? styles.cardActive : ""
              }`}
              onMouseEnter={() => {
                setActiveImage(index);
                setHoveredCard(index);
              }}
              onFocusCapture={() => {
                setActiveImage(index);
                setHoveredCard(index);
              }}
            >
              <header className={styles.cardHead}>
                {service.href ? (
                  <Link href={service.href} className={styles.categoryLink}>
                    <CardTitle as="h3" className={styles.categoryTitle}>
                      {service.title}
                    </CardTitle>
                    <span className={styles.categoryArrow} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </Link>
                ) : (
                  <CardTitle as="h3" className={styles.categoryTitle}>
                    {service.title}
                  </CardTitle>
                )}
              </header>

              <ul className={styles.list}>
                {service.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <Link href={item.href} className={styles.serviceLink}>
                        <span>{item.label}</span>
                        <span className={styles.serviceArrow} aria-hidden="true">
                          <ArrowIcon />
                        </span>
                      </Link>
                    ) : (
                      <span className={styles.serviceStatic}>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
