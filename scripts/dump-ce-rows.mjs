import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const rest = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const $ = cheerio.load(`<div id="root">${rest}</div>`);
const rows = $("#root").children(".kb-row-layout-wrap").toArray();

function dump(i) {
  const row = rows[i];
  const clean = $.html(row)
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/\s+/g, " ");
  writeFileSync(`tmp-parity/rest/corporate-events-row${i}.html`, $.html(row).replace(/<style[\s\S]*?<\/style>/g, ""));
  console.log(`\n==== ROW ${i} ====`);
  console.log(clean.slice(0, 1400));
}

dump(0); // first feature after slider - index in kb rows
dump(3); // process
dump(6); // related
dump(4); // mid CTA

// slider texts
console.log("\nSLIDER TEXTS");
$(".n2-ss-layer")
  .find("span, b, p, div, a, h1, h2, h3")
  .each((_, el) => {
    const t = $(el).clone().children().remove().end().text().replace(/\s+/g, " ").trim();
    if (t && t.length < 120) console.log(" -", t);
  });

// related row structure
const rel = rows[6];
console.log("\nRELATED cols", $(rel).find(".kt-has-4-columns > .wp-block-kadence-column").length);
$(rel)
  .find(".kt-has-4-columns > .wp-block-kadence-column")
  .each((i, col) => {
    console.log(
      i,
      $(col).find("h2,h3,h4,.wp-block-kadence-advancedheading").first().text().trim(),
      $(col).find("a").attr("href"),
      /background-image/i.test($(col).html() || ""),
    );
  });
