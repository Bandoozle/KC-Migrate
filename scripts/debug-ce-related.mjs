import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const html = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const $ = cheerio.load(`<div id="service-root">${html}</div>`);

const related = $("#service-root .kb-row-layout-id10350_a5d112-09");
const rowHtml = related.html() || "";
console.log("bg in html", /background-image:\s*url\(/i.test(rowHtml));
console.log("matches", rowHtml.match(/background-image[^;{]*/gi));
console.log("has lists", related.find("ul li").length);

// Simulate isRelatedRow
const cols = related.find(".kt-has-4-columns > .wp-block-kadence-column");
console.log("cols", cols.length);
console.log("infobox/media", related.find(".wp-block-kadence-infobox, .wp-block-media-text").length);
console.log("imgs", related.find("img").length);

