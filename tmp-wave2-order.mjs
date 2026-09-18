import fs from "node:fs";
import * as cheerio from "cheerio";

const p = JSON.parse(fs.readFileSync("tmp-wave2/marketing-programs.json", "utf8"));
const $ = cheerio.load(`<div id="r">${p.content}</div>`);
const kids = $("#r").children().toArray();
console.log("top children:", kids.map((el) => ({
  tag: el.tagName,
  cls: (($(el).attr("class") || "").match(/kb-row-layout-id\S+|n2-section|smartslider|wp-block\S+/) || [])[0],
  text: $(el).text().replace(/\s+/g, " ").trim().slice(0, 50),
})));

// results page top children
const r = JSON.parse(fs.readFileSync("tmp-wave2/marketing-results.json", "utf8"));
const $r = cheerio.load(`<div id="r">${r.content}</div>`);
console.log("\nresults top children:", $r("#r").children().toArray().map((el) => ({
  tag: el.tagName,
  cls: (($r(el).attr("class") || "").match(/kb-row-layout-id\S+|n2-section|smartslider|wp-block\S+/) || [])[0],
  text: $r(el).text().replace(/\s+/g, " ").trim().slice(0, 60),
})));

// services hero
const s = JSON.parse(fs.readFileSync("tmp-wave2/services.json", "utf8"));
const $s = cheerio.load(`<div id="r">${s.content}</div>`);
const hero = $s("#r").children(".kb-row-layout-wrap").eq(0);
console.log("\nservices hero:", {
  title: hero.find(".wp-block-kadence-advancedheading, h1, h2").text().trim(),
  bg: (hero.html() || "").match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/)?.[2],
  style: hero.attr("style"),
});
console.log("hero class", hero.attr("class"));
