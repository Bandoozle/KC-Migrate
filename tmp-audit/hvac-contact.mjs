import sharp from "sharp";

const files = process.argv.slice(3);
const out = process.argv[2];
const W = 400, H = 300, cols = 3;
const tiles = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(`public${f}`).resize(W, H, { fit: "cover" }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="24"><rect width="${W}" height="24" fill="black"/><text x="6" y="17" font-size="14" fill="white" font-family="Arial">${i + 1}. ${f.split("/").pop()}</text></svg>`);
  return { input: await sharp(img).composite([{ input: label, top: H - 24, left: 0 }]).toBuffer(), left: (i % cols) * W, top: Math.floor(i / cols) * H };
}));
await sharp({ create: { width: W * cols, height: H * Math.ceil(files.length / cols), channels: 3, background: "#222" } })
  .composite(tiles).jpeg().toFile(out);
console.log(out);
