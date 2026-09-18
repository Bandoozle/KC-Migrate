import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const html = readFileSync("tmp-parity/rest/contact.html", "utf8");
const $ = cheerio.load(`<div id="root">${html}</div>`);
const row = $(".kb-row-layout-id15_e29057-d1");
console.log("columns", row.find(".kt-has-2-columns, .kt-has-1-columns, .kt-has-3-columns").attr("class"));
row.find(".wp-block-kadence-column").each((i, col) => {
  if ($(col).find(".wp-block-kadence-column").length) return;
  const texts = $(col)
    .find("h1,h2,h3,h4,p,img")
    .toArray()
    .map((el) => {
      if (el.tagName === "img") return `IMG:${$(el).attr("src")}`;
      return $(el).text().replace(/\s+/g, " ").trim().slice(0, 80);
    })
    .filter(Boolean);
  console.log(`leaf col ${i}:`, texts);
});

// Background?
const styles = $("style").toArray().map((s) => $(s).html() || "").join("\n");
const m = styles.match(/kb-row-layout-id15_e29057-d1[^{]*\{[^}]+\}/);
console.log("row style snippet", m?.[0]?.slice(0, 300));
const m2 = styles.match(/kb-row-layout-id15_94dc2f-0d[^{]*\{[^}]+\}/);
console.log("form row style", m2?.[0]?.slice(0, 300));
