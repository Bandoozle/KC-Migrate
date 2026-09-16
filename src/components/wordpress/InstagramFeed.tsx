"use client";

import { useEffect } from "react";
import { hydrateInstagramFeedElement } from "@/lib/wordpress-instagram";

type InstagramFeedProps = {
  pageKey: string;
  html: string;
};

/**
 * Smash Balloon Social Photo Feed compatibility island.
 *
 * The feed markup stays in the WordPress document (inside #wrapper) so layout
 * is unchanged. This component only:
 * 1. owns the Instagram shortcode/feed behavior for later native replacement
 * 2. swaps plugin placeholder.png for cached local images from data-img-src-set
 *
 * It does not load sbi-scripts.min.js or WordPress admin-ajax.
 */
export function InstagramFeed({ pageKey, html }: InstagramFeedProps) {
  useEffect(() => {
    hydrateInstagramFeedElement(document.getElementById("sb_instagram"));
  }, [pageKey, html]);

  return null;
}
