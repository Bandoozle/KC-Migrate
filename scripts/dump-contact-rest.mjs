import { readFileSync } from "node:fs";
import * as cheerio from "cheerio";

const html = readFileSync("tmp-parity/rest/contact.html", "utf8");
const $ = cheerio.load(`<div id="root">${html}</div>`);

function text(el) {
  const clone = $(el).clone();
  clone.find("br").replaceWith(" ");
  clone.find("style,script").remove();
  return clone.text().replace(/\s+/g, " ").trim();
}

$("#root")
  .children()
  .each((i, el) => {
    const $el = $(el);
    const tag = el.tagName;
    const cls = ($el.attr("class") || "").slice(0, 70);
    if (tag === "style") return;
    console.log(`\n#${i} <${tag}> ${cls}`);
    $el.find("h1,h2,h3,h4,h5,h6,.wp-block-kadence-advancedheading,p,a[href^='tel'],a[href^='mailto']").each((_, n) => {
      const t = text(n);
      if (!t || t.length > 160) return;
      const href = $(n).attr("href");
      console.log(`  ${n.tagName}${href ? `(${href})` : ""}: ${t}`);
    });
    const form = $el.find("form").attr("id");
    if (form) console.log("  FORM", form);
  });

// Look for maps/embeds
console.log("\niframes", $("iframe").length);
console.log("imgs", $("img").length);
$("img").each((_, img) => console.log(" img", $(img).attr("src")?.slice(0, 100), $(img).attr("alt")));
