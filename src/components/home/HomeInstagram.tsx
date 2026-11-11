import Image from "next/image";
import { SectionTitle } from "@/components/typography";
import {
  HOME_INSTAGRAM_POSTS,
  HOME_INSTAGRAM_PROFILE,
} from "@/content/home-instagram";
import shared from "./home-shared.module.css";
import styles from "./HomeInstagram.module.css";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
    </svg>
  );
}

/**
 * Refined Smash Balloon–style Instagram grid from the WordPress homepage:
 * eight local images, 4×2 on desktop, linked to their Instagram posts.
 */
export function HomeInstagram() {
  return (
    <section className={styles.section} aria-labelledby="home-instagram-title">
      <div className={`${shared.rail} ${styles.inner}`}>
        <SectionTitle id="home-instagram-title" className={styles.heading}>
          A Glimpse Into Our World
        </SectionTitle>
        <ul className={styles.grid}>
          {HOME_INSTAGRAM_POSTS.map((post) => (
            <li key={post.href} className={styles.item}>
              <a
                href={post.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  width={post.width}
                  height={post.height}
                  sizes="(max-width: 639px) 50vw, (max-width: 899px) 33vw, 25vw"
                  className={styles.image}
                />
                <span className={styles.srOnly}>View on Instagram</span>
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.follow}>
          <a
            href={HOME_INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.followLink}
          >
            <InstagramIcon />
            Follow us on Instagram
          </a>
        </p>
      </div>
    </section>
  );
}
