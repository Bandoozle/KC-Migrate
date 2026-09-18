import { readFileSync, writeFileSync } from "node:fs";

const page = JSON.parse(readFileSync("scripts/tmp-dm-rest.json", "utf8"))[0];
const h = page.content.rendered;
const bg = [...h.matchAll(/background-image:\s*url\(([^)]+)\)/gi)]
  .map((m) => m[1].replace(/['"]/g, ""))
  .filter((u) => /uploads/.test(u));
console.log("slider/bg images:", [...new Set(bg)].join("\n"));

const i = h.indexOf("Ready to Elevate");
console.log(
  h
    .slice(i, i + 3000)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 900),
);

// related services icons?
const related = h.slice(h.indexOf("Google Ad Management") - 200, h.indexOf("Ready to Elevate"));
const relatedImgs = [...related.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
console.log("related imgs", relatedImgs.slice(0, 10));
