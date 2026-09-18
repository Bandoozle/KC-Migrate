import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-marketing-results-rest.json", "utf8"));
const html = page.content.rendered;
const $ = load(`<div id="root">${html}</div>`);

const sels = [
  ".n2-ss-slide img",
  ".n2-ss-layer img",
  ".n2-ss-slide-background-image img",
  "img[src*='uploads']",
  ".n2-ss-slide-background",
  "[data-desktop]",
  "[style*='background-image']",
];
for (const s of sels) console.log(s, $(s).length);

$(".n2-ss-slide-background-image img, .n2-ss-slide img, .n2-ss-layer img").each((i, img) => {
  if (i < 8) {
    console.log("src", $(img).attr("src") || $(img).attr("data-src") || $(img).attr("data-desktop"));
  }
});

const m = html.match(/\/\/staging\.kosick\.com\/wp-content\/uploads\/[^"'\\\s]+/g) || [];
console.log("proto-relative", [...new Set(m)].slice(0, 10));

// background-image urls in style attrs / css
const bg = html.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi) || [];
console.log("bg count", bg.length, bg.slice(0, 5));

// slider text nodes
$(".n2-ss-layer *").each((i, el) => {
  if (i > 40) return;
  const t = $(el).clone().children().remove().end().text().replace(/\s+/g, " ").trim();
  if (t) console.log("layer text", el.tagName, t.slice(0, 80));
});
