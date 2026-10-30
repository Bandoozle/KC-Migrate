"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isAnalyticsEnabled } from "@/lib/analytics/config";
import { trackPageView } from "@/lib/analytics/track";

/**
 * Last path sent, kept outside the component: each route group mounts its own
 * page shell, so this component remounts when navigating between groups
 * (home → a service page) and per-instance state would treat that as the
 * first page load and skip the page_view.
 */
let lastTrackedPath: string | null = null;

/**
 * Fires a GTM-friendly page_view on App Router navigations.
 * Skips the first paint when GTM's default pageview already covers it
 * (controlled via skipInitial).
 */
export function AnalyticsPageViews({ skipInitial = true }: { skipInitial?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname || "/";

    if (path === lastTrackedPath) return;
    const firstLoad = lastTrackedPath === null;
    lastTrackedPath = path;
    if (firstLoad && skipInitial) return;

    trackPageView(path);
  }, [pathname, searchParams, skipInitial]);

  return null;
}
