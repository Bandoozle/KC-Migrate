"use client";

import {
  FORM_NAMES,
  GENERATE_LEAD_EVENT,
  getGa4Id,
  isAnalyticsEnabled,
} from "@/lib/analytics/config";

type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushDataLayer(payload: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag(...args);
    return;
  }
  // GTM-only installs still benefit from dataLayer pushes.
  pushDataLayer({ event: "gtag_event", gtagArgs: args });
}

/** SPA / App Router page view for GTM (avoids duplicate gtag config page_view). */
export function trackPageView(path: string, title?: string) {
  if (!isAnalyticsEnabled()) return;
  pushDataLayer({
    event: "page_view",
    page_path: path,
    page_title: title || (typeof document !== "undefined" ? document.title : ""),
    page_location: typeof window !== "undefined" ? window.location.href : path,
  });
}

/**
 * Preserve existing WP conversion event name + GA4 destination.
 * Fire ONLY after a confirmed successful submission.
 */
export function trackFormSuccess(
  formName: (typeof FORM_NAMES)[keyof typeof FORM_NAMES] | string,
) {
  if (!isAnalyticsEnabled()) return;
  const ga4 = getGa4Id();
  gtag("event", GENERATE_LEAD_EVENT, {
    send_to: ga4,
    form_name: formName,
  });
  pushDataLayer({
    event: GENERATE_LEAD_EVENT,
    form_name: formName,
    send_to: ga4,
  });
}

/**
 * Phone clicks — no dedicated custom event existed in WP page snippets
 * (likely GTM / enhanced measurement). Push an explicit dataLayer event
 * and a generate_lead variant with method metadata for key-event continuity.
 */
export function trackPhoneClick(href: string) {
  if (!isAnalyticsEnabled()) return;
  pushDataLayer({
    event: "phone_click",
    link_url: href,
    link_text: "phone",
  });
  gtag("event", "phone_click", {
    send_to: getGa4Id(),
    link_url: href,
  });
}

export function trackEmailClick(href: string) {
  if (!isAnalyticsEnabled()) return;
  pushDataLayer({
    event: "email_click",
    link_url: href,
    link_text: "email",
  });
  gtag("event", "email_click", {
    send_to: getGa4Id(),
    link_url: href,
  });
}

export { FORM_NAMES, GENERATE_LEAD_EVENT };
