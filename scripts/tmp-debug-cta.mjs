import { readFileSync } from "node:fs";
import { load } from "cheerio";

function dumpCta(slug) {
  const page = JSON.parse(readFileSync(`scripts/tmp-${slug}-rest.json`, "utf8"));
  const $ = load(`<div id="root">${page.content.rendered}</div>`);
  const id = slug === "marketing-results" ? "1698_514e77-49" : "2019_ad8c4e-8d";
  const row = $(`.kb-row-layout-id${id}`).first();
  console.log("====", slug);
  console.log("row len", row.length);
  console.log(
    "texts",
    row
      .find(".wp-block-kadence-advancedheading, h2, h3, p, a")
      .toArray()
      .map((el) => $(el).text().replace(/\s+/g, " ").trim().slice(0, 120))
      .filter(Boolean),
  );
}

dumpCta("marketing-results");
dumpCta("marketing-programs");
