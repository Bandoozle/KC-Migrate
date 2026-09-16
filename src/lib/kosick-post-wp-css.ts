import { GELLIX_TYPOGRAPHY_CSS } from "@/lib/wordpress-typography";
import { KOSICK_TYPOGRAPHY_SYSTEM_CSS } from "@/lib/kosick-typography-system";
import { WHY_CHOOSE_RAIL_CSS } from "@/lib/wordpress-why-choose";

/** Vertically center tab copy beside feature images (all Build-a-brand tabs). */
const AMPLITUDE_TABS_LAYOUT_CSS = `
.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns,
.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns.kt-row-valign-top {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  column-gap: 2.5rem !important;
  align-items: center !important;
  align-content: center !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns > .wp-block-kadence-column,
.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns > [class*="kadence-column"] {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-self: center !important;
  height: auto !important;
  min-height: 0 !important;
}

.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns > .wp-block-kadence-column > .kt-inside-inner-col,
.amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns > [class*="kadence-column"] > .kt-inside-inner-col {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: flex-start !important;
  width: 100% !important;
  height: auto !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.amplitude-tabs .kt-tab-inner-content .kb-row-layout-wrap > .kt-row-column-wrap {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Lock every tab image to Define Yourself’s 3:2 frame — same 4px radius as bento */
.amplitude-tabs .tab-feature-image,
.amplitude-tabs .wp-block-kadence-image.tab-feature-image,
.amplitude-tabs .kt-tab-inner-content .wp-block-kadence-image,
.amplitude-tabs figure.wp-block-kadence-image,
.amplitude-tabs figure.tab-feature-image,
.entry-content .amplitude-tabs .tab-feature-image,
.entry-content .amplitude-tabs figure.wp-block-kadence-image {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  aspect-ratio: 3 / 2 !important;
  overflow: hidden !important;
  border-radius: 4px !important;
  clip-path: inset(0 round 4px) !important;
}

.amplitude-tabs .tab-feature-image img,
.amplitude-tabs .wp-block-kadence-image.tab-feature-image img,
.amplitude-tabs .kt-tab-inner-content .wp-block-kadence-image img,
.amplitude-tabs .wp-block-kadence-image img,
.amplitude-tabs img.kb-img,
.amplitude-tabs .kb-img,
.entry-content .amplitude-tabs .tab-feature-image img,
.entry-content .amplitude-tabs img.kb-img {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: none !important;
  aspect-ratio: unset !important;
  object-fit: cover !important;
  object-position: center !important;
  border-radius: 4px !important;
  clip-path: inset(0 round 4px) !important;
}

@media (max-width: 767px) {
  .amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns,
  .amplitude-tabs .kt-tab-inner-content .kt-row-column-wrap.kt-has-2-columns.kt-row-valign-top {
    grid-template-columns: minmax(0, 1fr) !important;
    row-gap: 1.25rem !important;
    align-items: start !important;
  }
}
`.trim();

/**
 * Design-system CSS injected AFTER WordPress/Kadence stylesheets + page inline
 * CSS so Next.js wins the cascade without relying on import order in layout.
 */
export const KOSICK_POST_WP_DESIGN_CSS = [
  GELLIX_TYPOGRAPHY_CSS,
  KOSICK_TYPOGRAPHY_SYSTEM_CSS,
  WHY_CHOOSE_RAIL_CSS,
  AMPLITUDE_TABS_LAYOUT_CSS,
]
  .filter(Boolean)
  .join("\n\n");
