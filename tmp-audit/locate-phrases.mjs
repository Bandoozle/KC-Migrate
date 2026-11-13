import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const phrases = readFileSync("tmp-audit/phrases.txt", "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|json)$/.test(name)) files.push(path);
  }
})("src");

const texts = files.map((path) => [path, readFileSync(path, "utf8")]);
for (const phrase of phrases) {
  const variants = [phrase, phrase.replace(/'/g, "’"), phrase.replace(/'/g, "\\u2019"), phrase.replace(/'/g, "&#8217;"), phrase.replace(/&/g, "&amp;"), phrase.replace(/—/g, "&#8212;"), phrase.replace(/’/g, "&#8217;")];
  const where = texts.filter(([, text]) => variants.some((v) => text.includes(v))).map(([path]) => path.replace(/\\/g, "/"));
  console.log(`${where.length ? "OK " : "-- "}${phrase}\n    ${where.join("\n    ")}`);
}
