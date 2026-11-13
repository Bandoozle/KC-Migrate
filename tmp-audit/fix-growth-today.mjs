import fs from "node:fs";

const p = "src/content/articles/importance-of-social-media-marketing.json";
const j = JSON.parse(fs.readFileSync(p, "utf8"));
const before = j.content.rendered.includes("growth.today");
j.content.rendered = j.content.rendered.replace(
  /driving growth\.today[’']s digital landscape/g,
  "driving growth. In today’s digital landscape",
);
const after = j.content.rendered.includes("growth.today");
fs.writeFileSync(p, JSON.stringify(j));
console.log({ before, after, sample: j.content.rendered.slice(140, 260) });
