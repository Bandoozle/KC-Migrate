const GELLIX_FONT_FACE_CSS = `
@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-RegularItalic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-SemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-SemiBoldItalic.woff2") format("woff2");
  font-weight: 600;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gellix";
  src: url("/fonts/gellix/Gellix-BoldItalic.woff2") format("woff2");
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}
`.trim();

const LEGACY_TEXT_FONTS = [
  "Inter Tight",
  "Inter",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Lato",
  "Source Sans Pro",
  "Source Sans 3",
  "Nunito",
  "Nunito Sans",
  "Raleway",
  "Work Sans",
  "Helvetica Neue",
  "Helvetica",
  "Arial",
].join("|");

const LEGACY_TEXT_FONT_PATTERN = new RegExp(
  `("|')?(?:${LEGACY_TEXT_FONTS})\\1`,
  "gi",
);

export const GELLIX_TYPOGRAPHY_CSS = `
${GELLIX_FONT_FACE_CSS}

:root {
  --global-kb-font-family: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --global-heading-font-family: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --global-body-font-family: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --wp--preset--font-family--body: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --wp--preset--font-family--heading: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --global-heading-font-weight: 600;
  --global-h1-font-weight: 600;
  --global-h2-font-weight: 600;
  --global-h3-font-weight: 600;
  --global-h4-font-weight: 600;
  --global-h5-font-weight: 600;
  --global-h6-font-weight: 600;
  /* Neutralize WordPress gold accents (palette 1/2) */
  --global-palette1: #111111;
  --global-palette2: #6e6e73;
  --global-palette-highlight: #111111;
  --global-palette-highlight-alt: #6e6e73;
}

html,
body,
button,
input,
select,
textarea,
.site,
#wrapper,
#inner-wrapper,
#primary,
.content-wrap,
.content-container,
.entry-content-wrap,
.entry-content,
.kb-row-layout-wrap,
.wp-block-kadence-rowlayout,
.wp-block-kadence-column,
.kt-blocks-accordion,
.kt-tab-inner-content,
.wp-block-button__link,
.kb-button,
.kt-button,
.kt-btn-inner-text,
.wp-block-kadence-countup,
.kb-count-up,
.kb-count-up-number,
.kb-count-up-title,
.kb-count-up-process,
.wp-block-navigation,
.wp-block-kadence-navigation,
.site-header-wrap,
.site-footer-wrap,
.footer-html,
.header-navigation,
.primary-menu,
.secondary-menu,
.menu,
.menu-item,
.menu-item a {
  font-family: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  font-weight: 400;
}

.kb-count-up-number,
.kb-count-up-process {
  font-weight: 600 !important;
}

h1,
h2,
h3,
h4,
h5,
h6,
.entry-title,
.page-title,
.wp-block-heading,
.kb-headline,
.kt-blocks-info-box-title,
.wp-block-kadence-advancedheading,
.wp-block-kadence-advancedheading[class*="kt-adv-heading"],
[class*="kt-adv-heading"],
.site-branding .site-title,
.site-title {
  font-family: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
  font-weight: 600 !important;
}

.kosick-solutions-subtitle,
.kosick-what-we-do-description,
.kosick-section-description,
.section-description,
.kosick-body-text,
.body-text,
.kosick-meta-text,
.meta-text,
.wp-block-kadence-advancedheading.kosick-solutions-subtitle,
.wp-block-kadence-advancedheading.kosick-what-we-do-description,
.wp-block-kadence-advancedheading.kosick-section-description,
[class*="kt-adv-heading"].kosick-solutions-subtitle,
[class*="kt-adv-heading"].kosick-what-we-do-description,
[class*="kt-adv-heading"].kosick-section-description {
  font-weight: 400 !important;
}

h1 strong,
h1 b,
h2 strong,
h2 b,
h3 strong,
h3 b,
h4 strong,
h4 b,
h5 strong,
h5 b,
h6 strong,
h6 b,
.entry-title strong,
.entry-title b,
.page-title strong,
.page-title b,
.wp-block-heading strong,
.wp-block-heading b,
.kb-headline strong,
.kb-headline b,
.kt-blocks-info-box-title strong,
.kt-blocks-info-box-title b,
.wp-block-kadence-advancedheading strong,
.wp-block-kadence-advancedheading b,
[class*="kt-adv-heading"] strong,
[class*="kt-adv-heading"] b,
.kosick-solutions-heading strong,
.kosick-solutions-heading b {
  font-family: inherit !important;
  font-weight: 600 !important;
}

/* Utility gold classes from WP — force neutrals even if vars are overridden */
.has-theme-palette-1-color,
.has-theme-palette-2-color {
  color: #6e6e73 !important;
}

.has-theme-palette-1-background-color {
  background-color: #111111 !important;
}

.has-theme-palette-2-background-color {
  background-color: #6e6e73 !important;
}

strong,
b,
.kb-font-weight-bold,
.kb-font-weight-bolder {
  font-weight: 700;
}

h1 strong,
h1 b,
h2 strong,
h2 b,
h3 strong,
h3 b,
h4 strong,
h4 b,
h5 strong,
h5 b,
h6 strong,
h6 b,
.wp-block-heading strong,
.wp-block-heading b,
.wp-block-kadence-advancedheading strong,
.wp-block-kadence-advancedheading b,
[class*="kt-adv-heading"] strong,
[class*="kt-adv-heading"] b {
  font-weight: 600 !important;
}
`.trim();

/** @deprecated Use GELLIX_TYPOGRAPHY_CSS */
export const INTER_TYPOGRAPHY_CSS = GELLIX_TYPOGRAPHY_CSS;

export function neutralizeLegacyTextFonts(css: string): string {
  return css.replace(LEGACY_TEXT_FONT_PATTERN, '"Gellix"');
}

export function isLocalSiteFontPath(pathname: string): boolean {
  return pathname.startsWith("/fonts/gellix/");
}

/** @deprecated Use isLocalSiteFontPath */
export function isLocalInterFontPath(pathname: string): boolean {
  return isLocalSiteFontPath(pathname);
}

/** Drop remote Inter/legacy @font-face blocks; Gellix is served locally. */
export function keepInterFontFaces(_css: string): string {
  return "";
}
