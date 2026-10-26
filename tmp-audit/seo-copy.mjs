import * as cheerio from "cheerio";
import { readFileSync } from "node:fs";

const $ = cheerio.load(readFileSync("tmp-audit/seo-source.html", "utf8"));
$("h1,h2,h3,p").each((_, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (!text) return;
  console.log(`\n[${el.tagName}] ${text}`);
});
