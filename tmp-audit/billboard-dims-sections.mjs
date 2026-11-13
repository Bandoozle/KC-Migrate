import fs from "fs";
import { load } from "cheerio";

const j = JSON.parse(fs.readFileSync("src/content/pages/billboard-dimensions.json", "utf8"));
const html = j.content.rendered;
const $ = load(html);

const imgs = $("img")
  .map((_, el) => ({
    src: $(el).attr("src") || $(el).attr("data-src") || "",
    alt: $(el).attr("alt") || "",
  }))
  .get()
  .filter((i) => i.src);
console.log("images:");
for (const img of imgs) console.log("-", img.src, "|", img.alt);

const headings = $("h2, h3")
  .map((_, el) => $(el).text().trim())
  .get()
  .filter(Boolean);
console.log("\nheadings:");
for (const h of headings) console.log("-", h);
