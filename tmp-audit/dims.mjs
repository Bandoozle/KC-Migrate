import sharp from "sharp";
import { readdirSync } from "node:fs";

const dirs = process.argv.slice(2);
for (const dir of dirs) {
  for (const f of readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
    const m = await sharp(`${dir}/${f}`).metadata();
    console.log(`${dir}/${f} ${m.width}x${m.height} ar=${(m.width / m.height).toFixed(2)}`);
  }
}
