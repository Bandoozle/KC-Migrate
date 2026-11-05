import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("src/content/pages/marketing-results.json", "utf8"));
const $ = load(`<div id="root">${page.content.rendered}</div>`);
$(".wp-block-kadence-imageoverlay").each((_, el) => {
  const $el = $(el);
  const title = $el.find(".image-overlay-title, h2, h3, h4").first().text().replace(/\s+/g, " ").trim();
  const href = $el.find("a[href]").first().attr("href") || "(none)";
  const src = $el.find("img").first().attr("src") || "";
  console.log(JSON.stringify({ title, href, src: src.slice(-60) }));
});
