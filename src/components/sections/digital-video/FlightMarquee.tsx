import Image from "next/image";
import styles from "./FlightMarquee.module.css";

export type FlightStage = {
  number: string;
  name: string;
  line: string;
  meta: string;
  live?: boolean;
  image: { src: string; alt: string };
};

type FlightMarqueeProps = {
  rows: [FlightStage[], FlightStage[]];
  label: string;
};

/* Enough copies of a row's cards that one set is wider than any screen */
const REPEAT = 3;

function StageCard({ stage, hidden }: { stage: FlightStage; hidden?: boolean }) {
  return (
    <article className={styles.card} aria-hidden={hidden || undefined}>
      <div className={styles.media}>
        <Image src={stage.image.src} alt={hidden ? "" : stage.image.alt} fill sizes="240px" className={styles.cover} />
      </div>
      <div className={styles.body}>
        <span className={styles.number}>{stage.number}</span>
        <h3 className={styles.name}>{stage.name}</h3>
        <p className={styles.line}>{stage.line}</p>
        <p className={styles.meta}>
          {stage.live ? <i className={styles.liveDot} aria-hidden="true" /> : null}
          {stage.meta}
        </p>
      </div>
    </article>
  );
}

/**
 * Two rows of stage cards that drift in opposite directions, the top row to the
 * right and the bottom row to the left. Each track holds the set twice, so a
 * translate of half its width loops seamlessly. Only the first copy of each
 * card is exposed to assistive tech.
 */
export function FlightMarquee({ rows, label }: FlightMarqueeProps) {
  return (
    <div className={styles.marquee} role="group" aria-label={label}>
      {rows.map((row, rowIndex) => {
        const set = Array.from({ length: REPEAT }, () => row).flat();
        return (
          <div key={rowIndex} className={rowIndex === 0 ? `${styles.row} ${styles.rowRight}` : `${styles.row} ${styles.rowLeft}`}>
            <div className={styles.track}>
              {[...set, ...set].map((stage, index) => (
                <StageCard key={`${stage.number}-${index}`} stage={stage} hidden={index >= row.length} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
