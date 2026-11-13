import sharp from "sharp";

const AVATAR_SRC = "tmp-audit/agc-avatar.png";

async function makeAvatar(size) {
  const mask = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/>
</svg>`);
  return sharp(AVATAR_SRC)
    .resize(size, size, { fit: "cover" })
    .composite([{ input: await sharp(mask).png().toBuffer(), blend: "dest-in" }])
    .png()
    .toBuffer();
}

function isRingColor(r, g, b) {
  // IG story ring: orange / magenta / pink
  const orange = r > 180 && g > 40 && g < 190 && b < 120 && r > g + 20 && r - b > 60;
  const magenta = r > 160 && b > 80 && g < 140 && r - g > 30 && b - g > 10;
  return orange || magenta;
}

function isFlowerish(r, g, b) {
  // old pink/orange flower interior (not pure white)
  if (r > 230 && g > 230 && b > 230) return false;
  const warm = r > 160 && r > g && r > b - 30 && g < 200;
  const green = g > 70 && g > r + 10 && g > b + 5 && r < 170;
  return warm || green;
}

async function refineCenter(path, guess, search = 18) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  let best = null;
  for (let dy = -search; dy <= search; dy++) {
    for (let dx = -search; dx <= search; dx++) {
      const cx = Math.round(guess.cx + dx);
      const cy = Math.round(guess.cy + dy);
      for (const radius of guess.radii) {
        if (cx - radius < 1 || cy - radius < 1 || cx + radius >= width - 1 || cy + radius >= height - 1) continue;
        let ring = 0,
          ringN = 0,
          flower = 0,
          flowerN = 0,
          white = 0;
        for (let a = 0; a < 36; a++) {
          const ang = (a / 36) * Math.PI * 2;
          const rx = Math.round(cx + Math.cos(ang) * radius);
          const ry = Math.round(cy + Math.sin(ang) * radius);
          const i = (ry * width + rx) * 4;
          ringN++;
          if (isRingColor(data[i], data[i + 1], data[i + 2])) ring++;
        }
        if (ring / ringN < 0.22) continue;
        for (let a = 0; a < 24; a++) {
          const ang = (a / 24) * Math.PI * 2;
          const rr = radius * 0.45;
          const rx = Math.round(cx + Math.cos(ang) * rr);
          const ry = Math.round(cy + Math.sin(ang) * rr);
          const i = (ry * width + rx) * 4;
          flowerN++;
          const r = data[i],
            g = data[i + 1],
            b = data[i + 2];
          if (isFlowerish(r, g, b)) flower++;
          if (r > 225 && g > 225 && b > 225) white++;
        }
        if (flower < 1 && white < 2) continue;
        const score = ring / ringN + flower * 0.08 + white * 0.01;
        if (!best || score > best.score) best = { cx, cy, radius, score };
      }
    }
  }
  return best;
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
}

const socialSrc = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const phoneSrc = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg";

const socialGuesses = [
  { cx: 145, cy: 100, radii: [18, 20, 22, 24, 26] },
  { cx: 575, cy: 120, radii: [18, 20, 22, 24, 26, 28] },
  { cx: 1184, cy: 98, radii: [18, 20, 22, 24, 26] },
  { cx: 335, cy: 480, radii: [16, 18, 20, 22, 24] },
];

const socialPlacements = [];
for (const g of socialGuesses) {
  const hit = await refineCenter(socialSrc, g, 28);
  if (!hit) throw new Error(`No avatar near ${g.cx},${g.cy}`);
  socialPlacements.push({ cx: hit.cx, cy: hit.cy, size: hit.radius * 2 + 10 });
  console.log("social", hit);
}

const phoneGuesses = [
  { cx: 187, cy: 329, radii: [22, 24, 26, 28] },
  { cx: 679, cy: 184, radii: [18, 20, 22, 24] },
  { cx: 698, cy: 760, radii: [18, 20, 22, 24] },
];
const phonePlacements = [];
for (const g of phoneGuesses) {
  const hit = await refineCenter(phoneSrc, g, 20);
  if (!hit) throw new Error(`No phone avatar near ${g.cx},${g.cy}`);
  phonePlacements.push({ cx: hit.cx, cy: hit.cy, size: hit.radius * 2 + 10 });
  console.log("phone", hit);
}

await apply(socialSrc, "public/wp-content/uploads/2026/08/Social-Media.jpg", socialPlacements);
await apply(phoneSrc, "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg", phonePlacements);

const phoneOut = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg";
const socialOut = "public/wp-content/uploads/2026/08/Social-Media.jpg";
await sharp(phoneOut).resize({ width: 750 }).jpeg({ quality: 90, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg");
await sharp(phoneOut).resize({ width: 360 }).jpeg({ quality: 88, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg");
await sharp(socialOut).resize({ width: 750 }).jpeg({ quality: 90, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Social-Media-750x422.jpg");

for (const p of socialPlacements) {
  const left = Math.max(0, Math.round(p.cx - 45));
  const top = Math.max(0, Math.round(p.cy - 45));
  await sharp(socialOut)
    .extract({ left, top, width: 90, height: 90 })
    .jpeg({ quality: 95 })
    .toFile(`tmp-audit/qa2-s-${Math.round(p.cx)}.jpg`);
}
for (const p of phonePlacements) {
  const left = Math.max(0, Math.round(p.cx - 45));
  const top = Math.max(0, Math.round(p.cy - 45));
  await sharp(phoneOut)
    .extract({ left, top, width: 90, height: 90 })
    .jpeg({ quality: 95 })
    .toFile(`tmp-audit/qa2-p-${Math.round(p.cx)}.jpg`);
}

console.log("done");
