// Copies the WordPress media the site actually uses into public/wp-content/, at the
// original paths. "Used" means referenced by the served HTML of a running build
// (sitemap pages plus /thanks/, including srcset and the React payload) or by
// an OG / JSON-LD image in the Rank Math snapshot. Files already present are left alone.
//
//   npx next build && npx next start -p 3107
//   node scripts/sync-wordpress-media.mjs [--dry-run]
//
// BASE (default http://localhost:3107) is the running build; WORDPRESS_URL is where
// missing files are downloaded from. Videos over 25 MB are reported, not copied:
// re-encode them first (see docs/LAUNCH_READINESS.md §12).
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3107";
const ORIGIN = (process.env.WORDPRESS_URL || "https://staging.kosick.com").replace(/\/+$/, "");
const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

// A /wp-content/ path up to its media extension. Filenames can contain spaces
// ("…10.43.00 PM.webp"), and React keys in the page payload append "-0", "-1"…
const MEDIA_PATH = /\/wp-content\/[^"'<>()\\,?#\n]*?\.(?:jpe?g|png|webp|avif|gif|svg|mp4|mov|webm|pdf)(?![a-z0-9])/gi;

function mediaPaths(text) {
  return (text.match(MEDIA_PATH) || []).map((p) => decodeURI(p).replace(/&amp;$/, ""));
}

async function pageUrls() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`, { headers: { host: "www.kosick.com" } })).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return [...paths, "/thanks/"];
}

const used = new Map();
function addUse(mediaPath, where) {
  if (!used.has(mediaPath)) used.set(mediaPath, new Set());
  used.get(mediaPath).add(where);
}

for (const page of await pageUrls()) {
  const response = await fetch(`${BASE}${page}`, { headers: { host: "www.kosick.com" } });
  if (!response.ok) throw new Error(`${response.status} ${page}`);
  for (const p of mediaPaths(await response.text())) addUse(p, page);
}

const snapshot = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/seo/rank-math-snapshot.json"), "utf8"));
for (const [page, seo] of Object.entries(snapshot.pages)) {
  for (const p of mediaPaths(JSON.stringify([seo.ogImage, seo.jsonLd]))) addUse(p, `${page} (SEO)`);
}

const missing = [...used.keys()].filter((p) => !fs.existsSync(path.join(PUBLIC, p))).sort();
console.log(`${used.size} media files referenced, ${missing.length} not in public/`);

const failed = [];
const tooLarge = [];
let bytes = 0;
for (const mediaPath of missing) {
  const url = `${ORIGIN}${encodeURI(mediaPath)}`;
  if (DRY_RUN) {
    console.log(`  would copy ${mediaPath}`);
    continue;
  }
  const response = await fetch(url);
  if (!response.ok) {
    failed.push(`${response.status} ${mediaPath} (used on ${[...used.get(mediaPath)].slice(0, 3).join(", ")})`);
    continue;
  }
  const body = Buffer.from(await response.arrayBuffer());
  if (/\.(mp4|mov|webm)$/i.test(mediaPath) && body.length > MAX_VIDEO_BYTES) {
    tooLarge.push(`${(body.length / 1e6).toFixed(0)} MB ${mediaPath}`);
    continue;
  }
  const target = path.join(PUBLIC, mediaPath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  bytes += body.length;
}

if (!DRY_RUN) console.log(`Copied ${missing.length - failed.length - tooLarge.length} files (${(bytes / 1e6).toFixed(1)} MB)`);
if (tooLarge.length) console.log(`Videos to re-encode before adding:\n  ${tooLarge.join("\n  ")}`);
if (failed.length) console.log(`Not available on ${ORIGIN}:\n  ${failed.join("\n  ")}`);
fs.writeFileSync(
  path.join(ROOT, ".next", "media-inventory.json"),
  JSON.stringify(Object.fromEntries([...used].map(([p, pages]) => [p, [...pages]])), null, 1),
);
