import { readFileSync, writeFileSync } from "node:fs";

const issues = JSON.parse(readFileSync("tmp-audit/image-sharpness.json", "utf8"));
const DPR = { desktop: 1, retina: 2, phone: 3 };
const VW = { desktop: 1440, retina: 1440, phone: 390 };
const groups = new Map();
for (const i of issues) {
  if (i.kind !== "undersized-request" && i.kind !== "source-too-small") continue;
  const key = `${i.cls || "(no module)"} | sizes="${i.sizes}"`;
  const g = groups.get(key) ?? { count: 0, kinds: new Set(), needVw: {}, examples: new Set(), pages: new Set() };
  g.count++;
  g.kinds.add(i.kind);
  const vw = Math.round(((i.need / DPR[i.vp]) / VW[i.vp]) * 100);
  g.needVw[i.vp] = Math.max(g.needVw[i.vp] ?? 0, vw);
  g.examples.add(`${i.original.split("/").pop()} ${i.box} d=${i.density} src=${i.sourceWidth ?? "?"}`);
  g.pages.add(i.path);
  groups.set(key, g);
}
const lines = [...groups.entries()]
  .sort((a, b) => b[1].count - a[1].count)
  .map(([key, g]) => [
    `## ${key} (${g.count}) [${[...g.kinds].join(",")}]`,
    `need vw: ${JSON.stringify(g.needVw)}`,
    `pages: ${[...g.pages].slice(0, 6).join(" ")}`,
    ...[...g.examples].slice(0, 6).map((e) => `- ${e}`),
    "",
  ].join("\n"));
writeFileSync("tmp-audit/sharpness-components.md", lines.join("\n"));
console.log(`${groups.size} groups`);
