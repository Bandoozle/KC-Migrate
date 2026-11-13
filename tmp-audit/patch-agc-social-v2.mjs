import sharp from "sharp";

const DOGWOOD = "tmp-audit/agc-Favicon_Dogwood.png";

async function makeAvatar(size) {
  const ring = Math.max(2, Math.round(size * 0.045));
  const iconSize = Math.round(size * 0.62);
  const svg = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 0.5}" fill="#e87722"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ring}" fill="#ffffff"/>
</svg>`);
  const icon = await sharp(DOGWOOD)
    .resize(iconSize, iconSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  // Circular crop of composite
  const composed = await sharp(svg)
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

function isOrange(r, g, b) {
  return r > 175 && g > 70 && g < 175 && b < 100 && r - b > 70 && r > g + 20;
}

function isPinkFlower(r, g, b) {
  // Old AGC avatar flower: magenta/pink petals
  return r > 170 && b > 100 && g < 150 && r > g + 30 && b > g + 10;
}

async function findAvatars(path) {
  const meta = await sharp(path).metadata();
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // Score candidate centers by looking for orange ring + pink-ish interior nearby
  const step = 2;
  const candidates = [];

  for (let y = 20; y < height - 20; y += step) {
    for (let x = 20; x < width - 20; x += step) {
      // Try radii typical for IG avatars in these comps
      for (const radius of [18, 22, 26, 30, 36, 44, 52, 64]) {
        if (x - radius < 2 || y - radius < 2 || x + radius >= width - 2 || y + radius >= height - 2) continue;

        let orange = 0;
        let ringSamples = 0;
        let pink = 0;
        let white = 0;
        let innerSamples = 0;

        // Sample ring
        for (let a = 0; a < 24; a++) {
          const ang = (a / 24) * Math.PI * 2;
          const rx = Math.round(x + Math.cos(ang) * radius);
          const ry = Math.round(y + Math.sin(ang) * radius);
          const i = (ry * width + rx) * 4;
          ringSamples++;
          if (isOrange(data[i], data[i + 1], data[i + 2])) orange++;
        }

        if (orange / ringSamples < 0.45) continue;

        // Sample interior
        for (let a = 0; a < 16; a++) {
          const ang = (a / 16) * Math.PI * 2;
          const rx = Math.round(x + Math.cos(ang) * radius * 0.45);
          const ry = Math.round(y + Math.sin(ang) * radius * 0.45);
          const i = (ry * width + rx) * 4;
          innerSamples++;
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          if (isPinkFlower(r, g, b)) pink++;
          if (r > 220 && g > 220 && b > 220) white++;
        }

        // Need either pink flower content or white field (logo on white)
        if (pink < 2 && white < 3) continue;

        candidates.push({
          cx: x,
          cy: y,
          radius,
          score: orange / ringSamples + pink * 0.15 + white * 0.05,
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  const kept = [];
  for (const c of candidates) {
    if (kept.some((k) => Math.hypot(k.cx - c.cx, k.cy - c.cy) < Math.max(k.radius, c.radius) * 1.2)) continue;
    kept.push(c);
    if (kept.length >= 8) break;
  }
  return { meta, kept };
}

async function patch(src, dest, expectedMin = 3) {
  const { kept } = await findAvatars(src);
  console.log(
    src,
    "found",
    kept.map((k) => ({ x: k.cx, y: k.cy, r: k.radius, s: +k.score.toFixed(2) })),
  );
  if (kept.length < expectedMin) {
    throw new Error(`Expected at least ${expectedMin} avatars in ${src}, found ${kept.length}`);
  }

  const composites = [];
  for (const k of kept) {
    const size = Math.round(k.radius * 2 * 1.08);
    const avatar = await makeAvatar(size);
    composites.push({
      input: avatar,
      left: Math.round(k.cx - size / 2),
      top: Math.round(k.cy - size / 2),
    });
  }

  await sharp(src).composite(composites).jpeg({ quality: 92, mozjpeg: true }).toFile(dest);
  console.log("patched", dest, composites.length);
}

await patch(
  "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Social-Media.jpg",
  5,
);
await patch(
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg",
  "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg",
  3,
);

// Also overwrite derived sizes if present
const variants = [
  ["public/wp-content/uploads/2026/08/Social-Media.jpg", null],
  ["public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg", 937],
  ["public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg", 750],
  ["public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg", 360],
];

for (const [path, w] of variants) {
  if (!w) continue;
  try {
    await sharp("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg")
      .resize({ width: w })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(path);
    console.log("resized", path);
  } catch (e) {
    console.log("skip", path, e.message);
  }
}

console.log("done");
