import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import * as cheerio from "cheerio";

mkdirSync("tmp-parity/rest", { recursive: true });

const slugs = ["comfortmaker", "uncorked", "mexico-2026-welcome-itinerary"];
const origin = "https://staging.kosick.com";

function text($, el) {
  const clone = $(el).clone();
  clone.find("br").replaceWith(" ");
  clone.find("style,script").remove();
  return clone.text().replace(/\s+/g, " ").trim();
}

for (const slug of slugs) {
  const fullRes = await fetch(`${origin}/${slug}/`);
  const fullHtml = await fullRes.text();
  writeFileSync(`tmp-parity/${slug}.html`, fullHtml);

  const $full = cheerio.load(fullHtml);
  const rest = readFileSync(`tmp-parity/rest/${slug}.html`, "utf8");
  const $ = cheerio.load(`<div id="root">${rest}</div>`);

  console.log(`\n======== ${slug} ========`);
  console.log("full len", fullHtml.length);
  console.log("title tag", $full("title").first().text().replace(/\s+/g, " ").trim().slice(0, 100));
  console.log("has #masthead", $full("#masthead").length > 0);
  console.log("has #colophon", $full("#colophon").length > 0);
  console.log("transparent header", /transparent-header/i.test($full("body").attr("class") || ""));
  console.log("forms in full", $full("form").length);
  console.log("forms in rest", $("#root form").length);
  $full("form").each((i, f) => {
    const $f = $full(f);
    console.log(`  form#${i}`, $f.attr("id") || "", ($f.attr("class") || "").slice(0, 60));
    $f.find("input,select,textarea,button").each((_, el) => {
      const name = $full(el).attr("name") || "";
      const type = $full(el).attr("type") || el.tagName;
      if (!name && type !== "submit") return;
      console.log(`    [${type}] ${name} req=${$full(el).is("[required]")} ph="${($full(el).attr("placeholder")||"").slice(0,40)}"`);
    });
  });

  // top-level content children
  const kids = $("#root").children().toArray().filter((el) => el.tagName !== "style");
  console.log("top content nodes", kids.length);
  kids.forEach((el, i) => {
    const $el = $(el);
    const cls = ($el.attr("class") || "").slice(0, 70);
    const hs = $el
      .find("h1,h2,h3,h4,h5,h6,.wp-block-kadence-advancedheading")
      .toArray()
      .map((h) => text($, h))
      .filter(Boolean)
      .slice(0, 8);
    const imgs = $el.find("img").length;
    const slider = /n2-ss|smartslider/i.test(cls) || $el.find(".n2-ss-slider,.n2-ss-slide").length > 0;
    const gallery = $el.find(".kb-gallery,.wp-block-kadence-advancedgallery,.splide").length;
    const info = $el.find(".wp-block-kadence-infobox").length;
    const btns = $el
      .find("a.kb-button,a.kt-button")
      .toArray()
      .map((a) => text($, a))
      .filter(Boolean)
      .slice(0, 4);
    if (!cls.includes("kb-row") && !slider && hs.length === 0 && imgs === 0 && !/n2/.test(cls)) return;
    console.log(`\n#${i} ${cls.slice(0, 65)} | img=${imgs} gal=${gallery} info=${info} slider=${slider}`);
    if (hs.length) console.log("  H:", hs.join(" | "));
    if (btns.length) console.log("  CTA:", btns.join(", "));
  });

  // slider texts
  const sliderTexts = [];
  $(".n2-ss-layer").find("span,b,p,div,a,h1,h2,h3").each((_, el) => {
    const t = text($, el);
    if (t && t.length < 120) sliderTexts.push(t);
  });
  console.log("slider texts sample", [...new Set(sliderTexts)].slice(0, 12));

  // colors from style
  const styles = $("style").toArray().map((s) => $(s).html() || "").join("\n");
  const bgs = [...styles.matchAll(/background(?:-color)?:\s*([^;}+{]+)/gi)].map((m) => m[1].trim()).slice(0, 15);
  console.log("bg samples", [...new Set(bgs)].slice(0, 10));
}
