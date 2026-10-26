import { readFileSync } from "node:fs";
const html = readFileSync("tmp-audit/seo-source.html", "utf8");
const urls = [...html.matchAll(/https?:\/\/[^"'\s>]+\.(?:webp|jpe?g|png|avif)/gi)].map((m) => m[0]);
const unique = [...new Set(urls)];
console.log(unique.join("\n"));
