import fs from "node:fs";
const s = fs.readFileSync("src/content/pages/digital-connected-tv.json", "utf8");
const idx = s.indexOf("digital-streaming");
console.log("idx", idx);
console.log(s.slice(Math.max(0, idx - 100), idx + 160));
const uploads = [...s.matchAll(/wp-content\\\/uploads\\\/[^"\\]+/g)].map((m) =>
  m[0].replace(/\\\//g, "/"),
);
console.log("uploads sample", [...new Set(uploads)].slice(0, 40));
const bg = [...s.matchAll(/background-image:\\s*url\(([^)]+)\)/g)].map((m) => m[1]);
console.log("bgs", bg.slice(0, 20));
