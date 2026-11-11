"use client";

import { useEffect, useRef } from "react";
import { usePageLoaded } from "@/components/media/use-page-loaded";

type HomeHeroVideoProps = {
  src: string;
  poster: string;
  className?: string;
};

/**
 * Muted background loop for the homepage hero. The poster is the video's first
 * frame, preloaded by HomeHero so it is the hero's first (and largest) paint; the
 * 22 MB video downloads only after the page has loaded, then takes over
 * seamlessly. React does not always write `muted` into server HTML, and iOS
 * only autoplays muted video, so it is set before play(). The loop pauses while
 * the hero is scrolled out of view.
 */
export function HomeHeroVideo({ src, poster, className }: HomeHeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const pageLoaded = usePageLoaded();

  useEffect(() => {
    const video = ref.current;
    if (!video || !pageLoaded) return;
    video.muted = true;
    video.defaultMuted = true;
    video.preload = "auto";

    const play = () => {
      video.play().catch(() => {
        /* Autoplay refused (e.g. low-power mode): the poster stays in place */
      });
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [pageLoaded]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      tabIndex={-1}
    />
  );
}
