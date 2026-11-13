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
  const orange = r > 180 && g > 40 && g < 190 && b < 120 && r > g + 20 && r - b > 60;
  const magenta = r > 160 && b > 80 && g < 140 && r - g > 30 && b - g > 10;
  return orange || magenta;
}

function isFlowerish(r, g, b) {
  if (r > 230 && g > 230 && b > 230) return false;
  const warm = r > 160 && r > g && r > b - 30 && g < 200;
  const green = g > 70 && g > r + 10 && g > b + 5 && r < 170;
  return warm || green;
}

async function refineCenter(path, guess, search = 24) {
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
          white = 0;
        for (let a = 0; a < 36; a++) {
          const ang = (a / 36) * Math.PI * 2;
          const rx = Math.round(cx + Math.cos(ang) * radius);
          const ry = Math.round(cy + Math.sin(ang) * radius);
          const i = (ry * width + rx) * 4;
          ringN++;
          if (isRingColor(data[i], data[i + 1], data[i + 2])) ring++;
        }
        if (ring / ringN < 0.2) continue;
        for (let a = 0; a < 24; a++) {
          const ang = (a / 24) * Math.PI * 2;
          const rr = radius * 0.45;
          const rx = Math.round(cx + Math.cos(ang) * rr);
          const ry = Math.round(cy + Math.sin(ang) * rr);
          const i = (ry * width + rx) * 4;
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
  { cx: 145, cy: 100, radii: [18, 20, 22, 24] },
  { cx: 575, cy: 120, radii: [20, 22, 24, 26] },
  { cx: 1184, cy: 98, radii: [18, 20, 22, 24] },
  { cx: 335, cy: 480, radii: [16, 18, 20, 22] },
  { cx: 1240, cy: 500, radii: [16, 18, 20, 22, 24] }, // bottom-right nursery card
];

const socialPlacements = [];
for (const g of socialGuesses) {
  const hit = await refineCenter(socialSrc, g, 28);
  if (!hit) throw new Error(`No avatar near ${g.cx},${g.cy}`);
  // Cap radius so we don't oversize (previous pass grabbed r=28 on center)
  const radius = Math.min(hit.radius, 24);
  socialPlacements.push({ cx: hit.cx, cy: hit.cy, size: radius * 2 + 12 });
  console.log("social", hit, "→ size", radius * 2 + 12);
}

const phoneGuesses = [
  { cx: 187, cy: 329, radii: [20, 22, 24, 26] },
  { cx: 679, cy: 184, radii: [16, 18, 20, 22] },
  { cx: 698, cy: 760, radii: [16, 18, 20, 22] },
];
const phonePlacements = [];
for (const g of phoneGuesses) {
  const hit = await refineCenter(phoneSrc, g, 22);
  if (!hit) throw new Error(`No phone avatar near ${g.cx},${g.cy}`);
  const radius = Math.min(hit.radius, 26);
  phonePlacements.push({ cx: hit.cx, cy: hit.cy, size: radius * 2 + 12 });
  console.log("phone", hit, "→ size", radius * 2 + 12);
}

await apply(socialSrc, "public/wp-content/uploads/2026/08/Social-Media.jpg", socialPlacements);
await apply(phoneSrc, "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg", phonePlacements);

const phoneOut = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg";
const socialOut = "public/wp-content/uploads/2026/08/Social-Media.jpg";
await sharp(phoneOut).resize({ width: 750 }).jpeg({ quality: 90, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg");
await sharp(phoneOut).resize({ width: 360 }).jpeg({ quality: 88, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg");
await sharp(socialOut).resize({ width: 750 }).jpeg({ quality: 90, mozjpeg: true }).toFile("public/wp-content/uploads/2026/08/Social-Media-750x422.jpg");

for (const p of [...socialPlacements, ...phonePlacements]) {
  const left = Math.max(0, Math.round(p.cx - 40));
  const top = Math.max(0, Math.round(p.cy - 40));
  const file = p.cy > 600 && p.cx > 600 && p.cx < 800 ? phoneOut : p.cx < 900 || p.cy < 200 || p.cx > 1100 ? (p.cx > 400 && p.cy > 250 && p.cx < 250 ? phoneOut : socialOut) : socialOut;
}
// simpler QA crops
const qas = [
  ...socialPlacements.map((p, i) => ["s", socialOut, p, i]),
  ...phonePlacements.map((p, i) => ["p", phoneOut, p, i]),
];
for (const [tag, file, p, i] of qas) {
  const left = Math.max(0, Math.round(p.cx - 40));
  const top = Math.max(0, Math.round(p.cy - 40));
  await sharp(file)
    .extract({ left, top, width: 80, height: 80 })
    .jpeg({ quality: 95 })
    .toFile(`tmp-audit/qa3-${tag}${i}.jpg`);
}

await sharp(socialOut).resize({ width: 1000 }).jpeg({ quality: 88 }).toFile("tmp-audit/qa-full-social.jpg");
await sharp(phoneOut).resize({ width: 700 }).jpeg({ quality: 88 }).toFile("tmp-audit/qa-full-phone.jpg");
console.log("done");
