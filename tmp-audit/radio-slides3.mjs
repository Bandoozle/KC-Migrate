import fs from "fs";
import { load } from "cheerio";

const html = JSON.parse(fs.readFileSync("src/content/pages/radio-advertising.json", "utf8")).content.rendered;
const $ = load(html);

$(".n2-ss-slide").each((i, el) => {
  const $el = $(el);
  const name = $el.find(".n2-ss-slide--focus").text().trim();
  const bgImg = $el.find(".n2-ss-slide-background-image img, .n2-ss-slide-background img");
  const allImgs = $el.find("img").map((_, img) => $(img).attr("src") || $(img).attr("data-src") || $(img).attr("data-desktop")).get();
  const style = $el.find("[style*='background'], .n2-ss-slide-background").map((_, n) => $(n).attr("style") || $(n).attr("class")).get();
  const dataAttrs = [];
  $el.find("*").each((_, n) => {
    const attribs = n.attribs || {};
    for (const [k, v] of Object.entries(attribs)) {
      if (/upload|image|desktop|tablet|mobile|background/i.test(k) || /uploads/i.test(String(v))) {
        dataAttrs.push(`${k}=${String(v).slice(0, 120)}`);
      }
    }
  });
  console.log("---", i, name);
  console.log("bgImgs", bgImg.map((_, img) => $(img).attr("src")).get());
  console.log("allImgs", allImgs.slice(0, 8));
  console.log("styles", style.slice(0, 5));
  console.log("data", [...new Set(dataAttrs)].slice(0, 15));
});

// Also search whole html for iStock / pexels filenames
const hits = [...html.matchAll(/iStock-1363132799[^"'\\\s)]*|pexels-dmitry[^"'\\\s)]*|radio-1\.webp|podcast\.webp/gi)];
console.log("filename hits", hits.map((h) => h[0]));
