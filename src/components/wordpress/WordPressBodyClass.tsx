"use client";

import { useEffect } from "react";

const RUNTIME_BODY_CLASSES = [
  "kosick-mega-dim",
  "kadence-scrollbar-fixer",
  "showing-popup-drawer-from-left",
  "showing-popup-drawer-from-right",
  "showing-popup-drawer-from-top",
  "showing-popup-drawer-from-bottom",
] as const;

type WordPressBodyClassProps = {
  className: string;
  pageKey: string;
};

/**
 * Keeps <body class> in sync with the active WordPress document on soft nav.
 * Root layout only applies the class on the initial document request.
 */
export function WordPressBodyClass({ className, pageKey }: WordPressBodyClassProps) {
  useEffect(() => {
    for (const name of RUNTIME_BODY_CLASSES) {
      document.body.classList.remove(name);
    }
    document.body.style.removeProperty("--scrollbar-offset");
    document.body.className = className;

    return () => {
      for (const name of RUNTIME_BODY_CLASSES) {
        document.body.classList.remove(name);
      }
      document.body.style.removeProperty("--scrollbar-offset");
    };
  }, [className, pageKey]);

  return null;
}
