import fs from "fs";

const pages = JSON.parse(fs.readFileSync("tmp-audit/dv-page.json", "utf8"));
const html = pages[0].content.rendered;
const imgs = [...html.matchAll(/<img[^>]+>/g)].map((match) => {
  const tag = match[0];
  const src = tag.match(/src="([^"]+)"/)?.[1] ?? "";
  const alt = tag.match(/alt="([^"]*)"/)?.[1] ?? "";
  return { src: src.split("/").slice(-1)[0], alt };
});
const text = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<[^>]+>/g, "\n")
  .replace(/&amp;/g, "&")
  .replace(/&nbsp;/g, " ")
  .replace(/&#8217;|&#8216;/g, "'")
  .replace(/&#8220;|&#8221;/g, '"')
  .replace(/&[a-z#0-9]+;/g, " ")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);
console.log(text.join("\n"));
console.log("\n--- IMAGES ---");
for (const image of imgs) console.log(`${image.alt} | ${image.src}`);
