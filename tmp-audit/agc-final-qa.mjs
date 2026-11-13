import sharp from "sharp";

async function preview(src, dest, width = 900) {
  await sharp(src).resize({ width }).jpeg({ quality: 88 }).toFile(dest);
}

await preview(
  "public/wp-content/uploads/2026/08/Social-Media.jpg",
  "tmp-audit/qa-full-social.jpg",
  1000,
);
await preview(
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
  "tmp-audit/qa-full-phone.jpg",
  700,
);

// Count remaining pink-flower-ish blobs near white headers in Social-Media
const src = "public/wp-content/uploads/2026/08/Social-Media.jpg";
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
let leftover = 0;
const hits = [];
for (let y = 40; y < height - 40; y += 3) {
  for (let x = 40; x < width - 40; x += 3) {
    const i = (y * width + x) * 4;
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    // old pink/magenta petal (dogwood is black lines — skip dark)
    const pinkPetal = r > 200 && b > 100 && g < 160 && r - g > 50 && b > g + 20;
    if (!pinkPetal) continue;
    // surrounded by white?
    let white = 0;
    for (const [dx, dy] of [
      [28, 0],
      [-28, 0],
      [0, 28],
      [0, -28],
      [20, 20],
      [-20, 20],
    ]) {
      const j = ((y + dy) * width + (x + dx)) * 4;
      if (data[j] > 230 && data[j + 1] > 230 && data[j + 2] > 230) white++;
    }
    if (white < 3) continue;
    if (hits.some((h) => Math.hypot(h.x - x, h.y - y) < 40)) continue;
    hits.push({ x, y });
    leftover++;
  }
}
console.log("possible leftover pink near white", hits);
console.log("done");
