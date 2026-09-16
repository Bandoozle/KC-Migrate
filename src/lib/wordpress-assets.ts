export type WordPressStylesheet = {
  id: string;
  href: string;
};

export type WordPressPreload = {
  href: string;
  as?: string;
  type?: string;
  crossOrigin?: "anonymous" | "use-credentials";
};

/**
 * Public WordPress/Kadence styles discovered on staging.
 * Runtime loading is document-driven from each page's public HTML.
 * This catalog is for migration tracking so each dependency can be removed later.
 */
export const WORDPRESS_STYLESHEET_CATALOG = [
  {
    id: "kadence-global-css",
    source: "Kadence theme",
    path: "/wp-content/themes/kadence/assets/css/global.min.css",
  },
  {
    id: "kadence-header-css",
    source: "Kadence theme",
    path: "/wp-content/themes/kadence/assets/css/header.min.css",
  },
  {
    id: "kadence-content-css",
    source: "Kadence theme",
    path: "/wp-content/themes/kadence/assets/css/content.min.css",
  },
  {
    id: "kadence-footer-css",
    source: "Kadence theme",
    path: "/wp-content/themes/kadence/assets/css/footer.min.css",
  },
  {
    id: "menu-addons-css",
    source: "Kadence Pro mega menu",
    path: "/wp-content/plugins/kadence-pro/dist/mega-menu/menu-addon.css",
  },
  {
    id: "kadence-blocks-rowlayout-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-rowlayout.css",
  },
  {
    id: "kadence-blocks-column-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-column.css",
  },
  {
    id: "kadence-blocks-advancedbtn-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-advancedbtn.css",
  },
  {
    id: "kadence-blocks-advanced-form-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-advanced-form.css",
  },
  {
    id: "kadence-blocks-tabs-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-tabs.css",
  },
  {
    id: "kadence-blocks-image-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-image.css",
  },
  {
    id: "kadence-blocks-icon-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-icon.css",
  },
  {
    id: "kadence-blocks-accordion-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-accordion.css",
  },
  {
    id: "kadence-blocks-spacer-css",
    source: "Kadence Blocks",
    path: "/wp-content/plugins/kadence-blocks/dist/style-blocks-spacer.css",
  },
  {
    id: "kadence-rankmath-css",
    source: "Kadence + Rank Math",
    path: "/wp-content/themes/kadence/assets/css/rankmath.min.css",
  },
  {
    id: "sbi_styles-css",
    source: "Smash Balloon Instagram Feed",
    path: "/wp-content/plugins/instagram-feed/css/sbi-styles.min.css",
  },
  {
    id: "sbi-tokens-local-css",
    source: "Smash Balloon Instagram Feed",
    path: "/wp-content/plugins/instagram-feed/assets/tokens/sb-tokens-local.css",
  },
  {
    id: "aca-widget-css",
    source: "AI Chat Assistant plugin",
    path: "/wp-content/plugins/ai-chat-assistant/assets/css/chat-widget.css",
  },
  {
    id: "smartslider.min.css",
    source: "Smart Slider 3 Pro (digital-marketing, corporate-branding)",
    path: "/wp-content/plugins/nextend-smart-slider3-pro/Public/SmartSlider3/Application/Frontend/Assets/dist/smartslider.min.css",
  },
  {
    id: "kadence-fonts-gfonts-css",
    source: "Kadence locally hosted Google fonts (page-specific hash)",
    path: "/wp-content/fonts/*.css",
  },
] as const;

export const WORDPRESS_INLINE_STYLE_IDS = [
  "wp-img-auto-sizes-contain-inline-css",
  "kadence-blocks-advancedheading-inline-css",
  "wp-block-library-inline-css",
  "wp-block-cover-inline-css",
  "wp-block-heading-inline-css",
  "wp-block-paragraph-inline-css",
  "wp-block-image-inline-css",
  "wp-block-list-inline-css",
  "wp-block-media-text-inline-css",
  "wp-block-quote-inline-css",
  "wp-block-table-inline-css",
  "wp-block-social-links-inline-css",
  "classic-theme-styles-inline-css",
  "global-styles-inline-css",
  "kadence-global-inline-css",
  "kadence-blocks-global-variables-inline-css",
  "kadence_blocks_css-inline-css",
  "kadence_blocks_palette_css",
  "wp-custom-css",
  "wp-block-custom-css-inline-css",
  "core-block-supports-inline-css",
] as const;

export const WORDPRESS_PAGE_FONT_STYLESHEETS = {
  home: "/wp-content/fonts/ac7cdfd01e79f0db06c698398d3a5977.css",
  services: "/wp-content/fonts/b592e4339d3aa8cc3db30778b68c550e.css",
  "digital-marketing": "/wp-content/fonts/ed18be67baadbf184520b4289975b7a3.css",
  "corporate-branding": "/wp-content/fonts/80866af16c9690f10cbb8887bc963392.css",
  contact: "/wp-content/fonts/b592e4339d3aa8cc3db30778b68c550e.css",
  "feature-articles": "/wp-content/fonts/51a918aef3024b7a42e168825fe40c4a.css",
  "feature-articles-footer": "/wp-content/fonts/5161f5b7fe7db362394f279a158cf7ac.css",
} as const;

export const WORDPRESS_CHILD_THEME_FONTS = [
  "/wp-content/themes/kosick/fonts/hinted-Optimum-Roman.woff2",
  "/wp-content/themes/kosick/fonts/Didot.woff2",
  "/wp-content/themes/kosick/fonts/Didot-Italic.woff2",
] as const;
