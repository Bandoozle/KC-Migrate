import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { HomePageContent } from "@/lib/wordpress/home";
import { HomeHeroRotator } from "./HomeHeroRotator";
import { HomeHeroVideo } from "./HomeHeroVideo";
import styles from "./HomeHero.module.css";

type HomeHeroProps = {
  content: HomePageContent["hero"];
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className={styles.hero} aria-label="Homepage hero">
      {/* The poster is the hero's first paint: React hoists this into <head>, ahead of the video */}
      <link rel="preload" as="image" href={content.video.poster} fetchPriority="high" />
      <div className={styles.media} aria-hidden="true">
        <HomeHeroVideo className={styles.video} src={content.video.src} poster={content.video.poster} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.inner}>
        <Reveal variant="fadeUp">
          <HomeHeroRotator rotations={content.rotations} />
        </Reveal>
        <Reveal variant="fadeUp" delay={180}>
          <Link href={content.ctaHref} className={styles.cta}>
            {content.ctaLabel}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
