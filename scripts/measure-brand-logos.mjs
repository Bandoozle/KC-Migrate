/**
 * Measures the visible ("ink") bounds of every brand logo, ignoring transparent padding baked into the
 * source canvases, and writes src/lib/brand-logo-metrics.json. The brand wall uses it to size each
 * logo by what you can see rather than by its canvas (see src/lib/brand-logo-sizing.ts).
 *
 * Re-run after adding or replacing a logo:  node scripts/measure-brand-logos.mjs
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
/** [directory under public/, URL prefix] */
const SOURCES = [
  ["images/brands", "/images/brands"],
  ["wp-content/uploads/2026/07", "/wp-content/uploads/2026/07"],
];
const ALPHA_THRESHOLD = 24; // ignore anti-aliasing haze and near-invisible pixels
const round = (n) => Math.round(n * 1000) / 1000;

const metrics = {};
for (const [dir, prefix] of SOURCES) {
  const files = (await readdir(path.join(root, "public", dir))).filter((f) => /\.(png|webp)$/i.test(f)).sort();
  for (const file of files) {
    const { data, info } = await sharp(path.join(root, "public", dir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = info;
    let x0 = width, y0 = height, x1 = -1, y1 = -1;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) {
          if (x < x0) x0 = x;
          if (x > x1) x1 = x;
          if (y < y0) y0 = y;
          if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) continue; // fully transparent: nothing to measure
    const inkW = x1 - x0 + 1;
    const inkH = y1 - y0 + 1;
    metrics[`${prefix}/${file}`] = {
      /** Canvas size in pixels, for the <img> width/height attributes */
      width,
      height,
      /** Visible width and height as a fraction of the canvas */
      inkW: round(inkW / width),
      inkH: round(inkH / height),
      /** Ink centre offset from the canvas centre, as a fraction of the canvas (right and down are positive) */
      dx: round((x0 + x1 + 1) / 2 / width - 0.5),
      dy: round((y0 + y1 + 1) / 2 / height - 0.5),
      /** Visible aspect ratio (width / height) */
      aspect: round(inkW / inkH),
    };
  }
}

await writeFile(path.join(root, "src/lib/brand-logo-metrics.json"), JSON.stringify(metrics, null, 2) + "\n");
console.log(`Measured ${Object.keys(metrics).length} logos`);
