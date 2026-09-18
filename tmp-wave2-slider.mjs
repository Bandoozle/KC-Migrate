import fs from "node:fs";
import * as cheerio from "cheerio";

for (const slug of ["marketing-programs", "marketing-results"]) {
  const p = JSON.parse(fs.readFileSync(`tmp-wave2/${slug}.json`, "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  const first = $("#r").children().first();
  console.log("\n====", slug, "first child ====");
  console.log("class", first.attr("class"));
  console.log("id", first.attr("id"));
  // visible text layers
  const texts = first.find(".n2-ss-layer *, .n2-ss-slide *").toArray()
    .map((el) => $(el).clone().children().remove().end().text().trim())
    .filter((t) => t.length > 1 && t.length < 120);
  console.log("texts", [...new Set(texts)].slice(0, 20));
  console.log("imgs", first.find("img").toArray().map((img) => ($(img).attr("src")||$(img).attr("data-desktop")||"").split("/").pop()).filter(Boolean));
  // data-desktop backgrounds
  first.find("[data-desktop], [style*=background]").toArray().slice(0, 10).forEach((el) => {
    console.log("bg el", $(el).attr("class")?.slice(0,40), $(el).attr("data-desktop")?.slice(0,80), $(el).attr("style")?.slice(0,80));
  });
  console.log(first.html()?.slice(0, 1500));
}
