import type { ReactNode } from "react";
import type { TelevisionStill } from "./TelevisionLineup";
import styles from "./TelevisionVisual.module.css";

export type TelevisionVisualKind = "broadcast" | "streaming" | "plan" | "report";

type TelevisionVisualProps = {
  kind: TelevisionVisualKind;
  label: string;
  still?: TelevisionStill | null;
};

const WEEKS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
const DEVICES = ["Smart TV", "Roku", "Apple TV"];
const DAYPARTS = ["Morning", "Daytime", "Prime time", "Late night"];
const PLAN_ROWS = [
  { channel: "Linear TV", start: 1, end: 5, tone: "strong" },
  { channel: "Connected TV", start: 1, end: 5, tone: "accent" },
  { channel: "OTT streaming", start: 2, end: 5, tone: "soft" },
  { channel: "Digital", start: 1, end: 4, tone: "soft" },
] as const;

function Illustrative({ children = "Illustrative" }: { children?: string }) {
  return <span className={styles.badge}>{children}</span>;
}

function Broadcast({ label, still }: { label: string; still?: TelevisionStill | null }) {
  return (
    <figure className={styles.frame}>
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.photo} src={still.src} alt={still.alt} />
      ) : null}
      <div className={styles.topRow} aria-hidden="true">
        <span className={styles.chip}>
          <span className={styles.liveDot} />
          Broadcast
        </span>
        <span className={styles.chip}>:15 spot</span>
      </div>
      <figcaption className={styles.lowerThird}>
        <span>{label}</span>
        <span>Television commercial</span>
      </figcaption>
    </figure>
  );
}

function Streaming({ label, still }: { label: string; still?: TelevisionStill | null }) {
  return (
    <figure className={styles.frame}>
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.photo} src={still.src} alt={still.alt} />
      ) : null}
      <div className={styles.topRow} aria-hidden="true">
        <span className={styles.chip}>Ad · 0:15</span>
        <Illustrative>Illustrative interface</Illustrative>
      </div>
      <div className={styles.player} aria-hidden="true">
        <div className={styles.devices}>
          {DEVICES.map((device) => (
            <span key={device} className={styles.device}>
              {device}
            </span>
          ))}
        </div>
        <div className={styles.controls}>
          <svg viewBox="0 0 24 24" width="18" height="18" focusable="false">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
          <span className={styles.track}>
            <span className={styles.trackFill} />
          </span>
          <span className={styles.time}>0:06 / 0:15</span>
        </div>
      </div>
      <figcaption className={styles.srOnly}>
        {label}: Television commercial shown inside an illustrative streaming ad break on Smart TV, Roku, and Apple TV.
      </figcaption>
    </figure>
  );
}

function Plan({ label }: { label: string }) {
  return (
    <div
      className={`${styles.frame} ${styles.screen}`}
      role="img"
      aria-label={`${label}: illustrative 4-week media plan across linear TV, connected TV, OTT streaming, and digital, with daypart targeting. Not client data.`}
    >
      <div className={styles.screenHead} aria-hidden="true">
        <div>
          <p className={styles.screenTitle}>Media plan</p>
          <p className={styles.screenMeta}>4-week flight</p>
        </div>
        <Illustrative />
      </div>
      <div className={styles.plan} aria-hidden="true">
        <span />
        {WEEKS.map((week) => (
          <span key={week} className={styles.axis}>
            {week}
          </span>
        ))}
        {PLAN_ROWS.map((row) => (
          <div key={row.channel} className={styles.planRow}>
            <span className={styles.channel}>{row.channel}</span>
            <span
              className={`${styles.flight} ${styles[row.tone]}`}
              style={{ gridColumn: `${row.start + 1} / ${row.end + 1}` }}
            />
          </div>
        ))}
      </div>
      <div className={styles.dayparts} aria-hidden="true">
        <span className={styles.screenMeta}>Dayparts</span>
        {DAYPARTS.map((part) => (
          <span key={part} className={styles.device}>
            {part}
          </span>
        ))}
      </div>
    </div>
  );
}

function Panel({ title, wide, children }: { title: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={`${styles.panel} ${wide ? styles.panelWide : ""}`}>
      <p className={styles.panelTitle}>{title}</p>
      <svg className={styles.chart} viewBox="0 0 200 80" preserveAspectRatio="none" focusable="false">
        {children}
      </svg>
    </div>
  );
}

function Report({ label }: { label: string }) {
  return (
    <div
      className={`${styles.frame} ${styles.screen}`}
      role="img"
      aria-label={`${label}: illustrative campaign report with reach and frequency, GRPs by week, website lift, search volume correlation, and CTV conversion tracking. Not client data.`}
    >
      <div className={styles.screenHead} aria-hidden="true">
        <div>
          <p className={styles.screenTitle}>Campaign report</p>
          <p className={styles.screenMeta}>Weeks 1–4</p>
        </div>
        <Illustrative>Illustrative · not client data</Illustrative>
      </div>
      <div className={styles.panels} aria-hidden="true">
        <Panel title="Reach & frequency" wide>
          <path className={styles.area} d="M0 80 C 30 40, 70 18, 120 12 S 190 8, 200 8 L 200 80 Z" />
          <path className={styles.line} d="M0 80 C 30 40, 70 18, 120 12 S 190 8, 200 8" />
          <path className={styles.dashed} d="M0 72 L 50 62 L 100 50 L 150 40 L 200 32" />
        </Panel>
        <Panel title="GRPs by week">
          {[0, 1, 2, 3].map((index) => {
            const height = [46, 62, 58, 70][index];
            return <rect key={index} className={styles.bar} x={14 + index * 48} y={80 - height} width="30" height={height} />;
          })}
        </Panel>
        <Panel title="Website lift">
          <path className={styles.baseline} d="M0 56 L 200 54" />
          <path className={styles.line} d="M0 56 L 40 54 L 70 34 L 110 28 L 150 30 L 200 26" />
        </Panel>
        <Panel title="Search volume correlation">
          {[0, 1, 2, 3, 4, 5, 6].map((index) => (
            <rect key={index} className={styles.barSoft} x={8 + index * 28} y={50} width="14" height="30" />
          ))}
          <path className={styles.line} d="M0 66 L 30 52 L 58 60 L 86 40 L 114 48 L 142 30 L 170 38 L 200 24" />
        </Panel>
        <Panel title="CTV conversions">
          <rect className={styles.bar} x="0" y="6" width="200" height="18" />
          <rect className={styles.barMid} x="0" y="31" width="132" height="18" />
          <rect className={styles.barSoft} x="0" y="56" width="70" height="18" />
        </Panel>
      </div>
    </div>
  );
}

export function TelevisionVisual({ kind, label, still }: TelevisionVisualProps) {
  if (kind === "streaming") return <Streaming label={label} still={still} />;
  if (kind === "plan") return <Plan label={label} />;
  if (kind === "report") return <Report label={label} />;
  return <Broadcast label={label} still={still} />;
}
