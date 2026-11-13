import fs from "fs";

const j = JSON.parse(fs.readFileSync("src/content/pages/radio-advertising.json", "utf8"));
const html = j.content.rendered;
const urls = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpe?g|png|webp)/gi)].map((m) => m[0]);
console.log([...new Set(urls)].join("\n"));
const local = [...html.matchAll(/\/wp-content\/uploads\/[^"'\\\s>]+\.(?:jpe?g|png|webp)/gi)].map((m) => m[0]);
console.log("---local---");
console.log([...new Set(local)].join("\n"));
