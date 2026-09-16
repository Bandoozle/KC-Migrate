"use client";

import { useEffect } from "react";
import { hydrateSmartSliderElement } from "@/lib/wordpress-smartslider";

type SmartSliderProps = {
  pageKey: string;
};

/**
 * Smart Slider 3 compatibility island.
 * Does not load the Smart Slider JS runtime. It unhides staging markup,
 * hydrates image/video URLs, and reproduces ss3-force-full-width layout.
 */
export function SmartSlider({ pageKey }: SmartSliderProps) {
  useEffect(() => hydrateSmartSliderElement(document), [pageKey]);

  return null;
}
