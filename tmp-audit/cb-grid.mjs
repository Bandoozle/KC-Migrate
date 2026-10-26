import sharp from "sharp";

const src = process.argv[2];
const out = process.argv[3];
const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
const W = 700;
const img = sharp(buf).resize({ width: W });
const { info } = await img.clone().toBuffer({ resolveWithObject: true });
const H = info.height;
let lines = "";
for (let p = 10; p < 100; p += 10) {
  const y = (H * p) / 100;
  const x = (W * p) / 100;
  lines += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#00c8ff" stroke-width="1"/><text x="2" y="${y - 2}" font-size="12" fill="#00a0ff">${p}</text>`;
  lines += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ff00aa" stroke-width="1"/><text x="${x + 2}" y="12" font-size="12" fill="#ff00aa">${p}</text>`;
}
await img
  .composite([{ input: Buffer.from(`<svg width="${W}" height="${H}">${lines}</svg>`), top: 0, left: 0 }])
  .jpeg({ quality: 85 })
  .toFile(out);
console.log(W, H);
