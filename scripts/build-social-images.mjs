/**
 * Builds the link-preview images: one 1200 × 630 JPEG per source in /public/images/social/,
 * plus src/lib/seo/social-images.generated.json (page path → file and alt text), which
 * src/lib/seo/social-image.ts reads for every page's Open Graph and Twitter tags.
 *
 *   npm run social-images              regenerate after editing src/lib/seo/social-image-sources.json
 *   npm run social-images -- --check   verify the manifest and files are current (no writes)
 *
 * Pages use social-image-sources.json; articles use the featured image captured in the Rank Math
 * snapshot. A missing source falls back to the Kosick card, with a warning.
 * Plain JavaScript so it runs with Node alone and needs no TypeScript configuration.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const DIR = "/images/social";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const outDir = path.join(publicDir, DIR);
const manifestPath = path.join(root, "src/lib/seo/social-images.generated.json");
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const config = readJson("src/lib/seo/social-image-sources.json");
const snapshot = readJson("src/lib/seo/rank-math-snapshot.json");
const check = process.argv.includes("--check");

/** Stable output name for a source and crop: readable stem plus a short FNV-1a hash. */
function fileName(source) {
  const key = `${source.src}|${source.position ?? "centre"}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const stem = (source.src.split("/").pop() ?? "image")
    .replace(/\.[a-z0-9]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${stem}-${hash.toString(16).padStart(8, "0").slice(0, 8)}.jpg`;
}

const sourceFile = (source) => path.join(publicDir, decodeURIComponent(source.src));

/* Every page path and its source: listed pages first, then captured article images */
const sources = new Map(Object.entries(config.pages));
for (const [pagePath, seo] of Object.entries(snapshot.pages)) {
  if (sources.has(pagePath) || !seo.ogImage) continue;
  const url = new URL(seo.ogImage, "https://www.kosick.com");
  if (url.hostname !== "www.kosick.com") continue;
  sources.set(pagePath, { src: url.pathname, alt: seo.ogTitle || seo.title || "Kosick Communications" });
}

const warnings = [];
const fallback = config.fallback;
const manifest = {
  width: WIDTH,
  height: HEIGHT,
  dir: DIR,
  fallback: { file: fileName(fallback), alt: fallback.alt },
  pages: {},
};
const jobs = new Map([[manifest.fallback.file, fallback]]);
for (const [pagePath, source] of [...sources].sort(([a], [b]) => a.localeCompare(b))) {
  const usable = fs.existsSync(sourceFile(source)) ? source : fallback;
  if (usable !== source) warnings.push(`${pagePath}: ${source.src} not found, using the Kosick card`);
  const file = fileName(usable);
  manifest.pages[pagePath] = { file, alt: usable.alt };
  jobs.set(file, usable);
}

const json = `${JSON.stringify(manifest, null, 2)}\n`;
for (const warning of warnings) console.warn(`warning: ${warning}`);

if (check) {
  const problems = [];
  const current = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== json) problems.push("src/lib/seo/social-images.generated.json is out of date");
  for (const file of jobs.keys()) if (!fs.existsSync(path.join(outDir, file))) problems.push(`missing public${DIR}/${file}`);
  if (problems.length) {
    for (const problem of problems) console.error(problem);
    console.error("Run `npm run social-images` to regenerate.");
    process.exit(1);
  }
  console.log(`Social images current: ${Object.keys(manifest.pages).length} pages, ${jobs.size} images.`);
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });
for (const [file, source] of jobs) {
  const target = path.join(outDir, file);
  if (fs.existsSync(target)) continue;
  await sharp(sourceFile(source))
    .rotate()
    .resize(WIDTH, HEIGHT, { fit: "cover", position: source.position ?? "centre" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(target);
}
/* Remove previews no page uses any more */
for (const file of fs.readdirSync(outDir)) if (!jobs.has(file)) fs.rmSync(path.join(outDir, file));
fs.writeFileSync(manifestPath, json);
console.log(`Wrote ${jobs.size} preview images for ${Object.keys(manifest.pages).length} pages.`);
