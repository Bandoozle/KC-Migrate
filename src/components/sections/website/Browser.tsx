import type { CSSProperties, ReactNode } from "react";
import styles from "./Browser.module.css";

/*
 * Browser chrome shared by the website pages: traffic lights, an address bar
 * and a viewport. The viewport keeps the aspect ratio it's given so screenshots
 * and recordings crop the same way at every size.
 */
type BrowserProps = {
  host: string;
  /** Optional path after the host, shown lighter. */
  path?: string;
  /** Viewport width / height. */
  ratio?: number;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
};

export function Browser({ host, path, ratio = 16 / 10, tone = "light", className, children }: BrowserProps) {
  return (
    <div className={[styles.browser, className].filter(Boolean).join(" ")} data-tone={tone}>
      <div className={styles.chrome} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>
          <svg viewBox="0 0 16 16" width="10" height="10" focusable="false">
            <path fill="currentColor" d="M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z" />
          </svg>
          <span className={styles.host}>{host}</span>
          {path ? <span className={styles.path}>{path}</span> : null}
        </span>
      </div>
      <div className={styles.viewport} style={{ "--ratio": ratio } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

/*
 * The two screen recordings of live client sites. Each was captured in Chrome,
 * so the top 94px of the 1920px frame is Chrome's own toolbar; RecordingView
 * crops it so the page sits directly under our chrome.
 */
export const RECORDINGS = {
  directbuy: {
    src: "/wp-content/uploads/2024/03/screen-recording-2024-03-14-at-9.34.23-am-1.mp4",
    host: "directbuyfurnace.ca",
    ratio: 1920 / 964,
    label: "Screen recording scrolling the DirectBuy Furnace home page",
  },
  skinfolio: {
    src: "/wp-content/uploads/2024/03/screen-recording-2024-03-14-at-9.30.00-am-1.mp4",
    host: "skinfolio.com",
    ratio: 1920 / 878,
    label: "Screen recording shopping the Skinfolio store, from the home page to a product page",
  },
} as const;

export type RecordingKey = keyof typeof RECORDINGS;

export const recordingCropClass = styles.recording;
