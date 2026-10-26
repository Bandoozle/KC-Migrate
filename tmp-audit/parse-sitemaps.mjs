import fs from "node:fs";

const files = ["page-sitemap.xml", "post-sitemap.xml", "local-sitemap.xml"];
const urls = [];
for (const file of files) {
  const xml = fs.readFileSync(new URL(`./${file}`, import.meta.url), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(file, locs.length);
  for (const loc of locs) urls.push({ file, loc });
}
fs.writeFileSync(new URL("./wp-urls.json", import.meta.url), JSON.stringify(urls, null, 2));
console.log("total", urls.length);
