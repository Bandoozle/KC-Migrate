import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";

for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, "utf8").replace(/\$\{UP\}|\$\{UPLOADS\}/g, "/wp-content/uploads");
  const srcs = new Set([...text.matchAll(/["`](\/(?:images|wp-content)[^"`]+\.(?:jpe?g|png|webp))["`]/gi)].map((m) => m[1]));
  for (const src of srcs) {
    const path = `public${src}`;
    if (!existsSync(path)) { console.log(`${file} ${src} MISSING`); continue; }
    const m = await sharp(path).metadata();
    const ar = m.width / m.height;
    if (ar < 1.1) console.log(`${file} ${src} ${m.width}x${m.height} ar=${ar.toFixed(2)}`);
  }
}
