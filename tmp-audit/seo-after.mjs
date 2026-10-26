import * as cheerio from "cheerio";

const res = await fetch("http://127.0.0.1:3001/services/search-engine-optimization/");
const html = await res.text();
const $ = cheerio.load(html);
const main = $("main");
const lines = [];
main.find("h1,h2,h3,p,button,img").each((_, el) => {
  const tag = el.tagName;
  if (tag === "img") {
    const src = $(el).attr("src") || "";
    if (!src || src.startsWith("data:")) return;
    lines.push(`IMG ${$(el).attr("width") || "?"} ${src.slice(0, 140)}`);
    return;
  }
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (!text) return;
  lines.push(`${tag.toUpperCase()} ${text.slice(0, 180)}`);
});
console.log(lines.join("\n"));
