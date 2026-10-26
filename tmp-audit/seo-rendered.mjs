import * as cheerio from "cheerio";

const res = await fetch("http://127.0.0.1:3001/services/search-engine-optimization/");
const html = await res.text();
const $ = cheerio.load(html);
const main = $("main");
const lines = [];
main.find("h1,h2,h3,p,li,img,a").each((_, el) => {
  const tag = el.tagName;
  if (tag === "img") {
    const src = $(el).attr("src") || "";
    if (!src || src.includes("data:")) return;
    lines.push(`IMG ${$(el).attr("alt") || ""} ${src.slice(0, 160)}`);
    return;
  }
  const text = $(el).text().replace(/\s+/g, " ").trim();
  if (!text) return;
  if (tag === "a") {
    lines.push(`A ${text.slice(0, 60)} -> ${$(el).attr("href")}`);
    return;
  }
  if (tag === "p" && $(el).parents("li").length) return;
  lines.push(`${tag.toUpperCase()} ${text.slice(0, 220)}`);
});
console.log(lines.join("\n"));
