import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const rest = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const $ = cheerio.load(`<div id="service-root">${rest}</div>`);

$("#service-root")
  .children()
  .each((i, el) => {
    const $el = $(el);
    const tag = el.tagName;
    const cls = ($el.attr("class") || "").slice(0, 80);
    const iframe = $el.find("iframe").attr("src") || ($el.is("iframe") ? $el.attr("src") : "");
    const hs = $el
      .find("h1,h2,h3,h4,h6,.wp-block-kadence-advancedheading")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);
    console.log(`#${i} <${tag}> ${cls} | h=${hs || "-"} | iframe=${iframe ? iframe.slice(0, 60) : "-"}`);
  });

console.log("\nAll embeds:", $("figure.wp-block-embed, iframe[src*='vimeo']").length);
$("figure.wp-block-embed iframe, iframe[src*='vimeo']").each((_, el) => {
  console.log("  ", $(el).attr("src"));
  console.log("  parents:", $(el).parents().map((_, p) => p.tagName + "." + (($(p).attr("class") || "").split(/\s+/)[0] || "")).get().slice(0, 6).join(" > "));
});
