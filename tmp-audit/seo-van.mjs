import * as cheerio from "cheerio";
import { readFileSync } from "node:fs";
const $ = cheerio.load(readFileSync("tmp-audit/seo-source.html", "utf8"));
const h = $("h2,h3").toArray().find((el) => /Vancouver SEO/i.test($(el).text()));
const row = $(h).closest(".kb-row-layout-wrap");
row.find("p").each((i, p) => {
  console.log("\nP", i, "html", $(p).html()?.slice(0, 400));
});
