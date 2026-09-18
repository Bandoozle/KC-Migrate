import type { MicrositeRelatedTile } from "@/lib/wordpress/microsites";
import styles from "./MicrositeRelatedBand.module.css";

type MicrositeRelatedBandProps = {
  tiles: MicrositeRelatedTile[];
};

export function MicrositeRelatedBand({ tiles }: MicrositeRelatedBandProps) {
  if (tiles.length === 0) return null;

  return (
    <section className={styles.band} aria-label="Related services">
      {tiles.map((tile) => {
        const inner = (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tile.image.src} alt={tile.image.alt || tile.title} />
            <span
              className={styles.overlay}
              style={{ backgroundColor: `rgba(45, 55, 72, ${tile.overlayOpacity})` }}
              aria-hidden
            />
            <span className={styles.label}>{tile.title}</span>
          </>
        );

        return tile.href ? (
          <a key={tile.title} href={tile.href} className={styles.tile}>
            {inner}
          </a>
        ) : (
          <div key={tile.title} className={styles.tile}>
            {inner}
          </div>
        );
      })}
    </section>
  );
}
