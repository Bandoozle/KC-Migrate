/**
 * Kosick typography system — Next.js is the source of truth.
 * Injected after WordPress CSS via KOSICK_POST_WP_DESIGN_CSS.
 *
 * Baseline section title + description:
 * "Marketing built to move brands forward." (+ its lead paragraph)
 */

export const KOSICK_TYPOGRAPHY_SYSTEM_CSS = `
:root {
  --kosick-font: "Gellix", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --kosick-title-desc-gap: 12px;

  --kosick-color-text: #1a1a1a;
  --kosick-color-text-strong: #111111;
  --kosick-color-muted: #50565b;
  --kosick-color-meta: #6e6e73;

  /* 1. Hero / page H1 */
  --kosick-page-title-size: clamp(2.25rem, 5vw, 3.25rem);
  --kosick-page-title-weight: 600;
  --kosick-page-title-leading: 1.12;
  --kosick-page-title-tracking: -0.02em;

  /* 2. Section title / H2 — Marketing baseline */
  --kosick-section-title-size: clamp(2rem, 4vw, 2.75rem);
  --kosick-section-title-weight: 600;
  --kosick-section-title-leading: 1.15;
  --kosick-section-title-tracking: -0.02em;

  /* 3. Section description / lead */
  --kosick-section-desc-size: 1.125rem; /* 18px */
  --kosick-section-desc-weight: 400;
  --kosick-section-desc-leading: 1.55;

  /* 4. Subsection / H3 */
  --kosick-subsection-title-size: clamp(1.375rem, 2.2vw, 1.75rem);
  --kosick-subsection-title-weight: 600;
  --kosick-subsection-title-leading: 1.25;
  --kosick-subsection-title-tracking: -0.015em;

  /* 5. Card title / H4 */
  --kosick-card-title-size: 1.375rem; /* 22px */
  --kosick-card-title-weight: 600;
  --kosick-card-title-leading: 1.2;
  --kosick-card-title-tracking: -0.01em;

  /* 6. Eyebrow / label */
  --kosick-eyebrow-size: 0.8125rem; /* 13px */
  --kosick-eyebrow-weight: 600;
  --kosick-eyebrow-leading: 1.3;
  --kosick-eyebrow-tracking: 0.08em;

  /* Feature-column label — Amplitude: 18px → md 22px, medium, #50565B */
  --kosick-feature-label-size: 18px;
  --kosick-feature-label-size-md: 22px;
  --kosick-feature-label-weight: 500;
  --kosick-feature-label-leading: 20px;
  --kosick-feature-label-leading-md: 24px;
  --kosick-feature-label-color: #50565b;

  /* Feature-column title — Amplitude: 26px → md 44px, semibold */
  --kosick-feature-title-size: 26px;
  --kosick-feature-title-size-md: 44px;
  --kosick-feature-title-weight: 600;
  --kosick-feature-title-leading: 29px;
  --kosick-feature-title-leading-md: 48px;
  --kosick-feature-title-tracking: -0.5px;
  --kosick-feature-title-tracking-md: -1px;

  /* Feature-column lead */
  --kosick-feature-lead-size: 1.125rem; /* 18px */
  --kosick-feature-lead-weight: 400;
  --kosick-feature-lead-leading: 1.5;
  --kosick-feature-lead-gap: 1rem;

  /* 7. Body */
  --kosick-body-size: 1.0625rem; /* 17px */
  --kosick-body-weight: 400;
  --kosick-body-leading: 1.6;

  /* 8. Meta / small */
  --kosick-meta-size: 0.9375rem; /* 15px */
  --kosick-meta-weight: 400;
  --kosick-meta-leading: 1.45;
}

/* ——— Utility classes (design system) ——— */

.page-title,
.kosick-page-title {
  margin: 0 0 var(--kosick-title-desc-gap);
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-page-title-size) !important;
  font-weight: var(--kosick-page-title-weight) !important;
  line-height: var(--kosick-page-title-leading) !important;
  letter-spacing: var(--kosick-page-title-tracking) !important;
  color: var(--kosick-color-text) !important;
  text-transform: none !important;
}

.section-title,
.kosick-section-title {
  margin: 0 0 var(--kosick-title-desc-gap);
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-section-title-size) !important;
  font-weight: var(--kosick-section-title-weight) !important;
  line-height: var(--kosick-section-title-leading) !important;
  letter-spacing: var(--kosick-section-title-tracking) !important;
  color: var(--kosick-color-text) !important;
  text-transform: none !important;
}

.section-description,
.kosick-section-description {
  display: block;
  margin: 0 !important;
  max-width: 42rem;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-section-desc-size) !important;
  font-weight: var(--kosick-section-desc-weight) !important;
  line-height: var(--kosick-section-desc-leading) !important;
  letter-spacing: 0 !important;
  color: var(--kosick-color-muted) !important;
  text-transform: none !important;
}

/* Constrained leads in centered sections need auto side margins */
.section-description.has-text-align-center,
.kosick-section-description.has-text-align-center,
.section-title.has-text-align-center,
.kosick-section-title.has-text-align-center,
.page-title.has-text-align-center,
.kosick-page-title.has-text-align-center,
.eyebrow.has-text-align-center,
.kosick-eyebrow.has-text-align-center,
.entry-content h1.has-text-align-center,
.entry-content h2.has-text-align-center,
.entry-content h3.has-text-align-center,
.entry-content h4.has-text-align-center.kosick-section-description,
.entry-content .wp-block-heading.has-text-align-center,
.entry-content .wp-block-kadence-advancedheading.has-text-align-center.kosick-section-title,
.entry-content .wp-block-kadence-advancedheading.has-text-align-center.kosick-section-description,
.entry-content p.has-text-align-center,
.entry-content .wp-block-paragraph.has-text-align-center {
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center !important;
}

/* Why Choose lead is intentionally left-aligned */
.entry-content .kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c .wp-block-paragraph,
.entry-content .kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c .wp-block-paragraph.has-text-align-center,
.entry-content .kb-row-layout-id4541_cb53d2-62 .kosick-section-description {
  margin-left: 0 !important;
  margin-right: 0 !important;
  text-align: left !important;
}

/* Solutions subtitle is intentionally left-aligned */
.entry-content .kosick-solutions-subtitle,
.entry-content .wp-block-kadence-advancedheading.kosick-solutions-subtitle,
.kb-row-layout-id4541_99352b-d8 .kosick-solutions-subtitle {
  margin-left: 0 !important;
  margin-right: 0 !important;
  text-align: left !important;
}

/* Centered section intros match Build-a-brand title + lead exactly */
.entry-content .kosick-section-title.has-text-align-center,
.entry-content h2.kosick-section-title.has-text-align-center,
.entry-content .wp-block-kadence-advancedheading.kosick-section-title.has-text-align-center,
.entry-content .wp-block-kadence-advancedheading.kosick-section-title.has-text-align-center[data-kb-block] {
  font-size: var(--kosick-section-title-size) !important;
  font-weight: var(--kosick-section-title-weight) !important;
  line-height: var(--kosick-section-title-leading) !important;
  letter-spacing: var(--kosick-section-title-tracking) !important;
  color: var(--kosick-color-text) !important;
  text-transform: none !important;
  max-width: 42rem;
}

.entry-content .kosick-section-description.has-text-align-center,
.entry-content h4.kosick-section-description.has-text-align-center,
.entry-content .wp-block-kadence-advancedheading.kosick-section-description.has-text-align-center,
.entry-content .wp-block-kadence-advancedheading.kosick-section-description.has-text-align-center[data-kb-block] {
  display: block !important;
  font-size: var(--kosick-section-desc-size) !important;
  font-weight: var(--kosick-section-desc-weight) !important;
  line-height: var(--kosick-section-desc-leading) !important;
  color: var(--kosick-color-muted) !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  max-width: 42rem;
}

.subsection-title,
.kosick-subsection-title {
  margin: 0 0 0.5rem;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-subsection-title-size) !important;
  font-weight: var(--kosick-subsection-title-weight) !important;
  line-height: var(--kosick-subsection-title-leading) !important;
  letter-spacing: var(--kosick-subsection-title-tracking) !important;
  color: var(--kosick-color-text) !important;
  text-transform: none !important;
}

.card-title,
.kosick-card-title {
  margin: 0;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-card-title-size) !important;
  font-weight: var(--kosick-card-title-weight) !important;
  line-height: var(--kosick-card-title-leading) !important;
  letter-spacing: var(--kosick-card-title-tracking) !important;
  color: var(--kosick-color-text-strong) !important;
  text-transform: none !important;
}

.eyebrow,
.kosick-eyebrow {
  display: block;
  margin: 0 0 0.35rem;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-eyebrow-size) !important;
  font-weight: var(--kosick-eyebrow-weight) !important;
  line-height: var(--kosick-eyebrow-leading) !important;
  letter-spacing: var(--kosick-eyebrow-tracking) !important;
  color: var(--kosick-color-meta) !important;
  text-transform: uppercase !important;
}

/* Amplitude-style feature column: sentence-case label + large title + muted lead */
.kosick-eyebrow.kosick-feature-label,
.eyebrow.kosick-feature-label,
.entry-content .kosick-eyebrow.kosick-feature-label,
.entry-content h2.kosick-eyebrow.kosick-feature-label,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label[data-kb-block] {
  margin: 0 0 0.75rem !important;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-feature-label-size) !important;
  font-weight: var(--kosick-feature-label-weight) !important;
  line-height: var(--kosick-feature-label-leading) !important;
  letter-spacing: 0 !important;
  color: var(--kosick-feature-label-color) !important;
  text-transform: none !important;
}

/* “What we offer” / Solutions-by-team eyebrow — same Amplitude label size */
.kosick-solutions-by-team-eyebrow,
.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content .kosick-solutions-by-team-eyebrow,
.entry-content .kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content h2.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow[data-kb-block] {
  margin: 0 0 0.75rem !important;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-feature-label-size) !important;
  font-weight: 600 !important;
  line-height: var(--kosick-feature-label-leading) !important;
  letter-spacing: 0 !important;
  color: var(--kosick-feature-label-color) !important;
  text-transform: none !important;
}

.kosick-section-title.kosick-feature-title,
.section-title.kosick-feature-title,
.entry-content .kosick-section-title.kosick-feature-title,
.entry-content h1.kosick-feature-title,
.entry-content h2.kosick-feature-title,
.entry-content .wp-block-kadence-advancedheading.kosick-feature-title,
.entry-content .wp-block-kadence-advancedheading.kosick-feature-title[data-kb-block] {
  margin: 0 0 var(--kosick-feature-lead-gap) !important;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-feature-title-size) !important;
  font-weight: var(--kosick-feature-title-weight) !important;
  line-height: var(--kosick-feature-title-leading) !important;
  letter-spacing: var(--kosick-feature-title-tracking) !important;
  color: var(--kosick-color-text-strong) !important;
  text-align: left !important;
  text-transform: none !important;
}

@media (min-width: 768px) {
  .kosick-eyebrow.kosick-feature-label,
  .eyebrow.kosick-feature-label,
  .entry-content .kosick-eyebrow.kosick-feature-label,
  .entry-content h2.kosick-eyebrow.kosick-feature-label,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label[data-kb-block] {
    font-size: var(--kosick-feature-label-size-md) !important;
    line-height: var(--kosick-feature-label-leading-md) !important;
  }

  .kosick-solutions-by-team-eyebrow,
  .kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content .kosick-solutions-by-team-eyebrow,
  .entry-content .kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content h2.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow[data-kb-block] {
    font-size: var(--kosick-feature-label-size-md) !important;
    line-height: var(--kosick-feature-label-leading-md) !important;
  }

  .kosick-section-title.kosick-feature-title,
  .section-title.kosick-feature-title,
  .entry-content .kosick-section-title.kosick-feature-title,
  .entry-content h1.kosick-feature-title,
  .entry-content h2.kosick-feature-title,
  .entry-content .wp-block-kadence-advancedheading.kosick-feature-title,
  .entry-content .wp-block-kadence-advancedheading.kosick-feature-title[data-kb-block] {
    font-size: var(--kosick-feature-title-size-md) !important;
    line-height: var(--kosick-feature-title-leading-md) !important;
    letter-spacing: var(--kosick-feature-title-tracking-md) !important;
  }
}

.kosick-section-description.kosick-feature-lead,
.section-description.kosick-feature-lead,
.entry-content .kosick-section-description.kosick-feature-lead {
  margin: 0 0 1.25rem !important;
  max-width: 34rem;
  font-size: var(--kosick-feature-lead-size) !important;
  font-weight: var(--kosick-feature-lead-weight) !important;
  line-height: var(--kosick-feature-lead-leading) !important;
  color: var(--kosick-color-muted) !important;
  text-align: left !important;
}

/* Amplitude-style outline pill CTA */
.kosick-outline-btn.kb-button,
.kosick-outline-btn.kt-button,
a.kosick-outline-btn,
.entry-content a.kosick-outline-btn.kb-button,
.entry-content .wp-block-kadence-advancedbtn a.kosick-outline-btn.kb-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  width: auto !important;
  margin-top: 0.75rem !important;
  padding: 0.8rem 1.6rem !important;
  border: 1px solid #111111 !important;
  border-radius: 9999px !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #111111 !important;
  box-shadow: none !important;
  font-family: var(--kosick-font) !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  line-height: 1.2 !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  text-decoration: none !important;
}

.kosick-outline-btn.kb-button:hover,
.kosick-outline-btn.kb-button:focus,
.kosick-outline-btn.kt-button:hover,
.kosick-outline-btn.kt-button:focus,
.entry-content a.kosick-outline-btn.kb-button:hover,
.entry-content a.kosick-outline-btn.kb-button:focus,
.entry-content .wp-block-kadence-advancedbtn a.kosick-outline-btn.kb-button:hover,
.entry-content .wp-block-kadence-advancedbtn a.kosick-outline-btn.kb-button:focus {
  background: #111111 !important;
  background-color: #111111 !important;
  color: #ffffff !important;
  border-color: #111111 !important;
}

.kosick-outline-btn .kt-btn-inner-text,
.kosick-outline-btn .kb-svg-icon-wrap {
  color: inherit !important;
}

.kosick-outline-btn .kb-svg-icon-wrap svg {
  width: 1em !important;
  height: 1em !important;
  stroke: currentColor !important;
}

.body-text,
.kosick-body-text {
  margin: 0 0 1rem;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-body-size) !important;
  font-weight: var(--kosick-body-weight) !important;
  line-height: var(--kosick-body-leading) !important;
  color: var(--kosick-color-text) !important;
  text-transform: none !important;
}

.meta-text,
.kosick-meta-text {
  margin: 0;
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-meta-size) !important;
  font-weight: var(--kosick-meta-weight) !important;
  line-height: var(--kosick-meta-leading) !important;
  color: var(--kosick-color-meta) !important;
  text-transform: none !important;
}

.page-title strong,
.page-title b,
.section-title strong,
.section-title b,
.subsection-title strong,
.subsection-title b,
.card-title strong,
.card-title b,
.kosick-page-title strong,
.kosick-page-title b,
.kosick-section-title strong,
.kosick-section-title b,
.kosick-subsection-title strong,
.kosick-subsection-title b,
.kosick-card-title strong,
.kosick-card-title b {
  font-family: inherit !important;
  font-weight: 600 !important;
}

/* ——— Map known homepage / kosick islands onto the system ——— */

.wp-block-kadence-advancedheading.kt-adv-heading4541_f35171-26,
.wp-block-kadence-advancedheading.kt-adv-heading4541_f35171-26[data-kb-block="kb-adv-heading4541_f35171-26"],
.kosick-solutions-heading,
.kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c > .kt-inside-inner-col > .wp-block-heading {
  font-size: var(--kosick-section-title-size) !important;
  font-weight: var(--kosick-section-title-weight) !important;
  line-height: var(--kosick-section-title-leading) !important;
  letter-spacing: var(--kosick-section-title-tracking) !important;
  color: var(--kosick-color-text) !important;
  margin: 0 0 var(--kosick-title-desc-gap) !important;
  text-transform: none !important;
}

.kosick-what-we-do-description,
.kosick-solutions-subtitle,
.wp-block-kadence-advancedheading.kt-adv-heading4541_72c33d-12,
.wp-block-kadence-advancedheading.kt-adv-heading4541_72c33d-12[data-kb-block="kb-adv-heading4541_72c33d-12"],
.kb-row-layout-id4541_cb53d2-62 .kadence-column4541_8810e8-4c > .kt-inside-inner-col > .wp-block-paragraph {
  font-size: var(--kosick-section-desc-size) !important;
  font-weight: var(--kosick-section-desc-weight) !important;
  line-height: var(--kosick-section-desc-leading) !important;
  color: var(--kosick-color-muted) !important;
  text-transform: none !important;
  max-width: 42rem;
}

.kosick-solution-card__title {
  font-size: var(--kosick-card-title-size) !important;
  font-weight: var(--kosick-card-title-weight) !important;
  line-height: var(--kosick-card-title-leading) !important;
  letter-spacing: var(--kosick-card-title-tracking) !important;
}

/* Bento overlay titles match description size (beat theme h3 rules) */
.kosick-bento-card__title,
.kosick-bento-card h3.kosick-bento-card__title,
.entry-content .kosick-bento-card__title,
.entry-content h3.kosick-bento-card__title,
.kosick-bento-card__title-primary,
.kosick-bento-card__title-secondary {
  font-size: 18px !important;
  font-weight: 600 !important;
  line-height: 1.45 !important;
  letter-spacing: 0 !important;
}

.kosick-bento-card__description,
.entry-content .kosick-bento-card__description {
  font-size: 18px !important;
  font-weight: 400 !important;
  line-height: 1.45 !important;
}

.kosick-solution-card__description,
.kosick-solution-card__link,
.kosick-capabilities__lead,
.kosick-capabilities__label,
.kb-row-layout-id4541_cb5129-82 .kb-count-up-title,
.kb-row-layout-id4541_cb5129-82 [class*="kb-count-up-title"] {
  font-size: var(--kosick-meta-size) !important;
  font-weight: var(--kosick-meta-weight) !important;
  line-height: var(--kosick-meta-leading) !important;
}

.kosick-solution-card__link,
.kosick-capabilities__label {
  font-weight: 600 !important;
}

.kosick-why-tile {
  font-size: var(--kosick-meta-size) !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
}

/* ——— Entry content: neutralize Kadence type, apply hierarchy by role ——— */

.entry-content h1.kosick-page-title,
.entry-content .kosick-page-title,
.entry-content .wp-block-kadence-advancedheading.kosick-page-title,
.entry-content .wp-block-kadence-advancedheading.kosick-page-title[data-kb-block] {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-page-title-size) !important;
  font-weight: var(--kosick-page-title-weight) !important;
  line-height: var(--kosick-page-title-leading) !important;
  letter-spacing: var(--kosick-page-title-tracking) !important;
}

.entry-content h1.kosick-section-title,
.entry-content h2.kosick-section-title,
.entry-content .kosick-section-title,
.entry-content .wp-block-kadence-advancedheading.kosick-section-title,
.entry-content .wp-block-kadence-advancedheading.kosick-section-title[data-kb-block] {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-section-title-size) !important;
  font-weight: var(--kosick-section-title-weight) !important;
  line-height: var(--kosick-section-title-leading) !important;
  letter-spacing: var(--kosick-section-title-tracking) !important;
  color: var(--kosick-color-text) !important;
}

.entry-content .kosick-section-description,
.entry-content p.kosick-section-description,
.entry-content .wp-block-paragraph.kosick-section-description {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-section-desc-size) !important;
  font-weight: var(--kosick-section-desc-weight) !important;
  line-height: var(--kosick-section-desc-leading) !important;
  color: var(--kosick-color-muted) !important;
  max-width: 42rem;
}

.entry-content h3.kosick-subsection-title,
.entry-content .kosick-subsection-title,
.entry-content .wp-block-kadence-advancedheading.kosick-subsection-title,
.entry-content .wp-block-kadence-advancedheading.kosick-subsection-title[data-kb-block] {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-subsection-title-size) !important;
  font-weight: var(--kosick-subsection-title-weight) !important;
  line-height: var(--kosick-subsection-title-leading) !important;
}

.entry-content h4.kosick-card-title,
.entry-content .kosick-card-title,
.entry-content .kt-blocks-info-box-title,
.entry-content .wp-block-kadence-advancedheading.kosick-card-title,
.entry-content .wp-block-kadence-advancedheading.kosick-card-title[data-kb-block] {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-card-title-size) !important;
  font-weight: var(--kosick-card-title-weight) !important;
  line-height: var(--kosick-card-title-leading) !important;
}

.entry-content .kosick-eyebrow,
.entry-content h2.kosick-eyebrow,
.entry-content h3.kosick-eyebrow,
.entry-content h4.kosick-eyebrow,
.entry-content span.kosick-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow[data-kb-block] {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-eyebrow-size) !important;
  font-weight: var(--kosick-eyebrow-weight) !important;
  line-height: var(--kosick-eyebrow-leading) !important;
  letter-spacing: var(--kosick-eyebrow-tracking) !important;
  color: var(--kosick-color-meta) !important;
  text-transform: uppercase !important;
}

.entry-content .kosick-eyebrow.kosick-feature-label,
.entry-content h2.kosick-eyebrow.kosick-feature-label,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label[data-kb-block] {
  font-size: var(--kosick-feature-label-size) !important;
  font-weight: var(--kosick-feature-label-weight) !important;
  line-height: var(--kosick-feature-label-leading) !important;
  letter-spacing: 0 !important;
  color: var(--kosick-feature-label-color) !important;
  text-transform: none !important;
}

.entry-content .kosick-solutions-by-team-eyebrow,
.entry-content .kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content h2.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
.entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow[data-kb-block] {
  font-size: var(--kosick-feature-label-size) !important;
  font-weight: 600 !important;
  line-height: var(--kosick-feature-label-leading) !important;
  letter-spacing: 0 !important;
  color: var(--kosick-feature-label-color) !important;
  text-transform: none !important;
}

@media (min-width: 768px) {
  .entry-content .kosick-eyebrow.kosick-feature-label,
  .entry-content h2.kosick-eyebrow.kosick-feature-label,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-feature-label[data-kb-block] {
    font-size: var(--kosick-feature-label-size-md) !important;
    line-height: var(--kosick-feature-label-leading-md) !important;
  }

  .entry-content .kosick-solutions-by-team-eyebrow,
  .entry-content .kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content h2.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow,
  .entry-content .wp-block-kadence-advancedheading.kosick-eyebrow.kosick-solutions-by-team-eyebrow[data-kb-block] {
    font-size: var(--kosick-feature-label-size-md) !important;
    line-height: var(--kosick-feature-label-leading-md) !important;
  }

  .entry-content .kosick-section-title.kosick-feature-title,
  .entry-content h1.kosick-feature-title,
  .entry-content h2.kosick-feature-title,
  .entry-content .wp-block-kadence-advancedheading.kosick-feature-title,
  .entry-content .wp-block-kadence-advancedheading.kosick-feature-title[data-kb-block] {
    font-size: var(--kosick-feature-title-size-md) !important;
    line-height: var(--kosick-feature-title-leading-md) !important;
    letter-spacing: var(--kosick-feature-title-tracking-md) !important;
  }
}

.entry-content p.kosick-body-text,
.entry-content .kosick-body-text,
.entry-content li.kosick-body-text {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-body-size) !important;
  font-weight: var(--kosick-body-weight) !important;
  line-height: var(--kosick-body-leading) !important;
  color: var(--kosick-color-text) !important;
}

.entry-content li.kosick-body-text {
  margin-bottom: 0.35em !important;
}

.entry-content .testimonial-quote,
.entry-content h2.testimonial-quote,
.entry-content .wp-block-kadence-advancedheading.testimonial-quote,
.entry-content .wp-block-kadence-advancedheading.testimonial-quote[data-kb-block],
.entry-content .testimonial-logo,
.entry-content h2.testimonial-logo,
.entry-content .wp-block-kadence-advancedheading.testimonial-logo,
.entry-content .wp-block-kadence-advancedheading.testimonial-logo[data-kb-block] {
  /* Exclude from section-title / feature-title hierarchy */
  font-size: 1.0625rem !important;
  font-weight: 400 !important;
  line-height: 1.55 !important;
  letter-spacing: 0 !important;
}

.entry-content .testimonial-logo,
.entry-content h2.testimonial-logo,
.entry-content .wp-block-kadence-advancedheading.testimonial-logo,
.entry-content .wp-block-kadence-advancedheading.testimonial-logo[data-kb-block] {
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  line-height: 1.35 !important;
}

.entry-content .kosick-meta-text {
  font-family: var(--kosick-font) !important;
  font-size: var(--kosick-meta-size) !important;
  font-weight: var(--kosick-meta-weight) !important;
  line-height: var(--kosick-meta-leading) !important;
  color: var(--kosick-color-meta) !important;
}

/* Contact section — restore WP sizes (detail lines were wrongly subsection-title) */
.entry-content .kb-row-layout-id4541_09415d-fe h2.kt-adv-heading4541_8e787d-69,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_8e787d-69 {
  font-size: 36px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  letter-spacing: -0.02em !important;
}

.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_5cf49d-94,
.entry-content .kb-row-layout-id4541_09415d-fe .kosick-section-description.kt-adv-heading4541_5cf49d-94 {
  font-size: var(--kosick-section-desc-size) !important;
  font-weight: var(--kosick-section-desc-weight) !important;
  line-height: var(--kosick-section-desc-leading) !important;
  color: var(--kosick-color-muted) !important;
  max-width: 26rem !important;
}

.entry-content .kb-row-layout-id4541_09415d-fe .kosick-contact-detail,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_72d304-b1,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_4ba062-65,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_39501c-d1,
.entry-content .kb-row-layout-id4541_09415d-fe .kosick-contact-detail a {
  font-size: 17px !important;
  font-weight: 600 !important;
  line-height: 1.45 !important;
  letter-spacing: 0 !important;
  color: #111111 !important;
  text-transform: none !important;
  max-width: none !important;
}

.entry-content .kb-row-layout-id4541_09415d-fe .kosick-contact-detail mark.kt-highlight,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_72d304-b1 mark.kt-highlight,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_4ba062-65 mark.kt-highlight,
.entry-content .kb-row-layout-id4541_09415d-fe .kt-adv-heading4541_39501c-d1 mark.kt-highlight {
  font-size: 17px !important;
  font-weight: 400 !important;
  color: #888888 !important;
  background: transparent !important;
}

/* Hero title/subtitle — beat hierarchy + sentence-case overrides */
.entry-content .kb-row-layout-id4541_65264e-2a h3.kt-adv-heading4541_5ddf4f-b9,
.entry-content .kb-row-layout-id4541_65264e-2a .kt-adv-heading4541_5ddf4f-b9,
.entry-content .kb-row-layout-id4541_65264e-2a .kosick-hero-title,
.entry-content .kb-row-layout-id4541_65264e-2a .kt-adv-heading4541_5ddf4f-b9 mark {
  font-size: clamp(3.25rem, 9vw, 6rem) !important;
  font-weight: 600 !important;
  line-height: 1em !important;
  letter-spacing: 0.5px !important;
  text-transform: uppercase !important;
  color: #ffffff !important;
}

.entry-content .kb-row-layout-id4541_65264e-2a h2.kt-adv-heading4541_d365d0-34,
.entry-content .kb-row-layout-id4541_65264e-2a .kt-adv-heading4541_d365d0-34,
.entry-content .kb-row-layout-id4541_65264e-2a .kosick-hero-subtitle {
  font-size: clamp(1.125rem, 2.1vw, 1.5rem) !important;
  font-weight: 400 !important;
  line-height: 1.2 !important;
  text-transform: none !important;
  white-space: nowrap !important;
  color: #ffffff !important;
  text-align: center !important;
}
`.trim();
