import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-email-rest.json", "utf8"))[0];
const $ = load(`<div id="root">${page.content.rendered}</div>`);
const row = $(".kb-row-layout-id11772_0ca8cd-99");
console.log("--- offer info box html ---");
console.log($.html(row.find(".wp-block-kadence-infobox, .kt-blocks-info-box").first()).slice(0, 800));
const pkg = $(".kb-row-layout-id11772_bbd621-63");
console.log("--- package info box ---");
const box = pkg.find(".wp-block-kadence-infobox, .kt-blocks-info-box").first();
console.log($.html(box).slice(0, 1200));
console.log("text", box.text().replace(/\s+/g, " ").trim().slice(0, 300));

const related = $(".kb-row-layout-id11772_461021-6e");
console.log("--- related col ---");
console.log($.html(related.find(".wp-block-kadence-column").first()).slice(0, 600));

const social = JSON.parse(readFileSync("scripts/tmp-social-rest.json", "utf8"))[0];
const $s = load(`<div id="root">${social.content.rendered}</div>`);
const gal = $s(".kb-row-layout-id10744_d1c57e-52");
console.log("--- social gallery ---");
console.log($s.html(gal).slice(0, 1500));
