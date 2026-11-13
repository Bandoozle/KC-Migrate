import sharp from "sharp";

const DOGWOOD = "tmp-audit/agc-Favicon_Dogwood.png";

async function makeAvatar(size) {
  const ring = Math.max(2, Math.round(size * 0.045));
  const iconSize = Math.round(size * 0.64);
  const base = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f58529"/>
      <stop offset="50%" stop-color="#dd2a7b"/>
      <stop offset="100%" stop-color="#8134af"/>
    </linearGradient>
  </defs>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 0.5}" fill="url(#g)"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ring}" fill="#ffffff"/>
</svg>`);
  const icon = await sharp(DOGWOOD)
    .resize(iconSize, iconSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const composed = await sharp(base)
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toBuffer();
  const mask = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
</svg>`);
  return sharp(composed)
    .composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function findPinkAvatars(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const mask = new Uint8Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (a < 200) continue;
    if (r > 195 && b > 135 && g < 140 && r - g > 55 && b - g > 25) mask[p] = 1;
  }
  const visited = new Uint8Array(width * height);
  const blobs = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x;
      if (!mask[start] || visited[start]) continue;
      const q = [start];
      visited[start] = 1;
      let minX = x,
        maxX = x,
        minY = y,
        maxY = y,
        n = 0;
      while (q.length) {
        const idx = q.pop();
        const cx = idx % width;
        const cy = (idx / width) | 0;
        n++;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = cx + dx,
            ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          if (!mask[ni] || visited[ni]) continue;
          visited[ni] = 1;
          q.push(ni);
        }
      }
      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      const size = Math.max(bw, bh);
      if (size < 24 || size > 70) continue;
      if (bw / bh < 0.7 || bw / bh > 1.4) continue;
      if (n < size * size * 0.1) continue;
      blobs.push({ cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, size: size * 1.45, n });
    }
  }
  blobs.sort((a, b) => b.n - a.n);
  const kept = [];
  for (const b of blobs) {
    if (kept.some((k) => Math.hypot(k.cx - b.cx, k.cy - b.cy) < b.size * 0.75)) continue;
    kept.push(b);
  }
  return kept;
}

async function apply(src, dest, placements) {
  const composites = [];
  for (const p of placements) {
    const size = Math.round(p.size);
    composites.push({
      input: await makeAvatar(size),
      left: Math.round(p.cx - size / 2),
      top: Math.round(p.cy - size / 2),
    });
  }
  await sharp(src).composite(composites).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  console.log("wrote", dest, placements.length);
}

// 1) Collage of 5 IG posts — pink flower avatars
const pink = await findPinkAvatars("public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg");
console.log(
  "Social-Media pink",
  pink.map((b) => ({ x: Math.round(b.cx), y: Math.round(b.cy), s: Math.round(b.size) })),
);
if (pink.length < 4) throw new Error(`Expected ~5 pink avatars, got ${pink.length}`);
await apply(
  "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Social-Media.jpg",
  pink,
);

// 2) Phone mockup — measured avatar centers from crops
const phonePlacements = [
  { cx: 248, cy: 292, size: 54 }, // main phone post header
  { cx: 690, cy: 188, size: 48 }, // top floating card
  { cx: 690, cy: 735, size: 48 }, // bottom floating card
];
await apply(
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
  phonePlacements,
);

// Also swap the thin flower mark on the sale graphic with the official dogwood
{
  const src = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg";
  // Cover old mark + place dogwood above AMSTERDAM wordmark on sale creative
  const cover = await sharp({
    create: { width: 78, height: 78, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } },
  })
    .png()
    .toBuffer();
  const mark = await sharp(DOGWOOD)
    .resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const tmp = "tmp-audit/agc-phone-patched.jpg";
  await sharp(src)
    .composite([
      { input: cover, left: 468, top: 768 },
      { input: mark, left: 475, top: 775 },
    ])
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(tmp);
  await sharp(tmp).toFile(src);
}

await sharp("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg")
  .resize({ width: 750 })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg");
await sharp("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg")
  .resize({ width: 360 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg");

console.log("done");
