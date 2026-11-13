import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|json|css)$/.test(name)) out.push(p);
  }
  return out;
}

const missing = new Map();
for (const file of walk("src")) {
  const text = readFileSync(file, "utf8").replace(/\$\{(UP|UPLOADS|U)\}/g, "/wp-content/uploads").replace(/\$\{LOCAL\}/g, "/images/hvac-marketing");
  for (const m of text.matchAll(/["'`(](\/(?:images|wp-content\/uploads)\/[^"'`)\s?#]+\.(?:jpe?g|png|webp|gif|avif|svg|mp4))/gi)) {
    const ref = decodeURIComponent(m[1]);
    if (!existsSync(`public${ref}`)) missing.set(ref, file);
  }
}
for (const [ref, file] of missing) console.log(`${ref}  <- ${file}`);
console.log(`${missing.size} missing`);
