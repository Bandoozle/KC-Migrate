import sharp from "sharp";
import fs from "node:fs";

/** Export a grid of crops so we can locate avatars by eye/metadata. */
async function grid(path, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const meta = await sharp(path).metadata();
  const cols = 6;
  const rows = 4;
  const cw = Math.floor(meta.width / cols);
  const ch = Math.floor(meta.height / rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const left = c * cw;
      const top = r * ch;
      await sharp(path)
        .extract({ left, top, width: cw, height: Math.min(ch, meta.height - top) })
        .jpeg({ quality: 80 })
        .toFile(`${outDir}/r${r}c${c}_${left}x${top}.jpg`);
    }
  }
  console.log(path, meta.width, meta.height, "->", outDir);
}

await grid("public/wp-content/uploads/2026/08/Social-Media.jpg", "tmp-audit/agc-grid-social");
await grid("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg", "tmp-audit/agc-grid-phone");
