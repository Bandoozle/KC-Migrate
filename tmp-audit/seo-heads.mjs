import fs from "fs";

const html = fs.readFileSync("tmp-audit/seo-source.html", "utf8");
const heads = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
);
console.log("HEADS");
for (const head of heads) console.log("- " + head);
const titles = [...html.matchAll(/kt-blocks-info-box-title">([^<]+)/g)].map((m) => m[1].trim());
console.log("CARDS");
for (const title of titles) console.log("- " + title);
