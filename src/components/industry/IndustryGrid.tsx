import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES } from "@/lib/industries";
import styles from "./IndustryGrid.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

type IndustryGridProps = {
  /** Link text on each industry card, e.g. "Explore program". */
  linkLabel: string;
  /** The eighth tile, which completes the grid with a next step rather than another industry. */
  closing: { title: string; line: string; label: string; href: string };
  className?: string;
};

/** Every industry at the same size and weight, in navigation order. */
export function IndustryGrid({ linkLabel, closing, className }: IndustryGridProps) {
  return (
    <ul className={[styles.grid, className].filter(Boolean).join(" ")}>
      {INDUSTRIES.map((industry, index) => (
        <Reveal key={industry.id} as="li" delay={(index % 4) * 70} className={styles.item}>
          <Link href={industry.path} className={styles.card}>
            <Image
              src={industry.directory.image.src}
              alt={industry.directory.image.alt}
              fill
              sizes="(min-width: 1080px) 25vw, (min-width: 560px) 50vw, 100vw"
              className={styles.cover}
              style={industry.directory.image.position ? { objectPosition: industry.directory.image.position } : undefined}
            />
            <span className={styles.shade} aria-hidden="true" />
            <span className={styles.copy}>
              <span className={styles.name}>{industry.name}</span>
              <span className={styles.line}>{industry.directory.line}</span>
              <span className={styles.more}>
                {linkLabel}
                <ArrowIcon />
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
      <Reveal as="li" delay={210} className={styles.item}>
        <Link href={closing.href} className={`${styles.card} ${styles.closing}`}>
          <span className={styles.copy}>
            <span className={styles.name}>{closing.title}</span>
            <span className={styles.line}>{closing.line}</span>
            <span className={styles.more}>
              {closing.label}
              <ArrowIcon />
            </span>
          </span>
        </Link>
      </Reveal>
    </ul>
  );
}
