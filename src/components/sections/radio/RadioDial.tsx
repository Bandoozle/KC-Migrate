"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./RadioDial.module.css";

export type RadioStation = {
  id: string;
  name: string;
  call?: string;
  band: "FM" | "AM";
  frequency: number;
};

export type RadioFormat = {
  id: string;
  label: string;
  text: string;
  stations: RadioStation[];
  /** Streaming formats light the streaming lane instead of a broadcast band. */
  platforms?: string[];
  points?: { label: string; text: string }[];
};

type RadioDialProps = {
  formats: RadioFormat[];
};

const BANDS = {
  FM: { min: 88, max: 108, labels: [88, 92, 96, 100, 104, 108], unit: "MHz" },
  AM: { min: 530, max: 1700, labels: [600, 800, 1000, 1200, 1400, 1600], unit: "kHz" },
} as const;

const WAVE = [
  0.34, 0.52, 0.7, 0.46, 0.82, 0.6, 0.38, 0.74, 0.92, 0.56, 0.42, 0.68, 0.86, 0.5, 0.36, 0.62, 0.8, 0.54,
  0.4, 0.72, 0.9, 0.58, 0.44, 0.66, 0.84, 0.48, 0.32, 0.6, 0.78, 0.5,
];

function position(station: RadioStation) {
  const band = BANDS[station.band];
  return ((station.frequency - band.min) / (band.max - band.min)) * 100;
}

function frequencyLabel(station: RadioStation) {
  return station.band === "FM" ? station.frequency.toFixed(1) : String(station.frequency);
}

export function RadioDial({ formats }: RadioDialProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(formats[0]?.id);
  const active = formats.find((format) => format.id === activeId) ?? formats[0];
  const [stationId, setStationId] = useState(active?.stations[0]?.id);
  const [tuning, setTuning] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tuningTimer = useRef<number | undefined>(undefined);

  const allStations = formats.flatMap((format) => format.stations);
  const station = active?.stations.find((item) => item.id === stationId) ?? active?.stations[0];
  const [needles, setNeedles] = useState<Record<"FM" | "AM", number>>(() => {
    const first = formats[0]?.stations[0];
    const initial = { FM: 50, AM: 50 };
    return first ? { ...initial, [first.band]: position(first) } : initial;
  });
  const streaming = Boolean(active?.platforms?.length) && !station;

  useEffect(() => () => window.clearTimeout(tuningTimer.current), []);

  function retune(target?: RadioStation) {
    if (target) setNeedles((current) => ({ ...current, [target.band]: position(target) }));
    setTuning(true);
    window.clearTimeout(tuningTimer.current);
    tuningTimer.current = window.setTimeout(() => setTuning(false), 700);
  }

  function selectFormat(index: number, focus = false) {
    const next = formats[index];
    if (!next) return;
    setActiveId(next.id);
    setStationId(next.stations[0]?.id);
    retune(next.stations[0]);
    if (focus) tabRefs.current[index]?.focus();
  }

  function selectStation(target: RadioStation) {
    if (target.id === station?.id) return;
    setStationId(target.id);
    retune(target);
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = formats.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowDown: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    selectFormat(keys[event.key], true);
  }

  if (!active) return null;

  return (
    <div className={styles.dialStage}>
      <div className={styles.formats} role="tablist" aria-label="Radio formats" aria-orientation="vertical">
        {formats.map((format, index) => {
          const selected = format.id === active.id;
          return (
            <button
              key={format.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`${baseId}-tab-${format.id}`}
              type="button"
              role="tab"
              className={styles.format}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${format.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectFormat(index)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              <span className={styles.formatSignal} aria-hidden="true" />
              <span className={styles.formatLabel}>{format.label}</span>
              <span className={styles.formatMeta}>
                {format.stations.length > 0
                  ? format.stations.map((item) => item.name).join(" · ")
                  : format.platforms?.slice(0, 2).join(" · ")}
              </span>
            </button>
          );
        })}
      </div>

      <figure className={styles.receiver} data-tuning={tuning ? "true" : "false"}>
        <div className={styles.readout}>
          <p className={styles.tuned} aria-live="polite" aria-atomic="true">
            <span className={styles.onAir} aria-hidden="true" />
            <span className={styles.srOnly}>Tuned to </span>
            {station ? (
              <>
                <span className={styles.frequency}>{frequencyLabel(station)}</span>{" "}
                <span className={styles.band}>{station.band}</span>
                <span className={styles.srOnly}>, </span>
                <span className={styles.stationName}>
                  {station.name}
                  {station.call ? <span> · {station.call}</span> : null}
                </span>
              </>
            ) : (
              <>
                <span className={styles.frequency}>Stream</span>
                <span className={styles.srOnly}>: </span>
                <span className={styles.stationName}>{active.platforms?.join(" · ")}</span>
              </>
            )}
          </p>
          <div className={styles.wave} aria-hidden="true">
            {WAVE.map((height, index) => (
              <span key={index} style={{ ["--h" as string]: height, ["--i" as string]: index }} />
            ))}
          </div>
        </div>

        {(Object.keys(BANDS) as ("FM" | "AM")[]).map((bandKey) => {
          const band = BANDS[bandKey];
          const live = station?.band === bandKey;
          return (
            <div key={bandKey} className={styles.bandRow} data-live={live ? "true" : "false"} aria-hidden="true">
              <span className={styles.bandName}>{bandKey}</span>
              <div className={styles.scale}>
                <div className={styles.ticks} />
                {band.labels.map((label, index) => (
                  <span
                    key={label}
                    className={styles.scaleLabel}
                    data-edge={index === 0 ? "start" : index === band.labels.length - 1 ? "end" : undefined}
                    style={{ left: `${((label - band.min) / (band.max - band.min)) * 100}%` }}
                  >
                    {label}
                  </span>
                ))}
                {allStations
                  .filter((item) => item.band === bandKey)
                  .map((item) => (
                    <span
                      key={item.id}
                      className={styles.marker}
                      data-lit={active.stations.some((s) => s.id === item.id) ? "true" : "false"}
                      data-current={item.id === station?.id ? "true" : "false"}
                      style={{ left: `${position(item)}%` }}
                    />
                  ))}
                <span className={styles.needle} style={{ left: `${needles[bandKey]}%` }} />
              </div>
              <span className={styles.bandUnit}>{band.unit}</span>
            </div>
          );
        })}

        <div className={styles.streamRow} data-live={streaming ? "true" : "false"} aria-hidden="true">
          <span className={styles.bandName}>Stream</span>
          <ul className={styles.streamLane}>
            {(formats.find((format) => format.platforms?.length)?.platforms ?? []).map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        </div>
      </figure>

      <div className={styles.panels}>
        {formats.map((format) => {
          const selected = format.id === active.id;
          return (
            <div
              key={format.id}
              id={`${baseId}-panel-${format.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${format.id}`}
              className={styles.panel}
              data-active={selected ? "true" : "false"}
              inert={!selected}
            >
              <div className={styles.panelCopy}>
                <h3 className={styles.panelTitle}>{format.label}</h3>
                <p className={styles.panelText}>{format.text}</p>
              </div>
              <div className={styles.panelAside}>
                {format.stations.length > 0 ? (
                  <div className={styles.stations} role="group" aria-label={`Tune ${format.label}`}>
                    {format.stations.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={styles.station}
                        aria-pressed={selected && item.id === station?.id}
                        onClick={() => selectStation(item)}
                      >
                        <span className={styles.stationFrequency}>
                          {frequencyLabel(item)} {item.band}
                        </span>
                        <span className={styles.stationLabel}>{item.name}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
                {format.points?.length ? (
                  <ul className={styles.points}>
                    {format.points.map((point) => (
                      <li key={point.label}>
                        <strong>{point.label}</strong>
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
