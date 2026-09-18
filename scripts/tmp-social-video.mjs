import { readFileSync } from "node:fs";
import { load } from "cheerio";

const page = JSON.parse(readFileSync("scripts/tmp-social-rest.json", "utf8"))[0];
const html = page.content.rendered;
const $ = load(html);
$("video, source, .n2-ss-slide-background-video, [data-video]").each((i, el) => {
  if (i > 12) return;
  console.log(i, el.tagName, $(el).attr("class"), {
    src: $(el).attr("src"),
    data: Object.fromEntries(
      Object.entries($(el).attr() || {}).filter(([k]) => /video|src|poster|mp4/i.test(k)),
    ),
  });
});
const mp4 = [...html.matchAll(/https?:\/\/[^"'\\\s]+\.mp4|\/\/[^"'\\\s]+\.mp4/gi)].map((m) => m[0]);
console.log("mp4s", [...new Set(mp4)]);
