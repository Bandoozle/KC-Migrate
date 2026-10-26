import { readFileSync } from "node:fs";

const html = readFileSync("tmp-audit/outdoor-staging.html", "utf8");
const bgs = [...html.matchAll(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/gi)].map((m) => ({ url: m[1], at: m.index }));
const labels = [...html.matchAll(/>(Street Level|Classic Poster|Vertical Poster|Superboard|Street-Level \(TSA\)|Billboard Posters|Transit Advertising|Superboards)</g)].map((m) => ({ label: m[1], at: m.index }));
console.log("labels:", labels.map((l) => `${l.label}@${l.at}`).join(", "));
for (const bg of bgs) {
  const next = labels.find((l) => l.at > bg.at);
  console.log(`bg@${bg.at} ${bg.url.split("/uploads/")[1] || bg.url} -> next label: ${next?.label}@${next?.at}`);
}
