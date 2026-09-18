import { readFileSync, writeFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-dm-rest.json", "utf8"))[0];
const html = page.content.rendered;
const $ = load(`<div id="root">${html}</div>`);

function text($el) {
  return $el
    .text()
    .replace(/\s+/g, " ")
    .trim();
}

function abs(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://staging.kosick.com${url}`;
  return url;
}

const root = $("#root");

// Strip smart slider for now — note as hero
const slider = root.find(".n2-section-smartslider, ss3-force-full-width").first();
const hasSlider = slider.length > 0;
slider.remove();

const sections = [];

// Walk top-level kb-row-layout-wrap
root.find("> .kb-row-layout-wrap, > .n2_clear + .kb-row-layout-wrap").each((_, el) => {
  // noop - cheerio structure may nest
});

const topRows = root.children(".kb-row-layout-wrap").toArray();
if (topRows.length === 0) {
  // after slider removal, remaining children
  console.log(
    "children:",
    root
      .children()
      .toArray()
      .map((n) => n.name + "." + (($(n).attr("class") || "").split(/\s+/).slice(0, 2).join("."))),
  );
}

root.children().each((i, el) => {
  const $el = $(el);
  const cls = $el.attr("class") || "";
  if (!cls.includes("kb-row-layout")) {
    console.log("skip child", el.name, cls.slice(0, 60));
    return;
  }

  const headings = $el
    .find(".wp-block-kadence-advancedheading, .wp-block-heading, h1, h2, h3")
    .toArray()
    .map((h) => text($(h)))
    .filter(Boolean)
    .slice(0, 8);

  const paragraphs = $el
    .find("p")
    .toArray()
    .map((p) => text($(p)))
    .filter((t) => t.length > 20)
    .slice(0, 6);

  const images = $el
    .find("img")
    .toArray()
    .map((img) => ({
      src: abs($(img).attr("src")),
      alt: $(img).attr("alt") || "",
    }));

  const faqs = $el
    .find(".kt-blocks-accordion-title")
    .toArray()
    .map((t) => text($(t)));

  const links = $el
    .find("a[href]")
    .toArray()
    .map((a) => ({ href: abs($(a).attr("href")), text: text($(a)) }))
    .filter((l) => l.text && l.href)
    .slice(0, 10);

  sections.push({
    index: i,
    rowClass: cls.match(/kb-row-layout-id[\w_-]+/)?.[0] || null,
    headings,
    paragraphs,
    imageCount: images.length,
    images: images.slice(0, 6),
    faqs,
    links: links.slice(0, 8),
    hasMediaText: $el.find(".wp-block-media-text").length > 0,
    hasAccordion: faqs.length > 0,
  });
});

const out = { title: text($("<div>").html(page.title.rendered)), hasSlider, sections };
writeFileSync("scripts/tmp-dm-sections.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
