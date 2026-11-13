import fs from "fs";

const html = fs.readFileSync("tmp-audit/billboard-page.html", "utf8");
const title = (html.match(/<title>([^<]+)/) || [])[1];
const robots = (html.match(/name="robots" content="([^"]+)/) || [])[1];
const checks = [
  "Typical size",
  "Superboards",
  "Horizontal Posters",
  "Transit Shelter",
  "Back to Outdoor",
  "10′ × 20′",
  "14′ × 48′",
  "47″ × 68″",
  "Outdoor Advertising",
  "View Billboard Sizes",
];
console.log({ title, robots, len: html.length });
for (const c of checks) console.log(`${c}: ${html.includes(c)}`);
console.log(
  "dims",
  [...html.matchAll(/Typical size[^<]{0,80}/g)].map((m) => m[0]),
);
