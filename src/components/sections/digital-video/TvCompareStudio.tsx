import Image from "next/image";
import styles from "./DigitalVideoAdvertisingPage.module.css";

const ROWS = [
  {
    aspect: "Reach",
    linear: "Broad audiences through broadcast and cable networks",
    ctv: "Selected audiences through streaming platforms",
  },
  {
    aspect: "Targeting",
    linear: "Primarily geography, programming, and demographics",
    ctv: "More granular audience, location, and interest targeting",
  },
  {
    aspect: "Buying",
    linear: "Scheduled placements and negotiated media buys",
    ctv: "Flexible, often programmatic advertising",
  },
  {
    aspect: "Measurement",
    linear: "Ratings, estimated reach, and frequency",
    ctv: "Impressions, completion rates, reach, and other platform-specific metrics",
  },
  {
    aspect: "Best for",
    linear: "Broad brand awareness and mass-market exposure",
    ctv: "Focused campaigns and reaching specific audiences",
  },
] as const;

/** Traditional TV vs Connected TV: compact photos, then a readable comparison table. */
export function TvCompareStudio() {
  return (
    <div className={styles.compareStudio}>
      <div className={styles.compareCards}>
        <figure className={styles.compareCard}>
          <div className={styles.compareMedia}>
            <Image
              src="/wp-content/uploads/2026/09/Television-Advertising.jpg"
              alt="A family watching hockey on a large living-room TV"
              fill
              sizes="(min-width: 960px) 40vw, 50vw"
              className={styles.cover}
            />
            <span className={styles.compareBadge}>Live TV</span>
          </div>
          <figcaption className={styles.compareCopy}>
            <span className={styles.compareName}>Traditional TV</span>
            <span className={styles.compareLine}>Broad reach and the credibility of live television.</span>
          </figcaption>
        </figure>

        <figure className={styles.compareCard} data-accent="true">
          <div className={styles.compareMedia}>
            <Image
              src="/images/television/connected-tv.jpg"
              alt="Viewers watching a Connected TV spot in a living room"
              fill
              sizes="(min-width: 960px) 40vw, 50vw"
              className={styles.cover}
            />
            <span className={styles.compareChrome} aria-hidden="true">
              <span className={styles.compareAd}>Ad</span>
              <span className={styles.compareScrub}>
                <i />
              </span>
              <span className={styles.compareTime}>0:15 / 0:30</span>
            </span>
          </div>
          <figcaption className={styles.compareCopy}>
            <span className={styles.compareNameAccent}>Connected TV</span>
            <span className={styles.compareLine}>Television impact focused on the markets and audiences you choose.</span>
          </figcaption>
        </figure>
      </div>

      <div className={styles.compareTableWrap}>
        <table className={styles.compareTable}>
          <caption className={styles.visuallyHidden}>Traditional TV compared with Connected TV</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.compareAspectHead}>
                <span className={styles.visuallyHidden}>Category</span>
              </th>
              <th scope="col">Traditional TV</th>
              <th scope="col" className={styles.compareCtvHead}>
                Connected TV
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.aspect}>
                <th scope="row">{row.aspect}</th>
                <td data-label="Traditional TV">{row.linear}</td>
                <td data-label="Connected TV" className={styles.compareCtvCell}>
                  {row.ctv}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
