import fs from "fs";

const html = fs.readFileSync("tmp-audit/seo-source.html", "utf8");
const at = html.indexOf("Keyword Research");
const slice = html.slice(Math.max(0, at - 2500), at);
const text = slice
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();
console.log(text.slice(-1200));
