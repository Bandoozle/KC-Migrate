import sharp from "sharp";
import fs from "node:fs";

const DOGWOOD = "tmp-audit/agc-Favicon_Dogwood.png";

async function makeAvatar(size) {
  const ring = Math.max(2, Math.round(size * 0.04));
  const inner = size - ring * 2;
  const iconSize = Math.round(inner * 0.72);
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#e87722"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ring}" fill="#ffffff"/>
</svg>`);
  const icon = await sharp(DOGWOOD)
    .resize(iconSize, iconSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  return sharp(svg)
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toBuffer();
}

/** Detect near-circular avatar blobs that look like the old pink flower logo. */
async function findAvatarCenters(path, opts = {}) {
  const { maxDim = 1400 } = opts;
  const meta = await sharp(path).metadata();
  const scale = Math.min(1, maxDim / Math.max(meta.width, meta.height));
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);
  const { data, info } = await sharp(path)
    .resize(width, height)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Pink/magenta flower pixels typical of old AGC avatar
  const mask = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;
      // pink/magenta petal OR orange ring around avatar
      const pink = r > 180 && g < 140 && b > 120 && r > g + 40;
      const orangeRing = r > 180 && g > 90 && g < 170 && b < 90 && r > b + 80;
      if (pink || orangeRing) mask[y * width + x] = 1;
    }
  }

  // Connected components (4-neighbor), keep compact blobs in avatar size range
  const visited = new Uint8Array(width * height);
  const blobs = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x;
      if (!mask[start] || visited[start]) continue;
      const stack = [start];
      visited[start] = 1;
      let minX = x,
        maxX = x,
        minY = y,
        maxY = y,
        count = 0;
      while (stack.length) {
        const idx = stack.pop();
        const cx = idx % width;
        const cy = (idx / width) | 0;
        count++;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
        for (const [dx, dy] of dirs) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nidx = ny * width + nx;
          if (!mask[nidx] || visited[nidx]) continue;
          visited[nidx] = 1;
          stack.push(nidx);
        }
      }
      const bw = maxX - minX + 1;
      const bh = maxY - minY + 1;
      const aspect = bw / bh;
      const fill = count / (bw * bh);
      // Avatar-ish: roughly square, not huge, reasonably filled
      if (bw < 14 || bh < 14) continue;
      if (bw > width * 0.18 || bh > height * 0.18) continue;
      if (aspect < 0.7 || aspect > 1.4) continue;
      if (fill < 0.12) continue;
      blobs.push({
        cx: ((minX + maxX) / 2) / scale,
        cy: ((minY + maxY) / 2) / scale,
        size: Math.max(bw, bh) / scale,
        count,
        fill,
      });
    }
  }

  // Deduplicate overlapping detections
  blobs.sort((a, b) => b.count - a.count);
  const kept = [];
  for (const blob of blobs) {
    if (kept.some((k) => Math.hypot(k.cx - blob.cx, k.cy - blob.cy) < blob.size * 0.6)) continue;
    kept.push(blob);
  }
  return { meta, kept };
}

async function patchImage(srcPath, destPath, avatarScale = 1.05) {
  const { meta, kept } = await findAvatarCenters(srcPath);
  console.log(srcPath, "avatars", kept.map((b) => ({ cx: Math.round(b.cx), cy: Math.round(b.cy), size: Math.round(b.size) })));
  if (kept.length === 0) {
    console.warn("No avatars found for", srcPath);
    return;
  }

  const composites = [];
  for (const blob of kept) {
    const size = Math.max(24, Math.round(blob.size * avatarScale));
    const avatar = await makeAvatar(size);
    composites.push({
      input: avatar,
      left: Math.round(blob.cx - size / 2),
      top: Math.round(blob.cy - size / 2),
    });
  }

  await sharp(srcPath).composite(composites).jpeg({ quality: 90, mozjpeg: true }).toFile(destPath);
  console.log("wrote", destPath, composites.length, "avatars");
}

// Preview avatar
await sharp(await makeAvatar(256)).toFile("tmp-audit/agc-avatar.png");
await sharp(DOGWOOD)
  .resize(400, 400, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: "#ffffff" })
  .png()
  .toFile("tmp-audit/agc-dogwood-on-white.png");

const targets = [
  {
    src: "public/wp-content/uploads/2026/08/Social-Media.jpg",
    dest: "public/wp-content/uploads/2026/08/Social-Media.jpg",
  },
  {
    src: "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
    dest: "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
  },
];

// Backup originals once
for (const t of targets) {
  const bak = t.src.replace(/\.jpg$/i, ".old-logo.bak.jpg");
  if (!fs.existsSync(bak)) fs.copyFileSync(t.src, bak);
}

for (const t of targets) {
  await patchImage(t.src.replace(/\.jpg$/i, ".old-logo.bak.jpg"), t.dest);
}

console.log("done");
