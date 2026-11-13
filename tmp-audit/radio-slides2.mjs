import fs from "fs";
const html = JSON.parse(fs.readFileSync("src/content/pages/radio-advertising.json", "utf8")).content.rendered;
const blocks = html.split(/class="n2-ss-slide /).slice(1);
console.log("blocks", blocks.length);
blocks.forEach((block, i) => {
  const name = (block.match(/n2-ss-slide--focus[^>]*>[\s\S]*?<\/div>/) || [])[0]
    ?.replace(/<[^>]+>/g, "")
    .trim();
  const urls = [...new Set([...block.matchAll(/\/wp-content\/uploads\/[^"'\\\s)]+/g)].map((m) => m[0]))];
  const dataDesktop = [...block.matchAll(/data-desktop="([^"]+)"/g)].map((m) => m[1]);
  const dataSrc = [...block.matchAll(/data-src="([^"]+)"/g)].map((m) => m[1]);
  console.log("---", i, name);
  console.log("urls", urls.slice(0, 10));
  console.log("dataDesktop", dataDesktop.slice(0, 5));
  console.log("dataSrc", dataSrc.slice(0, 5));
});
