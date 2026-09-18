import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const full = readFileSync("tmp-parity/contact.html", "utf8");
const $ = cheerio.load(full);

// Prefer entry-content only
const $entry = $(".entry-content").first().length
  ? $(".entry-content").first()
  : $("main, #inner-wrap, body");

const rows = $entry
  .find(".kb-row-layout-wrap")
  .toArray()
  .filter((el) => $(el).parents(".kb-row-layout-wrap").length === 0);

console.log("top rows", rows.length);
rows.forEach((row, i) => {
  const $row = $(row);
  const cls = ($row.attr("class") || "").split(/\s+/).slice(0, 3).join(" ");
  const hs = $row
    .find("h1,h2,h3,h4,h5,h6,.wp-block-kadence-advancedheading")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 10);
  const form = $row.find("form.kb-advanced-form").attr("id") || "";
  const paras = $row
    .find("p")
    .toArray()
    .map((p) => $(p).text().replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 20)
    .slice(0, 3);
  console.log(`\n#${i} ${cls}`);
  if (hs.length) console.log("  H:", hs.join(" | "));
  if (paras.length) console.log("  P:", paras.map((p) => p.slice(0, 100)).join(" || "));
  if (form) console.log("  FORM:", form);
});

// Title from document
console.log("\n<title>", $("title").text());
console.log("h1", $("h1").first().text().replace(/\s+/g, " ").trim());

// Fetch REST
const origin = process.env.WORDPRESS_URL || "https://staging.kosick.com";
const res = await fetch(`${origin}/wp-json/wp/v2/pages?slug=contact&_fields=id,title,excerpt,content,link`);
const pages = await res.json();
if (pages[0]) {
  writeFileSync("tmp-parity/rest/contact.html", pages[0].content.rendered);
  writeFileSync(
    "tmp-parity/rest/contact.meta.json",
    JSON.stringify(
      {
        id: pages[0].id,
        title: pages[0].title.rendered,
        excerpt: pages[0].excerpt?.rendered || "",
        link: pages[0].link,
      },
      null,
      2,
    ),
  );
  console.log("REST title", pages[0].title.rendered);
  console.log("REST excerpt", (pages[0].excerpt?.rendered || "").replace(/<[^>]+>/g, "").trim().slice(0, 200));
  console.log("REST content len", pages[0].content.rendered.length);
}
