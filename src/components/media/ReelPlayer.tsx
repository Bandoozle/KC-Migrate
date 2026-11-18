"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { vimeoWatchUrl } from "@/lib/vimeo";
import styles from "./ReelPlayer.module.css";

export type Reel = {
  /** Vimeo video id */
  id: string;
  /** Accessible name for the player, e.g. "Espresso Dolce reel 1" */
  title: string;
  /** The video's own first frame, a local 9:16 image */
  poster: string;
  alt: string;
};

type Embed = "unknown" | "ok" | "blocked";

/** One answer per video for the life of the page: whether Vimeo lets this site embed it. */
const embedCache = new Map<string, Embed>();

/**
 * Asks Vimeo whether this page's domain may embed the video, before any player loads.
 *
 * Vimeo's public oEmbed endpoint answers per referrer: it reports `domain_status_code` 200 where the
 * video's privacy settings allow the domain and 403 where they do not. It allows cross-origin reads, and
 * the browser supplies the page's own origin as the referrer. This asks; it never works around a refusal.
 * If the question cannot be answered (offline, rate-limited, anything unexpected), the player loads
 * anyway: the visitor sees Vimeo's own message at worst, and nothing is hidden on a guess.
 */
async function checkEmbed(id: string): Promise<Embed> {
  const cached = embedCache.get(id);
  if (cached && cached !== "unknown") return cached;

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 6000);
  let result: Embed = "ok";
  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeoWatchUrl(id))}`,
      { signal: controller.signal, referrerPolicy: "strict-origin-when-cross-origin" },
    );
    if (response.ok) {
      const data = (await response.json()) as { domain_status_code?: number };
      if (typeof data.domain_status_code === "number" && data.domain_status_code >= 400) result = "blocked";
    }
  } catch {
    result = "ok";
  } finally {
    window.clearTimeout(timer);
  }
  embedCache.set(id, result);
  return result;
}

type ReelPlayerProps = {
  reel: Reel;
  /** next/image `sizes` for the poster */
  sizes: string;
  /** Controlled mode (a rail that plays one reel at a time). Omit to let the player manage itself. */
  playing?: boolean;
  onPlay?: (id: string) => void;
  /** `feature` is the large single-reel presentation; `rail` is the compact strip. */
  variant?: "rail" | "feature";
};

/**
 * A vertical (9:16) Vimeo reel. The frame reserves its 9:16 box before anything loads, shows a poster, and
 * mounts Vimeo's own player in the same frame only when pressed: pause, replay and fullscreen are Vimeo's
 * controls. If Vimeo does not allow this domain to embed the video, the frame says so instead of showing a
 * broken player.
 */
export function ReelPlayer({ reel, sizes, playing, onPlay, variant = "rail" }: ReelPlayerProps) {
  const [ownPlaying, setOwnPlaying] = useState(false);
  const [embed, setEmbed] = useState<Embed>(() => embedCache.get(reel.id) ?? "unknown");
  const active = playing ?? ownPlaying;

  // The first press asks Vimeo whether embedding is allowed; later presses reuse the answer.
  useEffect(() => {
    if (!active || embed !== "unknown") return;
    let cancelled = false;
    void checkEmbed(reel.id).then((answer) => {
      if (!cancelled) setEmbed(answer);
    });
    return () => {
      cancelled = true;
    };
  }, [active, embed, reel.id]);

  function play() {
    if (onPlay) onPlay(reel.id);
    else setOwnPlaying(true);
  }

  const className = [styles.frame, variant === "feature" ? styles.feature : ""].filter(Boolean).join(" ");
  const poster = (
    <Image src={reel.poster} alt={reel.alt} fill sizes={sizes} className={styles.posterImage} />
  );

  if (active && embed === "ok") {
    return (
      <div className={className}>
        <iframe
          className={styles.embed}
          src={`https://player.vimeo.com/video/${reel.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&playsinline=1`}
          title={reel.title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  if (active && embed === "blocked") {
    return (
      <div className={className}>
        <div className={`${styles.poster} ${styles.posterDim}`}>{poster}</div>
        <div className={styles.blocked} role="status">
          <p className={styles.blockedTitle}>This reel can&rsquo;t play here.</p>
          <p className={styles.blockedBody}>Vimeo only allows it on kosick.com.</p>
          <a className={styles.blockedLink} href={vimeoWatchUrl(reel.id)} target="_blank" rel="noopener noreferrer">
            Watch on Vimeo
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    );
  }

  if (active) {
    // Waiting on Vimeo's answer: the poster stays, with a quiet spinner
    return (
      <div className={className} aria-busy="true">
        <div className={styles.poster}>
          {poster}
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.srOnly} role="status">
            Loading {reel.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <button type="button" className={styles.poster} onClick={play} aria-label={`Play ${reel.title}`}>
        {poster}
        <span className={styles.play} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
            <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
          </svg>
        </span>
        {variant === "feature" ? (
          <span className={styles.playLabel} aria-hidden="true">
            Play reel
          </span>
        ) : null}
      </button>
    </div>
  );
}
