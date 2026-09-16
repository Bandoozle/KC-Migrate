/**
 * Injected after WordPress page CSS so it wins the cascade over Kadence’s
 * 10rem side padding on the Why Choose columns.
 */
export const WHY_CHOOSE_RAIL_CSS = `
.kb-row-layout-id4541_cb53d2-62 > .kt-row-column-wrap,
.kb-row-layout-id4541_cb53d2-62 > .kt-row-column-wrap.kb-theme-content-width {
  width: var(--kosick-content-rail, min(1290px, calc(100% - 2 * var(--global-content-edge-padding, 1.5rem)))) !important;
  max-width: var(--kosick-content-rail, min(1290px, calc(100% - 2 * var(--global-content-edge-padding, 1.5rem)))) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: border-box !important;
}

.kadence-column4541_8810e8-4c,
.kadence-column4541_8810e8-4c > .kt-inside-inner-col,
.kadence-column4541_22382c-cd,
.kadence-column4541_22382c-cd > .kt-inside-inner-col {
  width: 100% !important;
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  box-sizing: border-box !important;
}

.kb-row-layout-id4541_cb53d2-62 .kosick-capabilities,
.kb-row-layout-id4541_cb53d2-62 .kosick-why-tiles,
.kb-row-layout-id4541_cb5129-82,
.kb-row-layout-id4541_cb5129-82 > .kt-row-column-wrap {
  width: 100% !important;
  max-width: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
`.trim();
