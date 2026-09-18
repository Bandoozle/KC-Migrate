import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

execSync(
  'curl.exe -sL -w "\\nHTTP:%{http_code}\\n" "http://localhost:3000/corporate-events/" -o tmp-parity/rest/corporate-events.native.html',
  { stdio: "inherit" },
);

const h = readFileSync("tmp-parity/rest/corporate-events.native.html", "utf8");
const checks = {
  kosickNative: /kosick-native/.test(h),
  siteHeader: /kosick-site-header|SiteHeader|data-site-header|class="[^"]*header/.test(h),
  siteFooter: /Pay Your Invoice|Site Map|kosick-site-footer|footer/.test(h),
  hero: /Corporate Events/.test(h) && /Start Planning/.test(h),
  feature: /Experience the Power of Corporate Events/.test(h),
  process: /Our Process/.test(h) && /Discovery/.test(h),
  video: /player\.vimeo\.com\/video\/1190301042/.test(h),
  promo: /We specialize in organizing impactful corporate events/.test(h),
  faq: /Frequently Asked Questions/.test(h),
  related: /Conferences/.test(h) && /Reward Programs/.test(h),
  cta: /Ready to Plan Your Next Corporate Event/.test(h),
  wpInteract: /WordPressInteract/.test(h),
  wpShell: /WordPressShell|WordPressStyles/.test(h),
  kadenceMarkup: /kb-row-layout-wrap|wp-block-kadence-rowlayout|kt-accordion-pane/.test(h),
  smartSlider: /n2-ss-|smartslider/i.test(h),
};
console.log(checks);
writeFileSync(
  "tmp-parity/rest/corporate-events.verify.json",
  JSON.stringify({ len: h.length, checks }, null, 2),
);
