"use client";

import { useSyncExternalStore } from "react";
import styles from "./ContactPageView.module.css";

const PACIFIC = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver",
  weekday: "short",
  hour: "numeric",
  hourCycle: "h23",
});

/** The hours the chat assistant publishes: Monday to Friday, 8 AM to 5 PM Pacific. */
function withinOfficeHours(): boolean {
  const parts = PACIFIC.formatToParts(new Date());
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  return !["Sat", "Sun"].includes(weekday) && hour >= 8 && hour < 17;
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/** Null in server HTML: the state depends on the visitor's current time. */
export function OfficeStatus() {
  const open = useSyncExternalStore<boolean | null>(subscribe, withinOfficeHours, () => null);
  return (
    <p className={styles.hours} data-open={open === true}>
      <span className={styles.hoursDot} aria-hidden="true" />
      <span>
        {open === null ? null : <b>{open ? "Within office hours now. " : "Outside office hours now. "}</b>}
        Monday to Friday, 8:00 AM to 5:00 PM Pacific
      </span>
    </p>
  );
}
