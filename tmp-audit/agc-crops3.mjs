import sharp from "sharp";

const src = "public/wp-content/uploads/2026/08/Garden-Centre-Social-Media.old-logo.bak.jpg";
const crops = [
  ["sale3", 200, 700, 420, 320],
  ["av-phone", 210, 250, 100, 100],
  ["av-ftop", 655, 145, 90, 90],
  ["av-fbot", 655, 690, 90, 90],
];
for (const [name, left, top, width, height] of crops) {
  await sharp(src).extract({ left, top, width, height }).jpeg({ quality: 95 }).toFile(`tmp-audit/agc-${name}.jpg`);
}
console.log("ok");
