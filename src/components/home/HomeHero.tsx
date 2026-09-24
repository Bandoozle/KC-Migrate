import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import type { HomePageContent } from "@/lib/wordpress/home";
import styles from "./HomeHero.module.css";

type HomeHeroProps = {
  content: HomePageContent["hero"];
};

export function HomeHero({ content }: HomeHeroProps) {
  return (
    <section className={styles.hero} aria-label="Homepage hero">
      <div className={styles.media} aria-hidden="true">
        <iframe
          className={styles.video}
          src={content.vimeoSrc}
          title="Background video"
          allow="autoplay; fullscreen"
          tabIndex={-1}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.inner}>
        <Reveal variant="fadeUp">
          <h1 className={styles.title}>{content.title}</h1>
        </Reveal>
        <Reveal variant="fadeUp" delay={90}>
          <p className={styles.subtitle}>{content.subtitle}</p>
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
