import { writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const url =
  "https://staging.kosick.com/wp-json/wp/v2/pages?slug=search-engine-optimization&status=publish";
const res = await fetch(url);
const pages = await res.json();
const html = pages[0]?.content?.rendered || "";
writeFileSync("tmp-audit/seo-source.html", html);
const $ = cheerio.load(html);

const lines = [];
$("h1,h2,h3,h4,p,li,img").each((_, el) => {
  const tag = el.tagName;
  if (tag === "img") {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    const w = $(el).attr("width") || "";
    const h = $(el).attr("height") || "";
    lines.push(`IMG ${w}x${h} | ${alt} | ${src}`);
    return;
  }
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (!text || text.length < 2) return;
  if (tag === "p" && $(el).parents("li").length) return;
  lines.push(`${tag.toUpperCase()} ${text.slice(0, 320)}`);
});
console.log(lines.join("\n"));
