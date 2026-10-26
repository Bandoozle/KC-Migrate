"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./MotionStoryboard.module.css";

export type StoryboardFrame = {
  time: number;
  poster: string;
  label: string;
};

type MotionStoryboardProps = {
  src: string;
  duration: number;
  frames: StoryboardFrame[];
  /** Heading and copy shown beside the player on wide screens. */
  intro: ReactNode;
  outro?: ReactNode;
};

function timecode(seconds: number) {
  const whole = Math.floor(seconds);
  return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(whole % 60).padStart(2, "0")}`;
}

export function MotionStoryboard({ src, duration, frames, intro, outro }: MotionStoryboardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(frames[0]?.time ?? 0);

  const playFrom = (index: number) => {
    const video = videoRef.current;
    setActive(index);
    setProgress(frames[index].time);
    if (!video) return;
    setStarted(true);
    const seekAndPlay = () => {
      video.currentTime = frames[index].time;
      video.play().catch(() => {});
    };
    if (video.readyState >= 1) seekAndPlay();
    else {
      video.addEventListener("loadedmetadata", seekAndPlay, { once: true });
      video.load();
    }
  };

  const onTime = () => {
    const video = videoRef.current;
    if (!video) return;
    setProgress(video.currentTime);
    let current = 0;
    frames.forEach((frame, index) => {
      if (video.currentTime >= frame.time - 0.25) current = index;
    });
    setActive(current);
  };

  const current = frames[active];

  return (
    <div className={styles.board}>
      <div className={styles.lead}>{intro}</div>

      <div className={styles.stage}>
        <div className={styles.screen} data-started={started || undefined}>
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            poster={current.poster}
            preload="none"
            playsInline
            controls={started}
            aria-label="Product animation"
            onTimeUpdate={onTime}
          />
          {!started ? (
            <button type="button" className={styles.play} onClick={() => playFrom(active)}>
              <span className={styles.playDisc} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
                  <path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.2-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
                </svg>
              </span>
              <span>Play from {timecode(current.time)}</span>
            </button>
          ) : null}
        </div>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railStart}>00:00</span>
          <div className={styles.track}>
            <span className={styles.fill} style={{ "--p": `${(progress / duration) * 100}%` } as CSSProperties} />
            {frames.map((frame, index) => (
              <span
                key={frame.time}
                className={styles.key}
                data-active={index === active || undefined}
                style={{ left: `${(frame.time / duration) * 100}%` }}
              />
            ))}
          </div>
          <span className={styles.railEnd}>{timecode(duration)}</span>
        </div>
      </div>

      <div className={styles.side}>
        <ol className={styles.shots} aria-label="Storyboard frames">
          {frames.map((frame, index) => (
            <li key={frame.time}>
              <button
                type="button"
                className={styles.shotButton}
                aria-pressed={index === active}
                onClick={() => playFrom(index)}
              >
                <span className={styles.thumb}>
                  <Image src={frame.poster} alt="" fill sizes="(min-width: 960px) 9rem, 25vw" className={styles.thumbImage} />
                </span>
                <span className={styles.shotText}>
                  <span className={styles.shotTime}>{timecode(frame.time)}</span>
                  <span className={styles.shotLabel}>{frame.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {outro}
      </div>
    </div>
  );
}
