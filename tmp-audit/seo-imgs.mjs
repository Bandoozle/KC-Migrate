import fs from "fs";

const html = fs.readFileSync("tmp-audit/seo-source.html", "utf8");
const srcs = [...html.matchAll(/(?:src|data-desktop|data-src)="(https?:[^"]+\.(?:jpe?g|png|webp)[^"]*)"/gi)].map(
  (m) => m[1].replace(/&amp;/g, "&"),
);
const unique = [...new Set(srcs.map((src) => src.split("?")[0]))];
for (const src of unique) console.log(src);
