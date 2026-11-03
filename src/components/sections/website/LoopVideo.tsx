"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { RECORDINGS, recordingCropClass, type RecordingKey } from "./Browser";
import styles from "./LoopVideo.module.css";

type LoopVideoProps = {
  recording: RecordingKey;
  /** Show the pause / play control (any looping video over 5 seconds needs one). */
  control?: boolean;
  tone?: "light" | "dark";
};

/**
 * A muted, looping screen recording that only plays while on screen. Reduced
 * motion shows the first frame until the visitor presses play.
 */
export function LoopVideo({ recording, control = true, tone = "dark" }: LoopVideoProps) {
  const { src, label } = RECORDINGS[recording];
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Paused by the visitor wins; otherwise autoplay unless they prefer reduced motion
  const shouldPlay = visible && (userPaused === null ? !reduced : !userPaused);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (shouldPlay) {
      node.play().catch(() => setPlaying(false));
    } else {
      node.pause();
    }
  }, [shouldPlay]);

  return (
    <>
      <video
        ref={ref}
        className={recordingCropClass}
        src={`${src}#t=0.1`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {control ? (
        <button
          type="button"
          className={styles.control}
          data-tone={tone}
          onClick={() => setUserPaused(playing)}
          aria-label={playing ? "Pause recording" : "Play recording"}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M4 3h3v10H4zM9 3h3v10H9z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M4 2.5v11l9-5.5z" />
            </svg>
          )}
          <span className={styles.live} data-on={playing} aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
