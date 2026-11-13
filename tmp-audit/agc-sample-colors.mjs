import sharp from "sharp";

const src = "public/wp-content/uploads/2026/08/Social-Media.old-logo.bak.jpg";
const { data } = await sharp(src)
  .extract({ left: 110, top: 80, width: 80, height: 80 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const hist = new Map();
for (let i = 0; i < data.length; i += 4) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2],
    a = data[i + 3];
  if (a < 200) continue;
  const key = `${(r / 16) | 0},${(g / 16) | 0},${(b / 16) | 0}`;
  hist.set(key, (hist.get(key) || 0) + 1);
}
[...hist.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([k, v]) => console.log(v, k));
