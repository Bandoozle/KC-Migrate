import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-services-rest.json", "utf8"));
const html = page.content.rendered;
const $ = load(`<div id="root">${html}</div>`);
const hero = $("#root").children(".kb-row-layout-wrap").first();
console.log("hero class", hero.attr("class"));
console.log("hero html slice", $.html(hero).slice(0, 800));
const styleMatch = html.match(/4554_dcbbd1-c3\{[^}]+\}/);
console.log("style block", styleMatch?.[0]?.slice(0, 400));
const bg = html.match(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi);
console.log("bgs", bg?.slice(0, 5));
