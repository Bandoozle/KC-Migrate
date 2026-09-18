import { readFileSync, writeFileSync } from "node:fs";
import { load } from "cheerio";

function deep(slug, file) {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const page = Array.isArray(raw) ? raw[0] : raw;
  const html = page.content.rendered;
  const $ = load(`<div id="root">${html}</div>`);
  const rows = $("#root").children(".kb-row-layout-wrap").toArray();

  const detail = rows.map((row, idx) => {
    const $row = $(row);
    const cls = $row.attr("class") || "";
    const mediaText = $row.find(".wp-block-media-text").length;
    const cols4 = $row.find(".kt-has-4-columns > .wp-block-kadence-column").length;
    const cols3 = $row.find(".kt-has-3-columns > .wp-block-kadence-column").length;
    const cols2 = $row.find(".kt-has-2-columns > .wp-block-kadence-column").length;
    const infoBoxes = $row.find(".wp-block-kadence-infobox, .kt-blocks-info-box").length;
    const panes = $row.find(".wp-block-kadence-pane, .kt-accordion-pane").length;
    const headings = $row
      .find(".wp-block-kadence-advancedheading, h1, h2, h3, h4")
      .toArray()
      .map((h) => $(h).text().replace(/\s+/g, " ").trim())
      .filter(Boolean);
    const paras = $row
      .find("p")
      .toArray()
      .map((p) => $(p).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 3);
    const bullets = $row
      .find("ul > li")
      .toArray()
      .map((li) => $(li).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 12);
    const imgs = $row
      .find("img")
      .toArray()
      .map((img) => ({
        src: ($(img).attr("src") || "").slice(0, 90),
        alt: $(img).attr("alt") || "",
      }));
    const ctas = $row
      .find("a.kb-button, a.kt-button, a.button")
      .toArray()
      .map((a) => ({
        href: $(a).attr("href"),
        label: $(a).text().replace(/\s+/g, " ").trim(),
      }));

    // info box titles
    const infoBoxTitles = $row
      .find(".kt-blocks-info-box-title, .wp-block-kadence-infobox .kt-blocks-info-box-title, h4, .kt-info-box-title")
      .toArray()
      .map((el) => $(el).text().replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 12);

    return {
      idx,
      idMatch: (cls.match(/kb-row-layout-id([^\s]+)/) || [])[1],
      mediaText,
      cols4,
      cols3,
      cols2,
      infoBoxes,
      panes,
      headings,
      paras,
      bullets,
      imgs,
      ctas,
      infoBoxTitles,
    };
  });

  // hero slides
  const $all = load(html);
  const slides = [];
  $all(".n2-ss-slide-background-image img, .n2-ss-slide img").each((_, img) => {
    slides.push($all(img).attr("src") || $all(img).attr("data-src"));
  });

  return { slug, title: page.title.rendered, slides: [...new Set(slides)], detail };
}

const files = {
  "email-marketing": "scripts/tmp-email-rest.json",
  "social-media-marketing": "scripts/tmp-social-rest.json",
  "search-engine-optimization": "scripts/tmp-seo-rest.json",
};

const out = {};
for (const [slug, file] of Object.entries(files)) out[slug] = deep(slug, file);
writeFileSync("scripts/tmp-service3-deep.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
