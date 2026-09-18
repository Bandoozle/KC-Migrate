import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-social-rest.json", "utf8"))[0];
const html = page.content.rendered;
console.log("n2-ss-slide-background", (html.match(/n2-ss-slide-background/g) || []).length);
console.log("protocol uploads", [...new Set(html.match(/\/\/staging[^"'\\\s]+/g) || [])].slice(0, 15));
console.log("bg-image urls", [...html.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]).slice(0, 10));
const $ = load(html);
console.log("n2 imgs", $(".n2-ss-slide-background-image img").length);
console.log("first n2 html", $.html($(".n2-section-smartslider, .n2_clear").first()).slice(0, 500));
