import * as cheerio from "cheerio";
const rest = await fetch(
  "https://staging.kosick.com/wp-json/wp/v2/pages?slug=billboard-dimensions&_fields=content",
).then((r) => r.json());
const $ = cheerio.load(rest[0].content.rendered);
const rows = $(".kb-row-layout-wrap").toArray().filter((row) => $(row).parents(".kb-row-layout-wrap").length === 0);
const row = rows[3];
const html = $(row).html() || "";
const idx = html.indexOf("uploads/");
console.log(html.slice(Math.max(0, idx - 80), idx + 160));
console.log("---matches", [...html.matchAll(/https?:\/\/[^"'()\s]+\/wp-content\/uploads\/[^"'()\s]+/g)].map((m) => m[0]));
