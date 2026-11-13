"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionTitle } from "@/components/typography";
import styles from "./MaviShowcase.module.css";

const VIMEO_ID = "1245220443";

const EMBED_HOSTS = new Set([
  "kosick.com",
  "www.kosick.com",
  "staging.kosick.com",
  "localhost",
  "127.0.0.1",
]);

const ASSETS = {
  maviPoster: {
    src: "/images/connected-tv/mavi-living-room-day.jpg",
    alt: "Mavi campaign playing on a living-room television",
  },
  maviDay: {
    src: "/images/connected-tv/mavi-living-room-day.jpg",
    alt: "Mavi denim campaign on a wall-mounted television in a modern living room",
  },
  hvac: {
    src: "/wp-content/uploads/2026/07/Media-Buying.jpg",
    alt: "A family watching a Home Comfort heating and cooling spot on a living-room TV",
  },
  sofa: {
    src: "/images/television/sofa-tv.jpg",
    alt: "A couple watching television from a living-room sofa at dusk",
  },
  outdoor: {
    src: "/images/connected-tv/mavi-canada-place.jpg",
    alt: "Mavi outdoor advertising at Canada Place in Vancouver",
  },
};

function canEmbedInline(hostname: string) {
  return EMBED_HOSTS.has(hostname) || hostname.endsWith(".vercel.app");
}

function LazyVimeo() {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://vimeo.com/${VIMEO_ID}`;

  function play() {
    if (canEmbedInline(window.location.hostname)) {
      setPlaying(true);
      return;
    }
    window.open(watchUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.player}>
      {playing ? (
        <iframe
          className={styles.embed}
          src={`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
          title="Mavi Connected TV spot"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className={styles.poster} onClick={play} aria-label="Play Mavi Connected TV spot">
          <Image
            src={ASSETS.maviPoster.src}
            alt={ASSETS.maviPoster.alt}
            fill
            sizes="(min-width: 960px) 48vw, 100vw"
            className={styles.posterImage}
            priority={false}
          />
          <span className={styles.shade} aria-hidden="true" />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className={styles.playMeta}>
            <strong>Play the spot</strong>
            <small>Mavi · Fashion</small>
          </span>
        </button>
      )}
    </div>
  );
}

/** Selected Connected TV work across categories — fashion and home services as proof, not a niche. */
export function MaviShowcase() {
  return (
    <section className={styles.section} aria-labelledby="dv-work">
      <div className="container">
        <div className={styles.intro}>
          <p className={styles.label}>Selected work</p>
          <SectionTitle as="h2" id="dv-work" className={styles.title}>
            Built for every kind of brand.
          </SectionTitle>
          <p className={styles.lead}>
            Connected TV works the same way for fashion, home services and everything in between — full-screen creative,
            living-room attention, and the targeting to put it in front of the right households.
          </p>
        </div>

        <div className={styles.campaigns}>
          <Reveal variant="fade" className={styles.campaign}>
            <LazyVimeo />
            <div className={styles.campaignCopy}>
              <p className={styles.campaignBrand}>Mavi</p>
              <p className={styles.campaignLine}>Fashion on the living-room screen, matched to outdoor and digital.</p>
            </div>
          </Reveal>

          <Reveal delay={100} variant="fade" className={styles.campaign}>
            <div className={styles.still}>
              <Image
                src={ASSETS.hvac.src}
                alt={ASSETS.hvac.alt}
                fill
                sizes="(min-width: 960px) 48vw, 100vw"
                className={styles.cover}
              />
              <span className={styles.caption}>Home Comfort · HVAC</span>
            </div>
            <div className={styles.campaignCopy}>
              <p className={styles.campaignBrand}>Home services</p>
              <p className={styles.campaignLine}>Heating and cooling spots that reach homeowners in the markets you serve.</p>
            </div>
          </Reveal>
        </div>

        <div className={styles.gallery}>
          <Reveal variant="fade" className={styles.feature}>
            <Image
              src={ASSETS.maviDay.src}
              alt={ASSETS.maviDay.alt}
              fill
              sizes="(min-width: 960px) 62vw, 100vw"
              className={styles.cover}
            />
            <span className={styles.caption}>Mavi · Living room</span>
          </Reveal>
          <div className={styles.side}>
            <Reveal delay={80} className={styles.tile}>
              <Image
                src={ASSETS.sofa.src}
                alt={ASSETS.sofa.alt}
                fill
                sizes="(min-width: 960px) 34vw, 100vw"
                className={styles.cover}
              />
              <span className={styles.caption}>Evening viewing</span>
            </Reveal>
            <Reveal delay={140} className={styles.tileWide}>
              <Image
                src={ASSETS.outdoor.src}
                alt={ASSETS.outdoor.alt}
                fill
                sizes="(min-width: 960px) 34vw, 100vw"
                className={styles.cover}
              />
              <span className={styles.caption}>Canada Place · Outdoor</span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
