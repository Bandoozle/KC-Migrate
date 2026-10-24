"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { TelevisionFrame } from "./TelevisionStoryboard";
import styles from "./TelevisionVisual.module.css";

export type TelevisionProductionVisualKind = "storyboard" | "script" | "footage" | "edit" | "networks";

export type TelevisionNetworkGroup = { label: string; names: string[] };

type TelevisionProductionVisualProps = {
  kind: TelevisionProductionVisualKind;
  /** Frames of the finished spot, in running order. */
  frames: TelevisionFrame[];
  footage: TelevisionFrame[];
  networks: TelevisionNetworkGroup[];
};

const frameLabel = (index: number) => `Frame ${String(index + 1).padStart(2, "0")}`;

function Storyboard({ frames }: { frames: TelevisionFrame[] }) {
  return (
    <div className={`${styles.frame} ${styles.screen}`}>
      <div className={styles.screenHead}>
        <p className={styles.screenTitle}>Storyboard</p>
        <p className={styles.screenMeta}>Key frames · :15 spot</p>
      </div>
      <ol className={styles.board}>
        {frames.map((frame, index) => (
          <li key={frame.src} className={styles.boardPanel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.src} alt="" />
            <span>{frameLabel(index)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Script({ frames }: { frames: TelevisionFrame[] }) {
  return (
    <div className={`${styles.frame} ${styles.screen}`}>
      <div className={styles.screenHead}>
        <p className={styles.screenTitle}>Script</p>
        <p className={styles.screenMeta}>:15 television spot</p>
      </div>
      <table className={styles.script}>
        <thead>
          <tr>
            <th scope="col">Frame</th>
            <th scope="col">Picture</th>
            <th scope="col">On-screen super</th>
          </tr>
        </thead>
        <tbody>
          {frames.map((frame, index) => (
            <tr key={frame.src}>
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.src} alt={frame.alt} />
              </td>
              <td>{frame.super ? `“${frame.super}”` : <span aria-label="No super">—</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footage({ footage }: { footage: TelevisionFrame[] }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const current = footage[active] ?? footage[0];
  if (!current) return null;

  function move(next: number) {
    const index = (next + footage.length) % footage.length;
    setActive(index);
    document.getElementById(`${baseId}-shot-${index}`)?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: footage.length - 1,
    };
    if (event.key in keys) {
      event.preventDefault();
      move(keys[event.key]);
    }
  }

  return (
    <div className={styles.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.photo} src={current.src} alt={current.alt} />
      <div className={styles.topRow}>
        <span className={styles.chip}>Live action</span>
        <span className={styles.chip}>
          {active + 1} / {footage.length}
        </span>
      </div>
      <div className={styles.footageThumbs} role="group" aria-label="Footage frames" onKeyDown={onKeyDown}>
        {footage.map((frame, index) => (
          <button
            key={frame.src}
            id={`${baseId}-shot-${index}`}
            type="button"
            className={styles.footageThumb}
            aria-pressed={index === active}
            aria-label={`Show frame ${index + 1} of ${footage.length}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

const WAVE = [6, 10, 7, 14, 9, 18, 12, 22, 15, 11, 19, 26, 17, 13, 21, 28, 24, 16, 20, 12, 25, 30, 22, 18, 14, 26, 20, 11, 9, 6];

function Edit({ frames }: { frames: TelevisionFrame[] }) {
  const weights = [3, 4, 4, 4];
  const end = frames[frames.length - 1];
  return (
    <div
      className={`${styles.frame} ${styles.screen} ${styles.edit}`}
      role="img"
      aria-label="Illustrative edit timeline with picture, super and audio tracks for the :15 Trane spot."
    >
      <div className={styles.screenHead}>
        <p className={styles.screenTitle}>Edit · color · sound</p>
        <span className={styles.badge}>Illustrative</span>
      </div>
      <div className={styles.editBody}>
        {end ? (
          <div className={styles.preview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={end.src} alt="" />
            <span className={styles.timecode}>0:15</span>
          </div>
        ) : null}
        <div className={styles.tracks}>
          <span className={styles.trackLabel}>V1</span>
          <div className={styles.lane}>
            {frames.map((frame, index) => (
              <span
                key={frame.src}
                className={styles.clip}
                style={{ flexGrow: weights[index] ?? 3, backgroundImage: `url(${frame.src})` }}
              />
            ))}
          </div>
          <span className={styles.trackLabel}>T1</span>
          <div className={styles.lane}>
            {frames.map((frame, index) => (
              <span
                key={frame.src}
                className={frame.super ? styles.superClip : styles.gap}
                style={{ flexGrow: weights[index] ?? 3 }}
              >
                {frame.super ?? ""}
              </span>
            ))}
          </div>
          <span className={styles.trackLabel}>A1</span>
          <div className={styles.lane}>
            <svg className={styles.wave} viewBox={`0 0 ${WAVE.length * 4} 32`} preserveAspectRatio="none" aria-hidden="true">
              {WAVE.map((height, index) => (
                <rect key={index} x={index * 4} y={16 - height / 2} width="2.4" height={height} />
              ))}
            </svg>
          </div>
          <span className={styles.playhead} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function Networks({ networks }: { networks: TelevisionNetworkGroup[] }) {
  return (
    <div className={`${styles.frame} ${styles.screen}`}>
      <div className={styles.screenHead}>
        <p className={styles.screenTitle}>
          Network relationships
        </p>
        <p className={styles.screenMeta}>Linear TV · CTV · OTT</p>
      </div>
      <div className={styles.networks}>
        {networks.map((group) => (
          <div key={group.label} className={styles.networkGroup}>
            <p className={styles.networkLabel}>{group.label}</p>
            <ul className={styles.networkList}>
              {group.names.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TelevisionProductionVisual({ kind, frames, footage, networks }: TelevisionProductionVisualProps) {
  if (kind === "storyboard") return <Storyboard frames={frames} />;
  if (kind === "script") return <Script frames={frames} />;
  if (kind === "footage") return <Footage footage={footage} />;
  if (kind === "edit") return <Edit frames={frames} />;
  return <Networks networks={networks} />;
}

export const PRODUCTION_CAPTIONS: Record<TelevisionProductionVisualKind, string> = {
  storyboard: "Storyboard view built from frames of the finished Trane spot",
  script: "Key frames and supers from the finished :15 Trane spot",
  footage: "Live-action frames from the finished Trane spot",
  edit: "Illustrative edit timeline using frames from the Trane spot",
  networks: "Major networks Kosick works with directly",
};
