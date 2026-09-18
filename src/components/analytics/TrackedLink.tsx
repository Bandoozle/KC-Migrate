"use client";

import {
  useEffect,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { trackEmailClick, trackPhoneClick } from "@/lib/analytics/track";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

function isTel(href: string) {
  return href.trim().toLowerCase().startsWith("tel:");
}

function isMailto(href: string) {
  return href.trim().toLowerCase().startsWith("mailto:");
}

/**
 * Anchor that fires phone/email conversion helpers once per click.
 */
export function TrackedLink({ href, onClick, children, ...rest }: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (isTel(href)) trackPhoneClick(href);
    else if (isMailto(href)) trackEmailClick(href);
    onClick?.(event);
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/**
 * Captures tel:/mailto: clicks site-wide without wrapping every link.
 */
export function TrackedLinkDelegation() {
  useEffect(() => {
    function onClick(event: Event) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (isTel(href)) trackPhoneClick(href);
      else if (isMailto(href)) trackEmailClick(href);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
