"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./ServicesOverview.module.css";

export type MediaService = {
  name: string;
  line: string;
  href: string;
  image: { src: string; alt: string };
};

/** Service rows beside one large image; hovering or focusing a row brings its image forward. */
export function MediaPreview({ services }: { services: MediaService[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.media}>
      <div className={styles.mediaStage}>
        {services.map((service, index) => (
          <Image
            key={service.href + service.name}
            src={service.image.src}
            alt={index === active ? service.image.alt : ""}
            aria-hidden={index === active ? undefined : true}
            fill
            sizes="(min-width: 960px) 58vw, 100vw"
            className={index === active ? `${styles.mediaImage} ${styles.mediaImageActive}` : styles.mediaImage}
          />
        ))}
      </div>
      <ul className={styles.mediaRows}>
        {services.map((service, index) => (
          <li key={service.name}>
            <Link
              href={service.href}
              className={styles.mediaRow}
              data-active={index === active || undefined}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              {/* Phones have no hover preview, so each row carries its own image */}
              <span className={styles.mediaThumb} aria-hidden="true">
                <Image src={service.image.src} alt="" fill sizes="72px" className={styles.cover} />
              </span>
              <span className={styles.mediaName}>{service.name}</span>
              <span className={styles.mediaLine}>{service.line}</span>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
