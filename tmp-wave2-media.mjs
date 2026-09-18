import fs from "node:fs";
import * as cheerio from "cheerio";
const p = JSON.parse(fs.readFileSync("tmp-wave2/services.json", "utf8"));
const html = p.content;
// find style for first row
const m = html.match(/kb-row-layout-id4554_dcbbd1-c3\{[^}]+\}/);
console.log(m?.[0]);
const m2 = html.match(/\.kb-row-layout-id4554_dcbbd1-c3[^<{]*\{[^}]+\}/g);
console.log(m2);
// all bg for services
console.log([...html.matchAll(/4554_dcbbd1-c3[\s\S]{0,400}background-image:\s*url\((['"]?)([^)'"]+)\1\)/)]);
const $ = cheerio.load(html);
// check intro title exact
console.log("intro h", $(".kb-row-layout-id4554_793e7e-7c .wp-block-kadence-advancedheading").text());
// service row media positions - which column has image
$("#r, body").length;
const $r = cheerio.load(`<div id="r">${html}</div>`);
$r("#r").children(".kb-row-layout-wrap").slice(2).each((i, row) => {
  const cols = $r(row).find("> .kt-row-column-wrap > .wp-block-kadence-column").toArray();
  const left = $r(cols[0]);
  const right = $r(cols[1]);
  const leftMedia = left.find("img").length > 0 || /background-image/.test(left.html()||"");
  const rightMedia = right.find("img").length > 0 || /background-image/.test(right.html()||"");
  // also check column style in preceding style tags - bg often on column class in style block
  const rowHtml = $r(row).html() || "";
  const bgs = [...rowHtml.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/g)].map(x => x[2]);
  console.log(i, { leftMedia, rightMedia, leftHasText: left.find("li,h2,h3,.wp-block-kadence-advancedheading").length, rightHasText: right.find("li,h2,h3,.wp-block-kadence-advancedheading").length, bgs: bgs.map(b=>b.split("/").pop()), imgs: $r(row).find("img").toArray().map(img => ($r(img).attr("src")||"").split("/").pop()) });
});
