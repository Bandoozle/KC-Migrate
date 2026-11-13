import sharp from "sharp";

const raw = "tmp-audit/arcteryx-wiki-raw-0.jpg";
const meta = await sharp(raw).metadata();

// Crop to the embroidered bird (upper-center of the jacket photo)
const crop = {
  left: Math.floor(meta.width * 0.18),
  top: Math.floor(meta.height * 0.08),
  width: Math.floor(meta.width * 0.64),
  height: Math.floor(meta.height * 0.55),
};

const { data, info } = await sharp(raw)
  .extract(crop)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Keep pale embroidery; drop saturated green knit
  const isStitch = lum > 155 && sat < 0.28 && !(g > r + 25 && g > b + 25);
  if (isStitch) {
    const alpha = Math.min(255, Math.round(((lum - 155) / 70) * 255));
    data[i] = 20;
    data[i + 1] = 20;
    data[i + 2] = 20;
    data[i + 3] = Math.max(180, alpha);
  } else {
    data[i + 3] = 0;
  }
}

const fossilBuf = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 8 })
  .resize({ height: 170, fit: "inside" })
  .png()
  .toBuffer();

const fossilMeta = await sharp(fossilBuf).metadata();
console.log("fossil cropped", fossilMeta.width, fossilMeta.height);

const wordmarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="240">
  <text x="0" y="148" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="52" font-weight="700" letter-spacing="6" fill="#141414">ARC'TERYX</text>
</svg>`;
const wordmark = await sharp(Buffer.from(wordmarkSvg)).png().toBuffer();

const canvasW = 820;
const canvasH = 240;
const gap = 24;
const birdX = 20;
const birdY = Math.round((canvasH - fossilMeta.height) / 2);
const textX = birdX + fossilMeta.width + gap;

await sharp({
  create: {
    width: canvasW,
    height: canvasH,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: fossilBuf, left: birdX, top: birdY },
    { input: wordmark, left: Math.min(textX, canvasW - 560), top: 0 },
  ])
  .png()
  .toFile("public/images/brands/arcteryx.png");

console.log("done", await sharp("public/images/brands/arcteryx.png").metadata());
