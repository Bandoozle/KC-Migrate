import Script from "next/script";
import { Suspense } from "react";
import { headers } from "next/headers";
import { AnalyticsPageViews } from "@/components/analytics/AnalyticsPageViews";
import { getGtmId, isAnalyticsEnabled } from "@/lib/analytics/config";
import { requestHostname } from "@/lib/site";

/**
 * Single analytics install: Google Tag Manager only.
 * WP duplicated Site Kit gtag + manual GTM + Ads tags; GTM (GTM-K4QK6SP) is the one loader here. Its container
 * holds the Google tags for G-XPYR1CEF3E and AW-785313466, so no gtag.js is loaded and no destination is
 * configured a second time.
 *
 * The init snippet below also defines `window.gtag`, Google's standard stub. WordPress had it (from the Site Kit
 * snippets) and GTM does not create one. The stub only queues commands on `dataLayer`, where the container's
 * Google tags pick them up; no conversion is sent from here. Conversions are Tag Manager tags.
 */
export async function Analytics() {
  const headerStore = await headers();
  const host = requestHostname(headerStore.get("x-forwarded-host") || headerStore.get("host"));
  if (!isAnalyticsEnabled(host)) return null;

  const gtmId = getGtmId();
  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
      `}</Script>
      <Script
        id="gtm-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
    </>
  );
}
