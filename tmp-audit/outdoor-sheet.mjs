import sharp from "sharp";
import { readdirSync } from "node:fs";

const dir = "tmp-audit/outdoor-img";
const files = readdirSync(dir).filter((f) => f.endsWith(".jpg") && !f.startsWith("sheet"));
const cell = { w: 400, h: 280 };
const cols = 4;
const rows = Math.ceil(files.length / cols);
const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp(`${dir}/${f}`).resize(cell.w, cell.h - 30, { fit: "contain", background: "#222" }).toBuffer();
    const label = Buffer.from(
      `<svg width="${cell.w}" height="30"><rect width="100%" height="100%" fill="#000"/><text x="6" y="20" font-size="14" fill="#fff" font-family="Arial">${i + 1}. ${f.replace(".jpg", "")}</text></svg>`,
    );
    return [
      { input: img, left: (i % cols) * cell.w, top: Math.floor(i / cols) * cell.h },
      { input: label, left: (i % cols) * cell.w, top: Math.floor(i / cols) * cell.h + cell.h - 30 },
    ];
  }),
);
await sharp({ create: { width: cols * cell.w, height: rows * cell.h, channels: 3, background: "#111" } })
  .composite(tiles.flat())
  .jpeg({ quality: 80 })
  .toFile(`${dir}/sheet.jpg`);
console.log(files.length, "tiles");
