"use client";

import { useEffect, useState } from "react";

/**
 * True once the window `load` event has fired. Background videos wait for it so
 * their multi-megabyte downloads never compete with the page's first paint.
 * Visitors with Data Saver on stay on the poster.
 */
export function usePageLoaded(): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const done = () => setLoaded(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(done, 0);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, []);

  return loaded;
}
