import Image from "next/image";
import type { HomePageContent } from "@/lib/wordpress/home";
import styles from "./HomeQuote.module.css";

type HomeQuoteProps = {
  content: HomePageContent["quote"];
};

const BACKDROP = {
  src: "/wp-content/uploads/2023/06/vancouver-agency.jpg",
  alt: "",
};

/**
 * Editorial quote feature: atmospheric photography, asymmetric copy + portrait,
 * and restrained depth — not a flat black testimonial slab.
 */
export function HomeQuote({ content }: HomeQuoteProps) {
  return (
    <section className={styles.section} aria-label="Featured quote">
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src={BACKDROP.src}
          alt={BACKDROP.alt}
          fill
          sizes="100vw"
          className={styles.backdropImage}
          priority={false}
        />
        <div className={styles.wash} />
      </div>

      <div className={styles.rail}>
        <div className={styles.copy}>
          <p className={styles.mark} aria-hidden="true">
            “
          </p>
          <blockquote className={styles.quote}>
            <p>{content.text}</p>
          </blockquote>
          <footer className={styles.by}>
            <strong className={styles.name}>{content.name}</strong>
            <span className={styles.role}>{content.role}</span>
          </footer>
        </div>

        <figure className={styles.portrait}>
          <div className={styles.portraitFrame}>
            <Image
              src={content.photoSrc}
              alt={content.photoAlt}
              width={640}
              height={640}
              sizes="(max-width: 639px) 46vw, (max-width: 899px) 26vw, 320px"
              className={styles.portraitImage}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}
