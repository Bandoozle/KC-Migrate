"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { isAnalyticsEnabled } from "@/lib/analytics/config";
import { trackPageView } from "@/lib/analytics/track";

/**
 * Fires a GTM-friendly page_view on App Router navigations.
 * Skips the first paint when GTM's default pageview already covers it
 * (controlled via skipInitial).
 */
export function AnalyticsPageViews({ skipInitial = true }: { skipInitial?: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = useRef(true);

  useEffect(() => {
    if (!isAnalyticsEnabled()) return;
    const search = searchParams?.toString();
    const path = search ? `${pathname}?${search}` : pathname || "/";

    if (initial.current) {
      initial.current = false;
      if (skipInitial) return;
    }

    trackPageView(path);
  }, [pathname, searchParams, skipInitial]);

  return null;
}
