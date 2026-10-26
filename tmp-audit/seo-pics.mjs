import { readFileSync } from "node:fs";
const html = readFileSync("tmp-audit/seo-source.html", "utf8");
const pics = [...html.matchAll(/<picture[\s\S]*?<\/picture>/gi)].map((m) => m[0]);
console.log("pictures", pics.length);
for (const pic of pics) {
  const src = [...pic.matchAll(/(?:src|srcset)="([^"]+)"/gi)].map((m) => m[1].slice(0, 180));
  console.log("---");
  console.log(src.join("\n"));
}
