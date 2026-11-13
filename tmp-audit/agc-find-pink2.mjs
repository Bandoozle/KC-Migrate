import sharp from "sharp";

const src = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

const regions = [
  [100, 70, 100, 100],
  [520, 60, 120, 100],
  [1140, 60, 120, 100],
  [250, 420, 120, 100],
];

for (const [left, top, w, h] of regions) {
  const hist = new Map();
  let pinkish = 0;
  for (let y = top; y < top + h; y++) {
    for (let x = left; x < left + w; x++) {
      const i = (y * width + x) * 4;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const key = `${(r / 32) | 0},${(g / 32) | 0},${(b / 32) | 0}`;
      hist.set(key, (hist.get(key) || 0) + 1);
      if (r > 150 && r > g && b > 60 && g < 180) pinkish++;
    }
  }
  console.log("\nregion", left, top, "pinkish", pinkish);
  [...hist.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([k, v]) => console.log(v, k));
}

// Also dump exact RGBA at known centers
for (const [x, y] of [
  [140, 114],
  [558, 144],
  [576, 94],
  [612, 138],
  [1184, 98],
  [294, 456],
  [338, 480],
]) {
  const i = (y * width + x) * 4;
  console.log("px", x, y, data[i], data[i + 1], data[i + 2]);
}
