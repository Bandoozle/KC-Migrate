import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const rest = readFileSync("tmp-parity/rest/comfortmaker.html", "utf8");
const full = readFileSync("tmp-parity/comfortmaker.html", "utf8");
const $ = cheerio.load(`<div id="root">${rest}</div>`);
const $f = cheerio.load(full);

// Gravity form details
const form = $f("#gform_9");
console.log("form action", form.attr("action"));
console.log("form method", form.attr("method"));
console.log("ajax", form.attr("data-js-uri") || form.find("[data-js]").length);

// Field labels from rest content
console.log("\n--- REST headings/labels ---");
$("#root")
  .find("label, .gfield_label, legend, h1,h2,h3,h4,.wp-block-kadence-advancedheading,p")
  .each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t && t.length < 120 && t.length > 1) console.log(" ", el.tagName, t);
  });

// Extract gform field structure more carefully from full page
console.log("\n--- GF fields ---");
$f(".gfield").each((i, field) => {
  const $field = $f(field);
  const id = $field.attr("id") || "";
  const label = $field.find(".gfield_label").first().text().replace(/\s+/g, " ").trim();
  const required = $field.hasClass("gfield_contains_required") || $field.find(".gfield_required").length > 0;
  const inputs = $field
    .find("input, select, textarea")
    .toArray()
    .map((el) => ({
      name: $f(el).attr("name"),
      type: $f(el).attr("type") || el.tagName,
      placeholder: $f(el).attr("placeholder") || "",
    }))
    .filter((x) => x.name && !/^input_\d+\.\d+$/.test("") );
  const options = $field
    .find("select option")
    .toArray()
    .map((o) => $f(o).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 8);
  if (!label && inputs.length === 0) return;
  console.log(`#${i} ${id} req=${required} label="${label.slice(0, 80)}"`);
  inputs.slice(0, 6).forEach((inp) => console.log("   ", inp));
  if (options.length) console.log("   options:", options.join(" | "));
});

// Check if form is ajax
const scripts = full.match(/gform[^"']*|gravityforms[^"']*/gi)?.slice(0, 20);
console.log("\ngf script hits", scripts?.slice(0, 10));

// Uncorked structure detail
const $u = cheerio.load(`<div id="root">${readFileSync("tmp-parity/rest/uncorked.html", "utf8")}</div>`);
console.log("\n======== UNCORKed detail ========");
$u("#root .kb-row-layout-wrap").each((i, row) => {
  if ($u(row).parents(".kb-row-layout-wrap").length) return;
  const hs = $u(row)
    .find("h1,h2,h3,h4,.wp-block-kadence-advancedheading")
    .toArray()
    .map((h) => $u(h).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 6);
  const p = $u(row)
    .find("p")
    .toArray()
    .map((el) => $u(el).text().replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 30)
    .slice(0, 2);
  const imgs = $u(row)
    .find("img")
    .toArray()
    .map((img) => $u(img).attr("src"))
    .filter(Boolean)
    .slice(0, 4);
  console.log(`\nrow ${i}:`, hs.join(" || "));
  if (p[0]) console.log("  p:", p[0].slice(0, 140));
  if (imgs.length) console.log("  imgs:", imgs.map((s) => s.slice(-50)).join(", "));
});
