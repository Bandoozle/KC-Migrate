import sharp from "sharp";

const src = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const { width, height } = await sharp(src).metadata();
console.log("size", width, height);

// Bottom-right nursery card — scan right half, lower half for circular avatars
const crops = [
  ["br1", 1050, 450, 200, 160],
  ["br2", 1150, 520, 200, 160],
  ["br3", 1250, 580, 200, 160],
  ["br4", 1100, 400, 250, 200],
  ["br5", 900, 550, 250, 200],
  ["br6", 1300, 650, 200, 180],
];
for (const [name, left, top, w, h] of crops) {
  const L = Math.min(left, width - w);
  const T = Math.min(top, height - h);
  await sharp(src)
    .extract({ left: L, top: T, width: w, height: h })
    .jpeg({ quality: 95 })
    .toFile(`tmp-audit/agc-${name}.jpg`);
  console.log(name, L, T);
}
