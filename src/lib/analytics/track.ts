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

export type FormLeadDetails = {
  email?: string;
  phone?: string;
  formId?: string;
};

function normalizeLeadEmail(value: string | undefined): string | undefined {
  const email = value?.trim().toLowerCase();
  return email || undefined;
}

/** Match the GTM contact listener: 10-digit numbers become +1, 11-digit 1… become +. */
function normalizeLeadPhone(value: string | undefined): string | undefined {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}

/**
 * One successful submission produces one GA4 lead.
 * The GTM container listens for `kosick_contact_lead` and its generate_lead
 * tag sends that single event to G-XPYR1CEF3E. A second gtag or dataLayer
 * `generate_lead` would count again.
 * Other forms have no GTM lead trigger, so they send one gtag event only.
 */
export function trackFormSuccess(
  formName: (typeof FORM_NAMES)[keyof typeof FORM_NAMES] | string,
  details: FormLeadDetails = {},
) {
  if (!isAnalyticsEnabled()) return;

  if (formName === FORM_NAMES.contact) {
    pushDataLayer({
      event: "kosick_contact_lead",
      kb_form_id: details.formId || "kb-adv-form-11283-cpt-id",
      lead_email: normalizeLeadEmail(details.email),
      lead_phone: normalizeLeadPhone(details.phone),
      form_name: formName,
    });
    return;
  }

  gtag("event", GENERATE_LEAD_EVENT, {
    send_to: getGa4Id(),
    form_name: formName,
  });
}

/**
 * Phone clicks. GTM also listens for tel: link clicks, so callers should
 * not attach this to the same anchor GTM already tracks.
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
