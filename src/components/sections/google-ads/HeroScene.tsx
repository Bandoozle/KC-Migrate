import Image from "next/image";
import { HERO_PHOTO, SAMPLE_AD } from "@/content/google-ads-page";
import styles from "./HeroScene.module.css";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The hero's advertising scene: a real photograph of a search on a phone, with the
 * sponsored result, the business's page and the inquiry it produced layered over it.
 * The pieces settle in once, in order; reduced motion shows them in place.
 */
export function HeroScene() {
  return (
    <figure className={styles.scene}>
      <div className={styles.photo}>
        <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fill priority sizes="(min-width: 1000px) 34vw, 80vw" className={styles.cover} />
      </div>

      {/* 1. The sponsored result */}
      <div className={styles.ad} aria-hidden="true">
        <div className={styles.query}>
          <SearchIcon />
          <span>{SAMPLE_AD.query}</span>
        </div>
        <div className={styles.adBody}>
          <span className={styles.sponsored}>Sponsored</span>
          <span className={styles.site}>
            <span className={styles.favicon}>N</span>
            <span>
              <b>{SAMPLE_AD.business}</b>
              <small>{SAMPLE_AD.domain}</small>
            </span>
          </span>
          <span className={styles.headline}>{SAMPLE_AD.headline}</span>
          <span className={styles.description}>{SAMPLE_AD.description}</span>
          <span className={styles.sitelinks}>
            {SAMPLE_AD.sitelinks.slice(0, 3).map((link) => (
              <span key={link}>{link}</span>
            ))}
          </span>
        </div>
      </div>

      {/* 2. The page the ad leads to */}
      <div className={styles.page} aria-hidden="true">
        <div className={styles.pageBar}>
          <i />
          <i />
          <i />
          <span>{SAMPLE_AD.domain}</span>
        </div>
        <div className={styles.pageHero}>
          <Image src={SAMPLE_AD.pageImage.src} alt="" fill sizes="(min-width: 1000px) 24vw, 60vw" className={styles.cover} />
          <span className={styles.pageTitle}>{SAMPLE_AD.pageTitle}</span>
        </div>
        <span className={styles.pageButton}>Book a free estimate</span>
      </div>

      {/* 3. The inquiry */}
      <div className={styles.inquiry} aria-hidden="true">
        <span className={styles.check}>
          <svg viewBox="0 0 24 24" width="16" height="16" focusable="false">
            <path d="M5 12.5 10 17l9-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <b>Inquiry received</b>
          <small>{SAMPLE_AD.inquiry}</small>
        </span>
      </div>

      <figcaption className={styles.caption}>
        Illustration: a search for “{SAMPLE_AD.query}” leads to a sponsored result, the business’s page and an estimate
        request. The business is fictional.
      </figcaption>
    </figure>
  );
}
