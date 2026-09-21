import { SectionTitle } from "@/components/typography";
import type { ServicePartnerLogos } from "@/lib/wordpress/service-page-types";
import styles from "./PartnerLogoGrid.module.css";

type PartnerLogoGridProps = {
  section: ServicePartnerLogos;
};

/**
 * Map WP logo assets → short display names.
 * Prefer stable filename / path tokens over SEO alt sentences.
 * Order matters for Global News vs Global.
 */
const PARTNER_NAME_RULES: Array<{ match: RegExp; name: string }> = [
  { match: /golf-channel/i, name: "Golf Channel" },
  { match: /hgtv/i, name: "HGTV" },
  { match: /cbs\.webp|\/cbs\./i, name: "CBS" },
  { match: /espn/i, name: "ESPN" },
  { match: /cw\.webp/i, name: "The CW" },
  { match: /crave/i, name: "Crave" },
  { match: /global\.webp/i, name: "Global News" },
  { match: /sportsnet/i, name: "Sportsnet" },
  { match: /pattison/i, name: "Pattison" },
  { match: /8\.55\.55-AM/i, name: "CTV" },
  { match: /8\.57\.09-AM/i, name: "CBC" },
  { match: /8\.55\.14-AM/i, name: "FOX" },
  { match: /8\.58\.38-AM/i, name: "NBC" },
  { match: /9\.16\.03-AM/i, name: "Rogers" },
  { match: /8\.59\.41-AM/i, name: "CNN" },
  { match: /9\.02\.11-AM/i, name: "CP24" },
  { match: /9\.12\.56-AM/i, name: "TSN" },
  { match: /2\.02\.28-PM/i, name: "Bell" },
  { match: /8\.33\.58-AM/i, name: "Global" },
  { match: /8\.34\.53-AM/i, name: "Food Network" },
  { match: /8\.46\.22-AM/i, name: "E!" },
];

function getPartnerName(logo: { src: string; alt: string }, index: number): string {
  const src = logo.src || "";
  for (const rule of PARTNER_NAME_RULES) {
    if (rule.match.test(src)) return rule.name;
  }

  // Alt fallback — brand keywords only, never the full SEO sentence.
  const alt = logo.alt || "";
  const altFallbacks: Array<{ match: RegExp; name: string }> = [
    { match: /\bglobal news\b/i, name: "Global News" },
    { match: /\bgolf channel\b/i, name: "Golf Channel" },
    { match: /\bfood network\b/i, name: "Food Network" },
    { match: /\bsportsnet\b/i, name: "Sportsnet" },
    { match: /\bpattison\b/i, name: "Pattison" },
    { match: /\brogers\b/i, name: "Rogers" },
    { match: /\bthe cw\b|\bcw advertising\b/i, name: "The CW" },
    { match: /\bhgtv\b/i, name: "HGTV" },
    { match: /\bcrave\b/i, name: "Crave" },
    { match: /\bespn\b/i, name: "ESPN" },
    { match: /\bcbs\b/i, name: "CBS" },
    { match: /\bcp24\b/i, name: "CP24" },
    { match: /\bctv\b/i, name: "CTV" },
    { match: /\bcnn\b/i, name: "CNN" },
    { match: /\btsn\b/i, name: "TSN" },
    { match: /\bcbc\b/i, name: "CBC" },
    { match: /\bfox\b/i, name: "FOX" },
    { match: /\bnbc\b/i, name: "NBC" },
    { match: /\bbell\b/i, name: "Bell" },
    { match: /\be!\b/i, name: "E!" },
    { match: /\bglobal\b/i, name: "Global" },
  ];

  for (const rule of altFallbacks) {
    if (rule.match.test(alt)) return rule.name;
  }

  return `Partner ${index + 1}`;
}

export function PartnerLogoGrid({ section }: PartnerLogoGridProps) {
  if (section.logos.length === 0) return null;

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        {section.title ? (
          <SectionTitle as="h2" className={styles.heading}>
            {section.title}
          </SectionTitle>
        ) : null}

        <ul className={styles.grid}>
          {section.logos.map((logo, index) => {
            const name = getPartnerName(logo, index);
            return (
              <li key={`${logo.src}-${index}`} className={styles.card}>
                <div className={styles.logoWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={name}
                    className={styles.logo}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span className={styles.label}>{name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
