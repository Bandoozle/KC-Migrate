import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-email-rest.json", "utf8"))[0];
const $ = load(page.content.rendered);
const row = $(".kb-row-layout-id11772_461021-6e");
row.find(".wp-block-kadence-column").each((i, col) => {
  const $col = $(col);
  console.log(i, {
    title: $col.find("h4,h3,.wp-block-kadence-advancedheading").first().text().trim(),
    href: $col.find("a").first().attr("href"),
    lis: $col
      .find("li")
      .toArray()
      .map((li) => $(li).text().trim()),
    text: $col.text().replace(/\s+/g, " ").trim().slice(0, 250),
  });
});

const social = JSON.parse(readFileSync("scripts/tmp-social-rest.json", "utf8"))[0];
const $s = load(social.content.rendered);
const gal = $s(".kb-row-layout-id10744_d1c57e-52");
gal.find("figure, .wp-block-image, .kb-gallery-ul, .wp-block-kadence-image").each((i, el) => {
  console.log("gal item", i, $s(el).text().replace(/\s+/g, " ").trim().slice(0, 80), $s(el).find("img").attr("src")?.slice(0, 60));
});
console.log(
  "gallery captions",
  gal
    .find("figcaption, .kt-image-overlay-title, .image-overlay-title, h3, h4")
    .toArray()
    .map((el) => $s(el).text().trim()),
);
