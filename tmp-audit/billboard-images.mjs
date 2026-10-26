import * as cheerio from "cheerio";

const rest = await fetch(
  "https://staging.kosick.com/wp-json/wp/v2/pages?slug=billboard-dimensions&_fields=content",
).then((r) => r.json());
const html = rest[0].content.rendered;
const $ = cheerio.load(html);
const rows = $(".kb-row-layout-wrap").toArray().filter((row) => $(row).parents(".kb-row-layout-wrap").length === 0);
rows.forEach((row, index) => {
  const headings = $(row).find("h1,h2,h3,h4,.wp-block-kadence-advancedheading").toArray().map((el) => $(el).text().replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, 4);
  const imgs = $(row).find("img").toArray().map((img) => $(img).attr("src"));
  const bgs = ($(row).html() || "").match(/uploads\/[^)'" ]+/g) || [];
  if (!headings.length && !imgs.length) return;
  console.log(index, headings.join(" | "));
  console.log("  img", [...new Set(imgs)].join("\n  img "));
  console.log("  bg", [...new Set(bgs)].slice(0, 4).join("\n  bg "));
});
