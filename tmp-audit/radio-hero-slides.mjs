import fs from "fs";
import { load } from "cheerio";

const j = JSON.parse(fs.readFileSync("src/content/pages/radio-advertising.json", "utf8"));
const html = j.content.rendered;
const $ = load(html);

// Smart Slider slides often use background-image on slide layers
const bg = [...html.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]);
console.log("bg urls", [...new Set(bg)]);

const imgs = $("img")
  .map((_, el) => $(el).attr("src") || $(el).attr("data-src") || "")
  .get()
  .filter(Boolean);
console.log("imgs", [...new Set(imgs)].slice(0, 20));

// n2-ss slide structure
const slides = $(".n2-ss-slide, .n2-ss-layer-row, [data-slide]");
console.log("slide-ish count", slides.length);
$(".n2-ss-slide").each((i, el) => {
  const style = $(el).attr("style") || "";
  const htmlSlice = $(el).html()?.slice(0, 200);
  console.log("---slide", i, style.slice(0, 120));
  console.log(htmlSlice);
});
