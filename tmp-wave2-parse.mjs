import fs from "node:fs";
import * as cheerio from "cheerio";

function extractSlides(html) {
  const $ = cheerio.load(html);
  const slides = [];
  // Smart Slider images
  $(".n2-ss-slide img, .n2-ss-slide-background-image img, .n2-ss-layer img").each((_, img) => {
    const src = $(img).attr("src") || $(img).attr("data-src");
    if (src && /uploads/.test(src)) slides.push({ src, alt: $(img).attr("alt") || "" });
  });
  // background images in slider CSS
  for (const m of html.matchAll(/#n2-ss-[^\{]*\{[^}]*background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)) {
    slides.push({ src: m[2], alt: "" });
  }
  for (const m of html.matchAll(/\.n2-ss-slide[^\{]*\{[^}]*background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)) {
    slides.push({ src: m[2], alt: "" });
  }
  // also general in n2 context
  const n2Start = html.indexOf("n2-ss-");
  if (n2Start >= 0) {
    const chunk = html.slice(n2Start, n2Start + 80000);
    for (const m of chunk.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)) {
      if (/uploads/.test(m[2])) slides.push({ src: m[2], alt: "" });
    }
  }
  const seen = new Set();
  return slides.filter((s) => {
    if (seen.has(s.src)) return false;
    seen.add(s.src);
    return true;
  });
}

for (const slug of ["marketing-results", "marketing-programs"]) {
  const p = JSON.parse(fs.readFileSync(`tmp-wave2/${slug}.json`, "utf8"));
  const live = fs.readFileSync(`tmp-wave2/${slug}-live.html`, "utf8");
  console.log("\n====", slug, "slides from content ====");
  console.log(extractSlides(p.content).map((s) => s.src.split("/").pop()));
  console.log("slides from live entry:");
  const $ = cheerio.load(live);
  const entry = $(".entry-content").html() || "";
  console.log(extractSlides(entry).map((s) => s.src.split("/").pop()));
}

// marketing-results industry cards
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/marketing-results.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  console.log("\n=== image overlays ===");
  $(".wp-block-kadence-imageoverlay, .kt-img-overlay").each((_, el) => {
    const $el = $(el);
    const img = $el.find("img").first();
    const title = $el.find(".kt-image-overlay-title, h2, h3, h4, .kt-blocks-overlay-title").text().trim()
      || $el.find("a").text().trim();
    console.log({
      title: title.slice(0, 80),
      href: $el.find("a").attr("href"),
      img: (img.attr("src") || "").split("/").pop(),
      alt: img.attr("alt")?.slice(0, 60),
    });
  });
}

// services intro row
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/services.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  const intro = $("#r").children(".kb-row-layout-wrap").eq(1);
  console.log("\n=== services intro ===");
  console.log("html text:", intro.text().replace(/\s+/g, " ").trim().slice(0, 500));
  console.log("paragraphs:", intro.find("p").toArray().map((p) => $(p).text().trim()));
}

// services all splits
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/services.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  $("#r").children(".kb-row-layout-wrap").slice(2).each((i, row) => {
    const $row = $(row);
    const cols = $row.find("> .kt-row-column-wrap > .wp-block-kadence-column").toArray();
    console.log(`\n--- service ${i} ---`);
    cols.forEach((col, ci) => {
      const $col = $(col);
      console.log(" col", ci, {
        h: $col.find(".wp-block-kadence-advancedheading, h2, h3").first().text().trim(),
        lis: $col.find("li").toArray().map((li) => $(li).text().trim()),
        img: ($col.find("img").attr("src") || "").split("/").pop(),
        bg: ($col.html() || "").match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/)?.[2]?.split("/").pop(),
        cta: $col.find("a").first().text().trim(),
      });
    });
  });
}

// programs splits
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/marketing-programs.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  $("#r").children(".kb-row-layout-wrap").slice(0, 4).each((i, row) => {
    const $row = $(row);
    const cols = $row.find("> .kt-row-column-wrap > .wp-block-kadence-column").toArray();
    console.log(`\n--- program ${i} ---`);
    cols.forEach((col, ci) => {
      const $col = $(col);
      const headings = $col.find(".wp-block-kadence-advancedheading, h2, h3, p.kt-adv-heading, [class*=kt-adv-heading]").toArray().map((h) => $(h).text().trim()).filter(Boolean);
      console.log(" col", ci, {
        headings: headings.slice(0, 4),
        img: ($col.find("img").attr("src") || "").split("/").pop(),
        bg: ($col.html() || "").match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/)?.[2]?.split("/").pop(),
        cta: { t: $col.find("a").first().text().trim(), h: $col.find("a").first().attr("href") },
      });
    });
  });
}
