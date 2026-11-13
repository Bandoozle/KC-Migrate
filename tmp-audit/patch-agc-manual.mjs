import sharp from "sharp";

const DOGWOOD = "tmp-audit/agc-Favicon_Dogwood.png";

async function makeAvatar(size) {
  const ring = Math.max(2, Math.round(size * 0.045));
  const iconSize = Math.round(size * 0.62);
  const base = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 0.5}" fill="#e87722"/>
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

/** Find pink flower blobs (old AGC avatar). */
async function findPinkAvatars(path, { minSize = 28, maxSize = 90 } = {}) {
  const meta = await sharp(path).metadata();
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const mask = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (a < 200) continue;
    // Magenta/pink petals of old flower logo
    if (r > 190 && b > 130 && g < 145 && r - g > 50 && b - g > 20) mask[p] = 1;
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
      if (size < minSize || size > maxSize) continue;
      if (bw / bh < 0.65 || bw / bh > 1.5) continue;
      if (n < size * size * 0.08) continue;
      blobs.push({
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        size: size * 1.35, // include orange ring outside pink petals
        n,
      });
    }
  }

  blobs.sort((a, b) => b.n - a.n);
  const kept = [];
  for (const b of blobs) {
    if (kept.some((k) => Math.hypot(k.cx - b.cx, k.cy - b.cy) < b.size * 0.7)) continue;
    kept.push(b);
  }
  return { meta, kept };
}

async function patchPink(src, dest) {
  const { kept } = await findPinkAvatars(src);
  console.log(
    "pink avatars",
    src,
    kept.map((b) => ({ x: Math.round(b.cx), y: Math.round(b.cy), s: Math.round(b.size) })),
  );
  const composites = [];
  for (const b of kept) {
    const size = Math.round(b.size);
    composites.push({
      input: await makeAvatar(size),
      left: Math.round(b.cx - size / 2),
      top: Math.round(b.cy - size / 2),
    });
  }
  await sharp(src).composite(composites).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  console.log("wrote", dest, composites.length);
}

/** For the phone mockup: avatars are IG story rings near headers. Use orange-ring + top-of-card heuristic. */
async function patchPhoneManual(src, dest) {
  // Coordinates measured from crop inspection of 1122×1402 asset
  // Phone post header avatar (left device)
  // Floating card avatars (right stack)
  const placements = [
    { cx: 248, cy: 268, size: 52 }, // phone IG header
    { cx: 690, cy: 175, size: 44 }, // top floating card
    { cx: 690, cy: 700, size: 44 }, // bottom floating card — refine after preview
  ];

  // Refine by scanning for pink OR orange-ring circles near expected Y bands
  const meta = await sharp(src).metadata();
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const refined = [];

  for (const guess of placements) {
    let best = null;
    for (let y = guess.cy - 40; y <= guess.cy + 40; y++) {
      for (let x = guess.cx - 60; x <= guess.cx + 80; x++) {
        for (const radius of [18, 20, 22, 24, 26, 28]) {
          if (x - radius < 0 || y - radius < 0 || x + radius >= info.width || y + radius >= info.height) continue;
          let orange = 0;
          let samples = 0;
          for (let a = 0; a < 20; a++) {
            const ang = (a / 20) * Math.PI * 2;
            const rx = Math.round(x + Math.cos(ang) * radius);
            const ry = Math.round(y + Math.sin(ang) * radius);
            const i = (ry * info.width + rx) * 4;
            samples++;
            const r = data[i],
              g = data[i + 1],
              b = data[i + 2];
            if (r > 170 && g > 70 && g < 180 && b < 110 && r - b > 60) orange++;
          }
          const score = orange / samples;
          if (score < 0.5) continue;
          if (!best || score > best.score) best = { cx: x, cy: y, size: radius * 2.15, score };
        }
      }
    }
    if (best) refined.push(best);
    else refined.push(guess);
  }

  console.log(
    "phone avatars",
    refined.map((b) => ({ x: Math.round(b.cx), y: Math.round(b.cy), s: Math.round(b.size), score: b.score?.toFixed?.(2) })),
  );

  const composites = [];
  for (const b of refined) {
    const size = Math.round(b.size);
    composites.push({
      input: await makeAvatar(size),
      left: Math.round(b.cx - size / 2),
      top: Math.round(b.cy - size / 2),
    });
  }

  // Also replace the wordmark flower icon on the sale graphic (bottom-right of phone creative)
  // Approximate region for thin line flower above AMSTERDAM text
  const markSize = 54;
  const mark = await sharp(DOGWOOD)
    .resize(markSize, markSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  // Cover old flower with white then place dogwood — measured from sale graphic corner
  const cover = await sharp({
    create: { width: 70, height: 70, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 255 } },
  })
    .png()
    .toBuffer();
  composites.push({ input: cover, left: 430, top: 980 });
  composites.push({ input: mark, left: 438, top: 988 });

  await sharp(src).composite(composites).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  console.log("wrote", dest);
}

await patchPink(
  "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Social-Media.jpg",
);

await patchPhoneManual(
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
);

await sharp("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg")
  .resize({ width: 750 })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg");
await sharp("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg")
  .resize({ width: 360 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg");

console.log("done");
