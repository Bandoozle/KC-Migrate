import sharp from "sharp";
import fs from "node:fs";

const url =
  "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
  encodeURIComponent("File:Arc'teryx logo (2026-02-27).jpg") +
  "&prop=imageinfo&iiprop=url&format=json&origin=*";
const api = await fetch(url, {
  headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
});
const json = await api.json();
const src = Object.values(json.query.pages)[0]?.imageinfo?.[0]?.url;
console.log(src);
const res = await fetch(src, {
  headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
});
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync("tmp-audit/arcteryx-wiki-raw-1.jpg", buf);
console.log(await sharp(buf).metadata());
