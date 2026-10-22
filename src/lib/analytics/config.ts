/**
 * Kosick analytics config — reuse existing GTM / GA4 IDs from WordPress.
 * Do not invent new container or measurement IDs.
 */

import { isProductionHost } from "@/lib/site";

export const KOSICK_GTM_ID = "GTM-K4QK6SP";
export const KOSICK_GA4_ID = "G-XPYR1CEF3E";
export const KOSICK_GOOGLE_ADS_ID = "AW-785313466";

/** Existing WP lead-conversion event (Kadence success snippet). */
export const GENERATE_LEAD_EVENT = "generate_lead" as const;

export const FORM_NAMES = {
  contact: "Kosick Contact Form",
  newsletter: "Kosick Newsletter Form",
  comfortmaker: "Comfortmaker Registration Form",
  chatLead: "Kosick AI Chat Lead Form",
} as const;

/**
 * Analytics runs only on www.kosick.com and kosick.com.
 * The Vercel production hostname is not a preview environment, so host is
 * the gate that keeps test traffic out of the production GTM container.
 * NEXT_PUBLIC_ANALYTICS_ENABLED=true forces it on for a deliberate debug session.
 */
export function isAnalyticsEnabled(hostname?: string | null): boolean {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true") return true;
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "false") return false;
  const host =
    hostname ?? (typeof window !== "undefined" ? window.location.hostname : null);
  return isProductionHost(host);
}

export function getGtmId(): string {
  return process.env.NEXT_PUBLIC_GTM_ID?.trim() || KOSICK_GTM_ID;
}

export function getGa4Id(): string {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || KOSICK_GA4_ID;
}
