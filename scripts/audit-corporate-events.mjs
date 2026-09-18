import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const full = readFileSync("tmp-parity/corporate-events.html", "utf8");
const rest = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const $ = cheerio.load(`<div id="root">${rest}</div>`);

const flags = {
  smartSlider: /n2-ss-|smartslider/i.test(rest),
  smartSliderFull: /n2-ss-|smartslider/i.test(full),
  faq: /kt-accordion|faq/i.test(rest),
  tabs: /wp-block-tabs|core\/tabs|kt-tabs/i.test(rest),
  countup: /kb-count-up|countup/i.test(rest),
  video: /vimeo|youtube|wp-block-embed|iframe/i.test(rest),
  form: /kb-advanced-form|gform_|wpforms/i.test(rest),
  gallery: /kadence-advancedgallery|kb-gallery|splide/i.test(rest),
  infobox: $(".wp-block-kadence-infobox").length,
  mediaText: $(".wp-block-media-text").length,
  testimonial: /testimonial/i.test(rest),
};

console.log("FLAGS", flags);
console.log("slide imgs", $(".n2-ss-slide-background-image img, .n2-ss-slide img").length);
console.log(
  "slide srcs",
  $(".n2-ss-slide-background-image img, .n2-ss-slide img")
    .toArray()
    .map((el) => $(el).attr("src") || $(el).attr("data-src"))
    .slice(0, 8),
);

const rows = $("#root")
  .children()
  .toArray()
  .filter((el) => {
    const cls = $(el).attr("class") || "";
    const tag = el.tagName;
    return tag === "div" || tag === "section" || tag === "hr";
  });

console.log("\nTOP CHILDREN", rows.length);
rows.forEach((row, i) => {
  const $row = $(row);
  const cls = ($row.attr("class") || "").split(/\s+/).slice(0, 4).join(" ");
  if (!$row.is(".kb-row-layout-wrap") && !$row.is("hr") && !/n2_|smartslider|wp-block/i.test(cls)) {
    // skip pure style wrappers already filtered
  }
  if ($row.is("style")) return;

  const hs = $row
    .find("h1,h2,h3,h4,.wp-block-kadence-advancedheading")
    .toArray()
    .map((el) => $(el).clone().children("style").remove().end().text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 8);
  const info = $row.find(".wp-block-kadence-infobox").length;
  const imgs = $row.find("img").length;
  const iframes = $row.find("iframe").length;
  const mediaText = $row.find(".wp-block-media-text").length;
  const acc = $row.find(".kt-accordion-pane, .wp-block-kadence-pane").length;
  const count = $row.find(".kb-count-up, .wp-block-kadence-countup").length;
  const gallery = $row.find(".kb-gallery, .wp-block-kadence-advancedgallery, .splide").length;
  const btns = $row
    .find("a.kb-button, a.kt-button")
    .toArray()
    .map((a) => $(a).text().replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 4);
  const p = $row
    .find("p")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 40)
    .slice(0, 1);

  if (!cls.includes("kb-row") && !cls.includes("n2") && hs.length === 0 && imgs === 0 && !btns.length) {
    return;
  }

  console.log(
    `\n#${i} ${cls.slice(0, 70)} | info=${info} img=${imgs} iframe=${iframes} mt=${mediaText} acc=${acc} count=${count} gal=${gallery}`,
  );
  if (hs.length) console.log("  H:", hs.join(" | "));
  if (p[0]) console.log("  P:", p[0].slice(0, 120));
  if (btns.length) console.log("  CTA:", btns.join(", "));
});

// dependency signals from full HTML
console.log("\nFULL DEPS");
for (const s of [
  "kadence-footer-css",
  "kadence-header-css",
  "smartslider",
  "n2-ss-",
  "WordPressInteract",
  "kb-count-up",
  "splide",
]) {
  console.log(s, full.includes(s) || new RegExp(s, "i").test(full));
}
