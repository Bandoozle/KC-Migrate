"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./SiteFooter.module.css";

/**
 * Footer link group. Phones get a collapsible row; from 640px up the CSS
 * hides the toggle and always shows the list under a plain heading.
 */
export function FooterDisclosure({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <h2 className={styles.colTitle}>
        <span className={styles.colTitleText}>{title}</span>
        <button
          type="button"
          className={styles.colToggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {title}
          <span className={styles.colToggleIcon} aria-hidden="true" />
        </button>
      </h2>
      <div id={panelId} className={styles.colPanel} data-open={open || undefined}>
        {children}
      </div>
    </>
  );
}
