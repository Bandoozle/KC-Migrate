"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./HvacMarketingPage.module.css";

type VimeoFeatureProps = {
  /** Vimeo video id. */
  id: string;
  title: string;
  poster: string;
  /** False when the video's privacy settings block embedding everywhere; it then always opens on Vimeo. */
  inline?: boolean;
};

/*
 * The Vimeo video only embeds on domains listed in its privacy settings
 * (staging.kosick.com answers 200, other hosts get 403). On those domains the
 * poster swaps for the inline player; anywhere else the same video opens on
 * Vimeo instead of showing the player's privacy error.
 */
const EMBED_HOSTS = ["kosick.com", "www.kosick.com", "staging.kosick.com"];

export function VimeoFeature({ id, title, poster, inline = true }: VimeoFeatureProps) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://vimeo.com/${id}`;

  function play() {
    if (inline && EMBED_HOSTS.includes(window.location.hostname)) {
      setPlaying(true);
      return;
    }
    window.open(watchUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.videoFrame}>
      {playing ? (
        <iframe
          src={`https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className={styles.videoPoster} onClick={play} aria-label={`Play ${title}`}>
          <Image src={poster} alt="" fill sizes="(min-width: 1290px) 1290px, 100vw" className={styles.cover} />
          <span className={styles.videoShade} aria-hidden="true" />
          <span className={styles.playDisc} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
            </svg>
          </span>
          <span className={styles.playLabel}>Play {title}</span>
        </button>
      )}
    </div>
  );
}
