import { writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const origin = "https://staging.kosick.com";

async function dump(slug) {
  const res = await fetch(
    `${origin}/wp-json/wp/v2/pages?slug=${slug}&_fields=title,content`,
  );
  const pages = await res.json();
  const html = pages[0]?.content?.rendered || "";
  const $ = cheerio.load(`<div id="root">${html}</div>`);
  const images = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = ($(el).attr("alt") || "").replace(/\s+/g, " ").trim();
    if (!src || /logo|icon|svg/i.test(src)) return;
    images.push({ alt, src: src.split("/").pop() });
  });
  const headings = $("h2,h3,.wp-block-kadence-advancedheading")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim())
    .filter((t) => t && t.length < 80);
  return { slug, headings: [...new Set(headings)].slice(0, 40), imageCount: images.length, images: images.slice(0, 40) };
}

const slugs = ["creative", "corporate-branding", "marketing-results"];
const out = [];
for (const slug of slugs) out.push(await dump(slug));
writeFileSync("tmp-audit/portfolio-sources.json", JSON.stringify(out, null, 2));
console.log(out.map((item) => `${item.slug} headings=${item.headings.length} images=${item.imageCount}`).join("\n"));
