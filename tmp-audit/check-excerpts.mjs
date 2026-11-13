import { execSync } from "node:child_process";
import * as cheerio from "cheerio";

const html = execSync("curl.exe -sL http://localhost:3000/feature-articles/", { maxBuffer: 20e6 }).toString();
const $ = cheerio.load(html);
const cards = [];
$("[class*='excerpt']").each((_, el) => {
  const t = $(el).text().replace(/\s+/g, " ").trim();
  const title = $(el)
    .closest("article, a, li, div")
    .find("h2, h3, [class*='card-title']")
    .first()
    .text()
    .replace(/\s+/g, " ")
    .trim();
  if (t) cards.push({ title: title.slice(0, 90), excerpt: t.slice(0, 180) });
});
console.log("excerpt count", cards.length);
const suspects = cards.filter((c) =>
  /Ad Safe Zones|Pre-Roll Advertising|Tailored Strategies|Strategic Breakdown|Programs & Global|What a Marketing Agency Can Do for Your Business\?/.test(
    c.excerpt,
  ),
);
console.log("suspects", JSON.stringify(suspects, null, 2));
console.log("sample", JSON.stringify(cards.slice(0, 5), null, 2));
