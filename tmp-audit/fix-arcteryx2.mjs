import sharp from "sharp";

const src = "public/images/brands/arcteryx.png";
const img = sharp(src);
const { width, height } = await img.metadata();
const { data } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const hist = { dark: 0, mid: 0, light: 0, clear: 0 };
const samples = [];
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  if (a < 10) {
    hist.clear++;
    continue;
  }
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 80) hist.dark++;
  else if (lum < 180) hist.mid++;
  else hist.light++;
}
// find first opaque pixel
for (let y = 0; y < height && samples.length < 8; y++) {
  for (let x = 0; x < width && samples.length < 8; x++) {
    const i = (y * width + x) * 4;
    if (data[i + 3] > 40) {
      samples.push({ x, y, r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] });
    }
  }
}
console.log({ hist, samples });

// Rebuild as dark mark on transparent: any visible pixel → near-black with original alpha
const out = Buffer.from(data);
for (let i = 0; i < out.length; i += 4) {
  const a = out[i + 3];
  if (a < 8) {
    out[i] = out[i + 1] = out[i + 2] = 0;
    out[i + 3] = 0;
    continue;
  }
  const r = out[i], g = out[i + 1], b = out[i + 2];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Light embroidery on dark: invert to dark ink; already-dark stay dark
  const ink = lum > 100 ? Math.max(18, 255 - lum) : Math.min(40, lum + 12);
  out[i] = out[i + 1] = out[i + 2] = Math.round(ink);
  // Strengthen faint stitches
  out[i + 3] = Math.min(255, Math.round(a * 1.15));
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png()
  .toFile("public/images/brands/arcteryx.png");

const check = await sharp("public/images/brands/arcteryx.png").raw().toBuffer({ resolveWithObject: true });
let opaque = 0,
  avgLum = 0;
for (let i = 0; i < check.data.length; i += 4) {
  if (check.data[i + 3] > 20) {
    opaque++;
    avgLum += check.data[i];
  }
}
console.log({ opaque, avgLum: Math.round(avgLum / Math.max(1, opaque)) });
