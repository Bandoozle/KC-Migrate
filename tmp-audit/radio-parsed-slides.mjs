import { parseServicePage } from "../src/lib/wordpress/service-page-parse.ts";
import fs from "fs";

const j = JSON.parse(fs.readFileSync("src/content/pages/radio-advertising.json", "utf8"));
// Try dynamic import of parse - might need compiled
console.log("title", j.title?.rendered);
const html = j.content.rendered;
// Extract like extractSmartSliderSlides - find data-desktop / background images in slides
const slides = [...html.matchAll(/class="n2-ss-slide[^"]*"[^>]*>[\s\S]*?(?=<div[^>]*class="n2-ss-slide|$)/g)];
console.log("raw slide chunks", slides.length);

// Look for image URLs inside each n2-ss-slide
const slideBlocks = html.split(/class="n2-ss-slide /).slice(1);
slideBlocks.forEach((block, i) => {
  const urls = [...block.matchAll(/\/wp-content\/uploads\/[^"'\\\s)]+/g)].map((m) => m[0]);
  const name = block.match(/n2-ss-slide--focus[^>]*>[\s\S]*?<\/div>/)?.[0]?.replace(/<[^>]+>/g, "").trim();
  console.log(i, name, [...new Set(urls)].slice(0, 8));
});
