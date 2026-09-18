import fs from "node:fs";
import * as cheerio from "cheerio";

for (const slug of ["services", "marketing-results", "marketing-programs"]) {
  const p = JSON.parse(fs.readFileSync(`tmp-wave2/${slug}.json`, "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  const rows = $("#r").children(".kb-row-layout-wrap").toArray();
  console.log("\n\n########", slug, "top-level rows", rows.length);
  rows.forEach((row, i) => {
    const $row = $(row);
    const cls = ($row.attr("class") || "").match(/kb-row-layout-id[^\s]+/)?.[0] || "";
    const headings = $row
      .find(".wp-block-kadence-advancedheading, h1, h2, h3, h4")
      .toArray()
      .map((h) => $(h).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 8);
    const imgs = $row.find("img").toArray().map((img) => ($(img).attr("src") || "").split("/").pop());
    const cols = $row.find(".kt-has-2-columns, .kt-has-3-columns, .kt-has-4-columns, .kt-has-6-columns").attr("class");
    const hasSlider = $row.find(".n2-ss-slider, [class*='smartslider']").length > 0 || /n2-ss|smartslider/.test($row.html() || "");
    const bg = ($row.attr("style") || "") + ($row.html() || "").match(/background-image:[^;]+/)?.[0];
    console.log(`\n[${i}] ${cls}`);
    console.log("  cols:", cols?.match(/kt-has-\d+-columns/)?.[0]);
    console.log("  slider:", hasSlider);
    console.log("  headings:", headings);
    console.log("  imgs:", imgs.slice(0, 6));
    console.log("  bg snippet:", String(bg || "").slice(0, 120));
  });

  // nested rows for marketing-results
  if (slug === "marketing-results") {
    console.log("\n nested structure:");
    $("#r .kb-row-layout-wrap").toArray().forEach((row, i) => {
      const $row = $(row);
      const cls = ($row.attr("class") || "").match(/kb-row-layout-id[^\s]+/)?.[0];
      const h = $row.find("> .kt-row-column-wrap .wp-block-kadence-advancedheading, > .kt-row-column-wrap h2, > .kt-row-column-wrap h3").first().text().trim();
      console.log(i, cls, "directH:", h.slice(0, 60), "imgs", $row.find("img").length);
    });
  }
}
