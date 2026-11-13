import Image from "next/image";
import { LocationVisual, TimingVisual } from "./OutdoorFactorVisuals";
import styles from "./OutdoorPrinciples.module.css";

const CITY = {
  src: "/wp-content/uploads/2023/06/vancouver-agency.jpg",
  alt: "Vancouver skyline and waterfront at sunset",
};

const CITY_MARKERS = [
  { label: "Commute", x: 22, y: 62 },
  { label: "Shop", x: 48, y: 48 },
  { label: "Travel", x: 76, y: 58 },
];

const THREE_THINGS = [
  { name: "Location", line: "Be where people already move." },
  { name: "Timing", line: "Build frequency when demand matters." },
  { name: "Creative", line: "Make the message readable in seconds." },
];

const CREATIVE = {
  src: "/wp-content/uploads/2023/07/hvac.jpg",
  alt: "Ayotte “Upgrade your furnace” billboard",
};

const ROUTE = {
  d: "M 0 300 H 260 V 120 H 640 V 260 H 1000",
  markers: [
    [260, 300],
    [640, 120],
  ] as const,
};

/** City presence, then the Location / Timing / Creative triptych. */
export function OutdoorPrinciples() {
  return (
    <div className={styles.root}>
      <section className={styles.city} aria-labelledby="oo-city">
        <Image src={CITY.src} alt={CITY.alt} fill sizes="100vw" className={styles.cover} />
        <div className={styles.cityShade} aria-hidden="true" />
        <ul className={styles.markers} aria-hidden="true">
          {CITY_MARKERS.map((marker) => (
            <li key={marker.label} style={{ left: `${marker.x}%`, top: `${marker.y}%` }}>
              <span className={styles.markerDot} />
              <span className={styles.markerLabel}>{marker.label}</span>
            </li>
          ))}
        </ul>
        <div className={`container ${styles.cityCopy}`}>
          <h2 id="oo-city" className={styles.titleOnDark}>
            Be seen where the city moves.
          </h2>
          <p className={styles.leadOnDark}>On the way to work, at the shops and through the terminals.</p>
        </div>
      </section>

      <section className={styles.three} aria-labelledby="oo-three">
        <svg className={styles.route} viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={ROUTE.d} />
          {ROUTE.markers.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
          ))}
        </svg>
        <div className="container">
          <h2 id="oo-three" className={styles.title}>
            Outdoor works when three things align.
          </h2>
          <ol className={styles.triptych}>
            <li className={styles.part}>
              <span className={styles.visualGrid} aria-hidden="true">
                <LocationVisual />
              </span>
              <span className={styles.partNumber}>01</span>
              <span className={styles.partName}>{THREE_THINGS[0].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[0].line}</span>
            </li>
            <li className={styles.part}>
              <span className={styles.visualTime} aria-hidden="true">
                <TimingVisual />
              </span>
              <span className={styles.partNumber}>02</span>
              <span className={styles.partName}>{THREE_THINGS[1].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[1].line}</span>
            </li>
            <li className={styles.part}>
              <span className={styles.visualCreative} aria-hidden="true">
                <Image
                  src={CREATIVE.src}
                  alt=""
                  fill
                  sizes="(min-width: 960px) 30vw, (min-width: 721px) 45vw, 84vw"
                  className={styles.cover}
                  style={{ objectPosition: "48% 30%" }}
                />
              </span>
              <span className={styles.partNumber}>03</span>
              <span className={styles.partName}>{THREE_THINGS[2].name}</span>
              <span className={styles.partLine}>{THREE_THINGS[2].line}</span>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
