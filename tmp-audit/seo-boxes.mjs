import * as cheerio from "cheerio";
import { readFileSync } from "node:fs";

const html = readFileSync("tmp-audit/seo-source.html", "utf8");
const $ = cheerio.load(html);

console.log("--- INFO BOXES ---");
$(".wp-block-kadence-infobox").each((_, el) => {
  const title = $(el).find(".kt-blocks-info-box-title").first().text().replace(/\s+/g, " ").trim();
  const body = $(el).find(".kt-blocks-info-box-text").first().text().replace(/\s+/g, " ").trim();
  if (title) console.log(`• ${title}\n  ${body}`);
});

console.log("\n--- HEADINGS ---");
$("h1,h2,h3,h4,.kt-blocks-info-box-title").each((_, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (text) console.log(el.tagName || el.name, text.slice(0, 160));
});

console.log("\n--- IMAGES ---");
$("img").each((_, el) => {
  const src = $(el).attr("src") || $(el).attr("data-src") || "";
  if (!src || src.startsWith("data:")) return;
  console.log(`${$(el).attr("width") || "?"}x${$(el).attr("height") || "?"} ${$(el).attr("alt") || ""} ${src}`);
});

console.log("\n--- LINKS ---");
$("a").each((_, el) => {
  const text = $(el).text().replace(/\s+/g, " ").trim();
  const href = $(el).attr("href") || "";
  if (text && href) console.log(`${text.slice(0, 80)} -> ${href}`);
});
