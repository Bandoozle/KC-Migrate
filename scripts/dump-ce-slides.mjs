import { readFileSync } from "node:fs";

const html = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const metaRaw = readFileSync("tmp-parity/rest/corporate-events.meta.json", "utf8").replace(/^\uFEFF/, "");
const meta = JSON.parse(metaRaw);
const { normalizeServicePageHtml } = await import("../src/lib/wordpress/service-page-parse.ts");
const content = normalizeServicePageHtml(html, meta.title || "Corporate Events", meta.excerpt || "");
console.log(content.hero.slides);
