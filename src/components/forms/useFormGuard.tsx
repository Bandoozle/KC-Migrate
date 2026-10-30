"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Fields the form API checks before accepting a submission:
 * - `_kosick_submission`: one id per form instance, so a resubmit is not stored or emailed twice
 * - `_kosick_elapsed`: how long the form was open (scripts submit instantly)
 * - `_kosick_source`: the page the form is on
 * - `cf-turnstile-response`: added by Cloudflare Turnstile, only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set
 */
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let turnstileLoading: Promise<Turnstile> | null = null;

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  turnstileLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
    script.onerror = () => {
      turnstileLoading = null;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return turnstileLoading;
}

function newSubmissionId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Older browsers: RFC 4122 v4 from getRandomValues
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function useFormGuard(action: string) {
  const openedAt = useRef(0);
  const submissionId = useRef("");
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    openedAt.current = Date.now();
    submissionId.current = newSubmissionId();
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !container.current) return;
    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        // Managed widget that only appears when Cloudflare needs an interaction
        widgetId.current = turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action,
          appearance: "interaction-only",
        });
      })
      .catch(() => {
        /* The API rejects the submission without a token and the form shows its error */
      });
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [action]);

  const resetChallenge = useCallback(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, []);

  /** Adds the guard fields to a submission. */
  const stamp = useCallback((data: FormData) => {
    if (!submissionId.current) submissionId.current = newSubmissionId();
    data.set("_kosick_submission", submissionId.current);
    data.set("_kosick_elapsed", String(Date.now() - openedAt.current));
    data.set("_kosick_source", window.location.pathname);
  }, []);

  /** After success the form instance can submit again, as a new submission. */
  const succeeded = useCallback(() => {
    submissionId.current = newSubmissionId();
    openedAt.current = Date.now();
    resetChallenge();
  }, [resetChallenge]);

  /** After a failure, a retry keeps the same id; a Turnstile token is single-use. */
  const failed = useCallback(() => resetChallenge(), [resetChallenge]);

  const challenge = TURNSTILE_SITE_KEY ? <div ref={container} /> : null;

  return { stamp, succeeded, failed, challenge };
}
