async function inspect(path, label) {
  const res = await fetch(`http://localhost:3000${path}`);
  const html = await res.text();
  return {
    label,
    status: res.status,
    bodyClass: html.match(/<body[^>]*class="([^"]*)"/)?.[1]?.slice(0, 220),
    hasMasthead: html.includes('id="masthead"'),
    hasColophon: html.includes('id="colophon"'),
    hasFooterHook: html.includes("kb-row-layout-id11279_962a22-df"),
    hasNativeHeader: html.includes("site-header__cta"),
    hasKadenceNav: html.includes("main-navigation header-navigation hover-to-open"),
    hasGetInTouch: html.includes("GET IN TOUCH") || html.includes("Get In Touch"),
    hasLogo: html.includes("cropped-Kosick-Communications.png"),
    hasKadenceHeaderCss: html.includes("header.min.css"),
    hasKadenceFooterCss: html.includes("footer.min.css"),
    hasBlocksCss: html.includes("kadence_blocks_css") || html.includes("kb-row-layout-id"),
    hasCustomCss: html.includes("Optimum") || html.includes("Didot"),
    hasVimeo: html.includes("player.vimeo.com/video/911448655"),
    hasTabs: html.includes("tab-defineyourself"),
    hasMobileDrawer: html.includes('id="mobile-drawer"'),
    colophonCount: (html.match(/id="colophon"/g) || []).length,
    mastheadCount: (html.match(/id="masthead"/g) || []).length,
    inventedMaxW: html.includes("mx-auto max-w-2xl"),
  };
}

console.log(await inspect("/", "home"));
console.log(await inspect("/services", "services"));
console.log(await inspect("/services/digital-marketing", "digital-marketing"));
console.log(await inspect("/digital-marketing", "digital-marketing-flat"));
console.log(await inspect("/services/corporate-branding", "corporate-branding"));
console.log(await inspect("/contact", "contact"));
console.log(await inspect("/feature-articles", "feature-articles"));
