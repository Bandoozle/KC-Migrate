"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { CampaignPhoto, CampaignVideo } from "@/content/espresso-dolce";
import styles from "./CampaignShowcase.module.css";

type CampaignShowcaseProps = {
  client: string;
  title: string;
  body: string;
  video: CampaignVideo | null;
  photos: CampaignPhoto[];
};

/**
 * Prefer an on-page Vimeo embed when the host is allowlisted in Vimeo privacy.
 * Otherwise open Vimeo. Do not bypass embed permissions.
 */
function canEmbedInline(hostname: string) {
  return (
    hostname === "kosick.com" ||
    hostname === "www.kosick.com" ||
    hostname === "staging.kosick.com" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".vercel.app")
  );
}

function PortraitVimeo({
  id,
  title,
  poster,
  alt,
}: {
  id: string;
  title: string;
  poster?: string;
  alt: string;
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
    <div className={styles.player}>
      {playing ? (
        <iframe
          className={styles.embed}
          src={`https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className={styles.poster} onClick={play} aria-label={`Play ${title}`}>
          {poster ? (
            // External Vimeo CDN poster — plain img avoids next/image remote config
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt={alt} className={styles.posterImage} width={640} height={1138} decoding="async" />
          ) : (
            <span className={styles.posterFallback} aria-hidden="true" />
          )}
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
              <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

function FileVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  return (
    <div className={styles.player}>
      <video
        className={styles.fileVideo}
        src={src}
        poster={poster}
        aria-label={alt}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    </div>
  );
}

/**
 * Bento portfolio card: copy left, portrait video + two stills right.
 */
export function CampaignShowcase({ client, title, body, video, photos }: CampaignShowcaseProps) {
  if (!video && photos.length === 0) return null;

  const [stillTop, stillBottom] = photos;
  const watchHref = video?.kind === "vimeo" ? `https://vimeo.com/${video.id}` : null;

  return (
    <section className={styles.section} aria-labelledby="campaign-showcase">
      <div className="container">
        <Reveal variant="fadeUp" className={styles.card}>
          <div className={styles.copy}>
            <p className={styles.client}>{client}</p>
            <h2 id="campaign-showcase" className={`section-title ${styles.title}`}>
              {title}
            </h2>
            <p className={`section-description ${styles.body}`}>{body}</p>
            {watchHref ? (
              <a className={styles.watch} href={watchHref} target="_blank" rel="noopener noreferrer">
                <span className={styles.watchIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="12" height="12" focusable="false">
                    <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
                  </svg>
                </span>
                Watch on Vimeo
              </a>
            ) : null}
          </div>

          <div className={styles.stage}>
            {video ? (
              <div className={styles.media}>
                {video.kind === "vimeo" ? (
                  <PortraitVimeo id={video.id} title={video.title} poster={video.poster} alt={video.alt} />
                ) : (
                  <FileVideo src={video.src} poster={video.poster} alt={video.alt} />
                )}
              </div>
            ) : null}

            {stillTop ? (
              <div className={styles.stillTop}>
                <Image
                  src={stillTop.src}
                  alt={stillTop.alt}
                  fill
                  sizes="(min-width: 900px) 22vw, 45vw"
                  className={styles.cover}
                />
              </div>
            ) : null}

            {stillBottom ? (
              <div className={styles.stillBottom}>
                <Image
                  src={stillBottom.src}
                  alt={stillBottom.alt}
                  fill
                  sizes="(min-width: 900px) 22vw, 45vw"
                  className={styles.cover}
                />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
