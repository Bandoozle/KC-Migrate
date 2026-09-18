import { readFileSync } from "node:fs";

const h = readFileSync("tmp-parity/rest/corporate-events.native.html", "utf8");

function count(re) {
  return (h.match(re) || []).length;
}

console.log({
  bodyClass: (h.match(/<body[^>]*class="([^"]*)"/) || [])[1],
  wordPressInteractInScript: /WordPressInteract/.test(h),
  wordPressInteractComponent: /data-wordpress-interact|from "WordPressInteract"/.test(h),
  kbRowInBodyMarkup: /class="[^"]*kb-row-layout/.test(h),
  n2InBodyMarkup: /class="[^"]*n2-ss-/.test(h),
  smartSliderScript: /smartslider/i.test(h),
  entryContent: /entry-content/.test(h),
  corporateEventsPageView: /CorporateEventsPageView|Experience the Power of Corporate Events/.test(h),
  kosickNativePage: /kosick-native-page/.test(h),
  scriptChunkHits: {
    kb: count(/kb-row-layout/g),
    n2: count(/n2-ss-/g),
    interact: count(/WordPressInteract/g),
  },
});

// Find WordPressInteract context
const idx = h.indexOf("WordPressInteract");
if (idx >= 0) {
  console.log("context:", h.slice(Math.max(0, idx - 80), idx + 120).replace(/\s+/g, " "));
}
