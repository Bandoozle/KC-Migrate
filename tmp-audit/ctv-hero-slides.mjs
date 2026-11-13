import fs from "node:fs";
const s = fs.readFileSync("src/content/pages/digital-connected-tv.json", "utf8");
const imgs = [...s.matchAll(/src=\\?"(\/wp-content\/uploads\/[^"\\]+)\\?"/g)].map((m) => m[1]);
console.log([...new Set(imgs)].slice(0, 40));
