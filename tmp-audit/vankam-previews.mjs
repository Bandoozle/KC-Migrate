import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "reference-images/Logistics";
const out = "tmp-audit/previews";
mkdirSync(out, { recursive: true });

const files = readdirSync(dir).filter((name) => /\.(tif|png)$/i.test(name) && !/\(1\)/.test(name));
const tiles = [];
for (const name of files) {
  const buffer = await sharp(join(dir, name)).resize(480, 320, { fit: "cover" }).jpeg({ quality: 70 }).toBuffer();
  tiles.push({ name, buffer });
}

const cols = 4;
const rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: cols * 480, height: rows * 340, channels: 3, background: "#ffffff" } })
  .composite(
    tiles.flatMap((tile, index) => [
      { input: tile.buffer, left: (index % cols) * 480, top: Math.floor(index / cols) * 340 },
      {
        input: Buffer.from(
          `<svg width="480" height="20"><rect width="480" height="20" fill="#000"/><text x="6" y="15" font-size="13" fill="#fff" font-family="Arial">${index + 1}. ${tile.name}</text></svg>`,
        ),
        left: (index % cols) * 480,
        top: Math.floor(index / cols) * 340 + 320,
      },
    ]),
  )
  .jpeg({ quality: 70 })
  .toFile(join(out, "logistics-contact-sheet.jpg"));

console.log(files.map((name, index) => `${index + 1}. ${name}`).join("\n"));
