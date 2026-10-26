import fs from "node:fs";
import path from "node:path";
const found = new Map();
const re = /(?:https:\/\/staging\.kosick\.com\/wp-content\/uploads\/|\$\{UPLOADS\}\/)([^`"' )]+\.(?:jpe?g|png|webp|mp4))/g;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|css|json)$/.test(e.name)) {
      for (const m of fs.readFileSync(p, "utf8").matchAll(re)) {
        if (!found.has(m[1])) found.set(m[1], new Set());
        found.get(m[1]).add(path.relative("src", p));
      }
    }
  }
}
walk("src");
for (const f of ["tmp-audit/cb-content.json"]) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(re)) if (!found.has(m[1])) found.set(m[1], new Set(["cb-content"]));
}
const keys = [...found.keys()].sort();
console.log(keys.length);
for (const k of keys) console.log(k, "|", [...found.get(k)].slice(0, 2).join(", "));
