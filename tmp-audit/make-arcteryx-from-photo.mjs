import sharp from "sharp";
import fs from "node:fs";

const raw = fs.readFileSync("tmp-audit/arcteryx-wiki-raw-0.jpg");
const { data, info } = await sharp(raw).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

// Keep light embroidery stitches as dark mark; drop green fabric
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // cream stitches are bright + low saturation; green fabric is saturated
  const isStitch = lum > 140 && sat < 0.35 && g < r + 40;
  if (isStitch) {
    data[i] = 20;
    data[i + 1] = 20;
    data[i + 2] = 20;
    data[i + 3] = 255;
  } else {
    data[i + 3] = 0;
  }
}

const fossil = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 10 })
  .png()
  .toBuffer();

const fossilMeta = await sharp(fossil).metadata();
console.log("fossil", fossilMeta.width, fossilMeta.height);

// Compose fossil + wordmark on transparent canvas
const wordmarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="240">
  <text x="0" y="150" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="54" font-weight="700" letter-spacing="5" fill="#141414">ARC'TERYX</text>
</svg>`;
const wordmark = await sharp(Buffer.from(wordmarkSvg)).png().toBuffer();

const birdH = 200;
const bird = await sharp(fossil)
  .resize({ height: birdH, fit: "inside" })
  .png()
  .toBuffer();
const birdMeta = await sharp(bird).metadata();

const canvasW = 820;
const canvasH = 240;
const birdX = 28;
const birdY = Math.round((canvasH - birdMeta.height) / 2);
const textX = birdX + birdMeta.width + 28;

await sharp({
  create: {
    width: canvasW,
    height: canvasH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: bird, left: birdX, top: birdY },
    { input: wordmark, left: textX, top: 0 },
  ])
  .png()
  .toFile("public/images/brands/arcteryx.png");

console.log("saved", await sharp("public/images/brands/arcteryx.png").metadata());
