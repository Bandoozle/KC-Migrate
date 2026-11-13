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
  console.log(
    "wrote",
    dest,
    placements.map((p) => ({ x: Math.round(p.cx), y: Math.round(p.cy), s: Math.round(p.size) })),
  );
}

const socialSrc = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const phoneSrc = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg";

await apply(socialSrc, "public/wp-content/uploads/2026/08/Social-Media.jpg", [
  { cx: 140, cy: 114, size: 48 },
  { cx: 575, cy: 125, size: 50 },
  { cx: 1184, cy: 98, size: 48 },
  { cx: 330, cy: 475, size: 46 },
]);

await apply(phoneSrc, "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg", [
  { cx: 187, cy: 329, size: 52 },
  { cx: 679, cy: 184, size: 44 },
  { cx: 698, cy: 760, size: 44 },
]);

const phoneOut = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.jpg";
await sharp(phoneOut)
  .resize({ width: 750 })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-750x937.jpg");
await sharp(phoneOut)
  .resize({ width: 360 })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/wp-content/uploads/2026/08/Garden-Centre-Social-Media-360x450.jpg");

const socialOut = "public/wp-content/uploads/2026/08/Social-Media.jpg";
for (const [label, file, left, top, w, h] of [
  ["qa-s1", socialOut, 110, 80, 90, 80],
  ["qa-s2", socialOut, 545, 90, 90, 80],
  ["qa-s3", socialOut, 1154, 65, 90, 80],
  ["qa-s4", socialOut, 300, 445, 90, 80],
  ["qa-p1", phoneOut, 155, 295, 90, 80],
  ["qa-p2", phoneOut, 650, 155, 90, 80],
  ["qa-p3", phoneOut, 670, 730, 90, 80],
  ["qa-sale", phoneOut, 430, 740, 160, 140],
]) {
  await sharp(file).extract({ left, top, width: w, height: h }).jpeg({ quality: 95 }).toFile(`tmp-audit/${label}.jpg`);
}

console.log("done");
