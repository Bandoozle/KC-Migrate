import sharp from "sharp";

const src = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const pts = [
  [140, 114],
  [575, 125],
  [1184, 98],
  [320, 468],
  [1268, 126],
  [1000, 100],
  [700, 400],
  [1350, 500],
];
for (const [x, y] of pts) {
  const left = Math.max(0, x - 50);
  const top = Math.max(0, y - 50);
  await sharp(src)
    .extract({ left, top, width: 100, height: 100 })
    .jpeg({ quality: 95 })
    .toFile(`tmp-audit/agc-m-${x}-${y}.jpg`);
}
console.log("ok");
