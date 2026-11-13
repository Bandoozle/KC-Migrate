"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./CorporateEventsPage.module.css";

const EMBED_HOSTS = new Set([
  "kosick.com",
  "www.kosick.com",
  "staging.kosick.com",
  "localhost",
  "127.0.0.1",
]);

const VIDEOS = [
  {
    id: "1190301042",
    title: "Corporate incentive travel highlight",
    poster: {
      src: "/wp-content/uploads/2022/01/international-brands.webp",
      alt: "Waves breaking against granite cliffs on a Cabo beach",
    },
  },
  {
    id: "1053936580",
    title: "Incentive travel destination program",
    poster: {
      src: "/wp-content/uploads/2026/04/hotel-riu-vallarta-1.jpg",
      alt: "Resort pool and towers in Puerto Vallarta",
    },
  },
] as const;

function canEmbedInline(hostname: string) {
  return EMBED_HOSTS.has(hostname) || hostname.endsWith(".vercel.app");
}

function TravelVimeo({
  id,
  title,
  poster,
}: {
  id: string;
  title: string;
  poster: { src: string; alt: string };
}) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://vimeo.com/${id}`;

  function play() {
    if (canEmbedInline(window.location.hostname)) {
      setPlaying(true);
      return;
    }
    window.open(watchUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={styles.travelPlayer}>
      {playing ? (
        <iframe
          className={styles.travelEmbed}
          src={`https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className={styles.travelPoster} onClick={play} aria-label={`Play ${title}`}>
          <Image src={poster.src} alt={poster.alt} fill sizes="(min-width: 960px) 48vw, 100vw" className={styles.cover} />
          <span className={styles.travelShade} aria-hidden="true" />
          <span className={styles.travelPlay} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/** Two incentive-travel Vimeo highlights in place of the static destination collage. */
export function IncentiveTravelVideos() {
  return (
    <div className={styles.travelVideos}>
      {VIDEOS.map((video, index) => (
        <Reveal key={video.id} variant="fade" delay={index * 100} className={styles.travelVideo}>
          <TravelVimeo id={video.id} title={video.title} poster={video.poster} />
        </Reveal>
      ))}
    </div>
  );
}
