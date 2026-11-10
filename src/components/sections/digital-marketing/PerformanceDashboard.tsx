"use client";

import { useState } from "react";
import s from "./PerformanceDashboard.module.css";

/*
 * A sample reporting view: what gets tracked, from which channel, and where
 * each lead came from. Deliberately no numbers: it shows how performance is
 * monitored, not results anyone achieved.
 */
const CHANNELS = [
  { id: "google", name: "Google Ads", color: "#5b63f5" },
  { id: "meta", name: "Meta Ads", color: "#e0703f" },
  { id: "streaming", name: "Streaming", color: "#2fa58a" },
] as const;
type ChannelId = (typeof CHANNELS)[number]["id"];

/* Shapes for the traffic chart (relative, unlabelled), 30 days */
const SHAPES: Record<ChannelId, number[]> = {
  google: [0.42, 0.45, 0.5, 0.48, 0.55, 0.6, 0.52, 0.5, 0.58, 0.62, 0.66, 0.6, 0.57, 0.64, 0.7, 0.68, 0.63, 0.66, 0.72, 0.76, 0.7, 0.68, 0.74, 0.78, 0.8, 0.74, 0.72, 0.78, 0.82, 0.84],
  meta: [0.3, 0.32, 0.36, 0.4, 0.34, 0.3, 0.38, 0.44, 0.46, 0.4, 0.36, 0.42, 0.5, 0.52, 0.46, 0.42, 0.48, 0.54, 0.56, 0.5, 0.46, 0.52, 0.58, 0.6, 0.54, 0.5, 0.56, 0.6, 0.62, 0.58],
  streaming: [0.12, 0.14, 0.16, 0.15, 0.18, 0.22, 0.2, 0.18, 0.21, 0.24, 0.26, 0.23, 0.22, 0.25, 0.28, 0.3, 0.27, 0.26, 0.29, 0.32, 0.3, 0.28, 0.31, 0.34, 0.36, 0.33, 0.32, 0.35, 0.38, 0.4],
};

const W = 600;
const H = 170;
function line(values: number[]) {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${((i / (values.length - 1)) * W).toFixed(1)} ${(H - v * (H - 16) - 6).toFixed(1)}`)
    .join(" ");
}

const FUNNEL = [
  { name: "Impressions", width: 1 },
  { name: "Clicks", width: 0.72 },
  { name: "Site visits", width: 0.6 },
  { name: "Leads", width: 0.34 },
  { name: "Customers", width: 0.2 },
];

const SOURCES: Array<{ channel: ChannelId; label: string; calls: boolean; forms: boolean; sales: boolean }> = [
  { channel: "google", label: "Search & YouTube", calls: true, forms: true, sales: true },
  { channel: "meta", label: "Facebook & Instagram", calls: false, forms: true, sales: true },
  { channel: "streaming", label: "Pre-roll & connected TV", calls: false, forms: true, sales: false },
];

const FEED: Array<{ channel: ChannelId; what: string; detail: string; when: string }> = [
  { channel: "google", what: "Quote request", detail: "Form · Search campaign", when: "2 min ago" },
  { channel: "meta", what: "Lead form", detail: "Instagram · Spring offer", when: "18 min ago" },
  { channel: "google", what: "Phone call", detail: "Call from ad · Geo-targeted", when: "41 min ago" },
  { channel: "streaming", what: "Site visit to booking", detail: "Retargeted after pre-roll", when: "1 hr ago" },
];

function Check({ on }: { on: boolean }) {
  return on ? (
    <span className={s.yes} aria-label="Tracked">
      ✓
    </span>
  ) : (
    <span className={s.no} aria-label="Not used">
      –
    </span>
  );
}

export function PerformanceDashboard() {
  const [focus, setFocus] = useState<ChannelId | "all">("all");
  const dim = (id: ChannelId) => focus !== "all" && focus !== id;

  return (
    <div className={s.app}>
      <div className={s.top}>
        <div>
          <p className={s.title}>Campaign performance</p>
          <p className={s.sub}>Last 30 days · all campaigns</p>
        </div>
        <span className={s.sample}>Sample view · not client data</span>
      </div>

      <div className={s.tabs} role="group" aria-label="Filter by channel">
        <button type="button" aria-pressed={focus === "all"} onClick={() => setFocus("all")}>
          All channels
        </button>
        {CHANNELS.map((c) => (
          <button key={c.id} type="button" aria-pressed={focus === c.id} onClick={() => setFocus(c.id)}>
            <i style={{ background: c.color }} />
            {c.name}
          </button>
        ))}
      </div>

      <div className={s.grid}>
        <section className={`${s.panel} ${s.chartPanel}`} aria-label="Traffic by channel">
          <p className={s.panelTitle}>Traffic by channel</p>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.chart} aria-hidden="true">
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className={s.grid1} />
            ))}
            {CHANNELS.map((c) => (
              <path key={c.id} d={line(SHAPES[c.id])} stroke={c.color} className={s.series} data-dim={dim(c.id)} />
            ))}
          </svg>
          <p className={s.axis} aria-hidden="true">
            <span>30 days ago</span>
            <span>Today</span>
          </p>
        </section>

        <section className={s.panel} aria-label="Conversion funnel">
          <p className={s.panelTitle}>From impression to customer</p>
          <ul className={s.funnel}>
            {FUNNEL.map((step) => (
              <li key={step.name}>
                <span className={s.funnelName}>{step.name}</span>
                <span className={s.funnelTrack}>
                  <span className={s.funnelBar} style={{ width: `${step.width * 100}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.panel} aria-label="Lead sources">
          <p className={s.panelTitle}>What each channel tracks</p>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Calls</th>
                <th scope="col">Forms</th>
                <th scope="col">Sales</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((row) => {
                const channel = CHANNELS.find((c) => c.id === row.channel)!;
                return (
                  <tr key={row.channel} data-dim={dim(row.channel)}>
                    <th scope="row">
                      <i style={{ background: channel.color }} />
                      <span>
                        <b>{channel.name}</b>
                        <small>{row.label}</small>
                      </span>
                    </th>
                    <td>
                      <Check on={row.calls} />
                    </td>
                    <td>
                      <Check on={row.forms} />
                    </td>
                    <td>
                      <Check on={row.sales} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className={s.panel} aria-label="Recent conversions">
          <p className={s.panelTitle}>Recent conversions</p>
          <ul className={s.feed}>
            {FEED.map((item) => {
              const channel = CHANNELS.find((c) => c.id === item.channel)!;
              return (
                <li key={item.what + item.when} data-dim={dim(item.channel)}>
                  <i style={{ background: channel.color }} />
                  <span>
                    <b>{item.what}</b>
                    <small>
                      {channel.name} · {item.detail}
                    </small>
                  </span>
                  <time>{item.when}</time>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
