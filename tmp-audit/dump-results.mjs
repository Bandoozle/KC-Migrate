import { writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const origin = "https://staging.kosick.com";
const res = await fetch(
  `${origin}/wp-json/wp/v2/pages?slug=marketing-results&_fields=title,excerpt,content,link`,
);
const pages = await res.json();
const page = pages[0];
const html = page.content.rendered;
const $ = cheerio.load(`<div id="root">${html}</div>`);

const overlays = [];
$(".wp-block-kadence-imageoverlay").each((_, el) => {
  const $el = $(el);
  const img = $el.find("img").first();
  overlays.push({
    title: $el.find(".image-overlay-title, h2, h3, h4").first().text().replace(/\s+/g, " ").trim(),
    href: $el.find("a[href]").first().attr("href") || null,
    alt: img.attr("alt") || "",
    src: img.attr("src") || img.attr("data-src") || "",
  });
});

const headings = $("h1,h2,h3,h4,.wp-block-kadence-advancedheading")
  .toArray()
  .map((el) => $(el).text().replace(/\s+/g, " ").trim())
  .filter(Boolean);

const paragraphs = $("p")
  .toArray()
  .map((el) => $(el).text().replace(/\s+/g, " ").trim())
  .filter((t) => t.length > 40);

writeFileSync(
  "tmp-audit/marketing-results-dump.json",
  JSON.stringify(
    {
      title: page.title.rendered,
      excerpt: page.excerpt.rendered,
      overlayCount: overlays.length,
      overlays,
      headings,
      paragraphs,
    },
    null,
    2,
  ),
);
console.log("overlays", overlays.length, "headings", headings.length, "paragraphs", paragraphs.length);
