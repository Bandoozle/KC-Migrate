import { readFileSync } from "node:fs";
import { join } from "node:path";

const t = process.env.TEMP;
for (const f of ["mr2.html", "mp2.html"]) {
  const main = (readFileSync(join(t, f), "utf8").match(/<main>([\s\S]*?)<\/main>/) || [])[1] || "";
  const pick = (re) => [...main.matchAll(re)].map((m) => m[1]);
  console.log(f, {
    eyebrow: pick(/eyebrow[^>]*>([^<]+)/g),
    subtitle: pick(/subtitle[^>]*>([^<]+)/g),
    connect: (main.match(/Connect With Us/g) || []).length,
    industryTitles: pick(/__label[^>]*>([^<]+)/g),
  });
}
