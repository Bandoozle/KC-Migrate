"use client";

import { useRef, useState } from "react";
import styles from "./ReelPlayer.module.css";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
    </svg>
  );
}

type ReelPlayerProps = {
  src: string;
  poster: string;
  /** Names the film for the play button, e.g. "product spot". */
  title: string;
  className?: string;
};

/** Poster first; the film only loads once someone asks to watch it. */
export function ReelPlayer({ src, poster, title, className }: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className={[styles.frame, className].filter(Boolean).join(" ")} data-started={started || undefined}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={started}
        aria-label={title}
      />
      {!started ? (
        <button type="button" className={styles.play} onClick={start}>
          <span className={styles.playDisc}>
            <PlayIcon />
          </span>
          <span className={styles.playLabel}>Play {title}</span>
        </button>
      ) : null}
    </div>
  );
}
