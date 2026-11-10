import type { CSSProperties } from "react";
import styles from "./TelevisionExplorer.module.css";

export type TelevisionVisualKind = "broadcast" | "streaming" | "plan" | "report";

type TelevisionVisualProps = {
  kind: TelevisionVisualKind;
  label: string;
};

/**
 * Networks are the ones named in the page's own "Which networks and platforms"
 * answer. Markets, dayparts and audiences are typical examples, not a client buy.
 */
const BUY_ROWS = [
  { network: "CTV", market: "Local", daypart: "Morning news", audience: "Adults 35–64" },
  { network: "TSN", market: "National", daypart: "Live sports", audience: "Sports fans" },
  { network: "Global", market: "Regional", daypart: "Prime time", audience: "Homeowners" },
  { network: "NBC", market: "U.S. markets", daypart: "Late night", audience: "Adults 25–54" },
  { network: "Streaming apps", market: "National", daypart: "On demand", audience: "Cord-cutters" },
];

/** The measures named in the page's "How do you measure TV campaign success?" answer. */
const REPORT_ROWS = [
  { metric: "GRPs", answers: "How much weight the schedule delivered against your audience", source: "Broadcast" },
  { metric: "Reach & frequency", answers: "How many people saw the spot, and how often", source: "TV + streaming" },
  { metric: "Website lift", answers: "Visits during and after airtime, against your usual baseline", source: "Analytics" },
  { metric: "Search volume correlation", answers: "Whether branded searches rise with the schedule", source: "Search" },
  { metric: "CTV conversions", answers: "Actions traced back to streaming exposure", source: "Streaming" },
];

const order = (index: number) => ({ "--i": index }) as CSSProperties;

function Broadcast({ label }: { label: string }) {
  return (
    <figure className={styles.visual}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.photo}
        src="/images/television/service-broadcast.jpg"
        alt="Hosts on the set of CTV’s Your Morning Vancouver, a live local broadcast"
        decoding="async"
      />
      <div className={styles.topRow} aria-hidden="true">
        <span className={styles.chip}>
          <span className={styles.liveDot} />
          On air
        </span>
      </div>
      <figcaption className={styles.lowerThird}>
        <span className={styles.lowerTitle}>{label}</span>
        <span className={styles.lowerMeta}>Local and national broadcast</span>
      </figcaption>
    </figure>
  );
}

function Streaming({ label }: { label: string }) {
  return (
    <figure className={styles.visual}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`${styles.photo} ${styles.streamPhoto}`}
        src="/images/television/service-streaming.jpg"
        alt="A smart TV showing a streaming app’s home screen"
        decoding="async"
      />
      <div className={styles.topRow} aria-hidden="true">
        <span className={styles.badge}>Illustrative ad break</span>
      </div>
      <div className={styles.adCard} aria-hidden="true">
        <div className={styles.adHead}>
          <span className={styles.adTag}>Ad</span>
          <span className={styles.adTitle}>Your :15 spot</span>
          <span className={styles.adTime}>1 of 2</span>
        </div>
        <span className={styles.adTrack}>
          <span className={styles.adFill} />
        </span>
        <div className={styles.adDevices}>
          <span>Smart TV</span>
          <span>Streaming apps</span>
          <span>OTT</span>
        </div>
      </div>
      <figcaption className={styles.srOnly}>
        {label}: a commercial running in a streaming ad break on a smart TV.
      </figcaption>
    </figure>
  );
}

function Plan({ label }: { label: string }) {
  return (
    <figure className={`${styles.visual} ${styles.sheet}`}>
      <div className={styles.sheetHead} aria-hidden="true">
        <div>
          <p className={styles.sheetTitle}>Media buy</p>
          <p className={styles.sheetMeta}>One schedule · 4-week flight</p>
        </div>
        <span className={styles.badge}>Illustrative</span>
      </div>
      <table className={styles.buy}>
        <caption className={styles.srOnly}>
          {label}: an illustrative buy sheet placing one campaign across networks, markets, dayparts and
          audiences. Not a client plan.
        </caption>
        <thead>
          <tr>
            <th scope="col">Network</th>
            <th scope="col">Market</th>
            <th scope="col" className={styles.daypart}>
              Daypart
            </th>
            <th scope="col">Audience</th>
          </tr>
        </thead>
        <tbody>
          {BUY_ROWS.map((row, index) => (
            <tr key={row.network} style={order(index)}>
              <th scope="row">{row.network}</th>
              <td>
                <span className={styles.market}>{row.market}</span>
              </td>
              <td className={styles.daypart}>{row.daypart}</td>
              <td>{row.audience}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Report({ label }: { label: string }) {
  return (
    <figure className={`${styles.visual} ${styles.sheet}`}>
      <div className={styles.sheetHead} aria-hidden="true">
        <div>
          <p className={styles.sheetTitle}>Campaign report</p>
          <p className={styles.sheetMeta}>Tied to your business objectives</p>
        </div>
        <span className={styles.badge}>What we measure</span>
      </div>
      <ul className={styles.report} aria-label={`${label}: what every campaign report covers`}>
        {REPORT_ROWS.map((row, index) => (
          <li key={row.metric} className={styles.reportRow} style={order(index)}>
            <span className={styles.metric}>{row.metric}</span>
            <span className={styles.answers}>{row.answers}</span>
            <span className={styles.source}>{row.source}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function TelevisionVisual({ kind, label }: TelevisionVisualProps) {
  if (kind === "streaming") return <Streaming label={label} />;
  if (kind === "plan") return <Plan label={label} />;
  if (kind === "report") return <Report label={label} />;
  return <Broadcast label={label} />;
}
