import { readFileSync, writeFileSync } from "node:fs";

const DPR = { desktop: 1, retina: 2, phone: 3 };
const MIN_DENSITY = { desktop: 0.95, retina: 1.5, phone: 2 };

const text = readFileSync("tmp-audit/image-sharpness.md", "utf8");
const groups = new Map();
let kind = "";
for (const line of text.split("\n")) {
  const head = line.match(/^## (\S+)/);
  if (head) { kind = head[1]; continue; }
  const m = line.match(/^- \[(\w+)\] (\S+) \| (\S+) \| box (\S*) fit (\S*) \| got (\S*) need (\S*) req (\S*) src (\S*) \| visible (\S*) \| (.*)$/);
  if (!m) continue;
  const [, vp, path, original, box, fit, got, need, req, src, visible, label] = m;
  if (kind === "undersized-request" || kind === "source-too-small") {
    const actual = req ? Math.min(Number(req), Number(src) || Infinity) : Number(got);
    const density = (actual / Number(need)) * DPR[vp];
    if (density >= MIN_DENSITY[vp]) continue;
    const k = `${kind}|${original}`;
    const g = groups.get(k) ?? { kind, original, src, label, hits: [] };
    g.hits.push({ vp, path, box, fit, got, need, req, density });
    groups.set(k, g);
  } else if (kind === "heavy-crop") {
    const k = `${kind}|${original}|${box}`;
    const g = groups.get(k) ?? { kind, original, src, label, hits: [] };
    g.hits.push({ vp, path, box, fit, visible: Number(visible) });
    groups.set(k, g);
  }
}
const out = [];
for (const k of ["undersized-request", "source-too-small", "heavy-crop"]) {
  const list = [...groups.values()].filter((g) => g.kind === k);
  out.push(`## ${k} (${list.length})`);
  for (const g of list) {
    const worst = g.hits.reduce((a, b) => ((a.density ?? a.visible) < (b.density ?? b.visible) ? a : b));
    const paths = [...new Set(g.hits.map((h) => h.path))];
    out.push(`- ${g.original} | src ${g.src} | worst ${worst.vp} ${(worst.density ?? worst.visible).toFixed(2)} box ${worst.box} got ${worst.got ?? ""} req ${worst.req ?? ""} | ${[...new Set(g.hits.map((h) => h.vp))].join(",")} | ${paths.slice(0, 3).join(" ")}`);
  }
  out.push("");
}
writeFileSync("tmp-audit/sharpness-summary.md", out.join("\n"));
console.log(out.filter((l) => l.startsWith("##")).join("\n"));
