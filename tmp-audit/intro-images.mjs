import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";

// Extract each "gallery: [ { src ... } ]" first entry per industry file, with the nearest preceding slug.
for (const id of ["hvac", "dental", "medical-aesthetics", "golf", "retail", "specialty-retail", "construction", "travel"]) {
  const text = readFileSync(`src/lib/industries/${id}.ts`, "utf8").replace(/\$\{UP\}|\$\{UPLOADS\}/g, "/wp-content/uploads");
  for (const m of text.matchAll(/gallery:\s*\[\s*\{\s*src:\s*["`]([^"`]+)["`]/g)) {
    const before = text.slice(0, m.index);
    const slug = [...before.matchAll(/slug:\s*"([^"]+)"/g)].pop()?.[1] ?? "(landing)";
    const path = `public${m[1]}`;
    const meta = existsSync(path) ? await sharp(path).metadata() : null;
    const ar = meta ? (meta.width / meta.height).toFixed(2) : "?";
    console.log(`${id.padEnd(20)} ${slug.padEnd(32)} ar=${ar} ${m[1]}`);
  }
}
