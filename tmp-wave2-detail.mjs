import fs from "node:fs";
import * as cheerio from "cheerio";

// services: detail first service split
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/services.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  const row = $("#r").children(".kb-row-layout-wrap").eq(2);
  console.log("=== services row2 HTML excerpt ===");
  console.log(row.html()?.slice(0, 2000));
  console.log("\nlist items:", row.find("li").toArray().map((li) => $(li).text().trim()));
  console.log("cta:", row.find("a").attr("href"), row.find("a").text().trim());
}

// marketing-results: find all industry blocks
{
  const p = JSON.parse(fs.readFileSync("tmp-wave2/marketing-results.json", "utf8"));
  const $ = cheerio.load(`<div id="r">${p.content}</div>`);
  console.log("\n=== marketing-results smartslider in content?", /smartslider|n2-ss/.test(p.content));
  // Find info boxes or cards
  console.log("info boxes", $(".kt-blocks-info-box-link-wrap, .wp-block-kadence-infobox, .kb-info-box").length);
  console.log("advanced gallery", $(".wp-block-kadence-advancedgallery, .kb-gallery").length);
  // all nested rows under first top row
  const top = $("#r").children(".kb-row-layout-wrap").first();
  const nested = top.find(".kb-row-layout-wrap").toArray();
  console.log("nested under intro:", nested.length);
  nested.forEach((row, i) => {
    const $row = $(row);
    console.log(i, {
      h: $row.find(".wp-block-kadence-advancedheading, h2, h3, h4").first().text().trim(),
      imgs: $row.find("img").toArray().map((img) => ($(img).attr("src")||"").split("/").pop()),
      href: $row.find("a[href]").first().attr("href"),
      text: $row.find("p").first().text().trim().slice(0, 100),
    });
  });

  // Also check for tabs / columns of industries
  console.log("\nall industry-like headings:");
  $("h2,h3,h4,.wp-block-kadence-advancedheading").toArray().forEach((h) => {
    const t = $(h).text().trim();
    if (t && t.length < 60) console.log(" -", t);
  });
}

// live HTML for marketing-results slider
{
  const live = fs.readFileSync("tmp-wave2/marketing-results-live.html", "utf8");
  console.log("\n=== live results slider?", /n2-ss|smartslider/.test(live));
  const $ = cheerio.load(live);
  console.log("n2 slides", $(".n2-ss-slide, .n2-ss-layer").length);
  const entry = $(".entry-content").html() || "";
  console.log("entry has slider", /n2-ss|smartslider/.test(entry));
  // sample industry card markup from live
  const firstIndustry = $(".kb-row-layout-id1698_5d1d80-a7").html()?.slice(0, 1500);
  console.log("\nindustry card sample:", firstIndustry?.slice(0, 1200));
}

{
  const live = fs.readFileSync("tmp-wave2/marketing-programs-live.html", "utf8");
  console.log("\n=== programs live slider?", /n2-ss|smartslider/.test(live));
  const p = JSON.parse(fs.readFileSync("tmp-wave2/marketing-programs.json", "utf8"));
  console.log("programs content slider marker", /n2-ss|smartslider/.test(p.content));
  // Why did first script say slider true?
  const idx = p.content.indexOf("smartslider");
  const idx2 = p.content.indexOf("n2-ss");
  console.log("smartslider idx", idx, "n2-ss idx", idx2);
  if (idx2 >= 0) console.log(p.content.slice(idx2, idx2 + 200));
}
