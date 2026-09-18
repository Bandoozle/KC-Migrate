import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

// Use ts via dynamic import of built path won't work — call cheerio parse via node after compiling.
// Instead, re-run a lightweight inventory from saved REST HTML using the same heuristics as audit.

const html = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const meta = JSON.parse(readFileSync("tmp-parity/rest/corporate-events.meta.json", "utf8"));

console.log("title:", meta.title);
console.log("excerpt length:", (meta.excerpt || "").length);
console.log("html length:", html.length);
console.log("has smart slider:", /n2-ss|smartslider/i.test(html));
console.log("media-text:", (html.match(/wp-block-media-text/g) || []).length);
console.log("infobox:", (html.match(/wp-block-kadence-infobox/g) || []).length);
console.log("accordion:", (html.match(/kt-accordion/g) || []).length);
console.log("countup:", (html.match(/kb-count-up|kadence-countup/g) || []).length);
console.log("iframe:", (html.match(/<iframe/g) || []).length);
console.log("rows:", (html.match(/wp-block-kadence-rowlayout/g) || []).length);
