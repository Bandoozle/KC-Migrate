import sharp from "sharp";

const base = "https://staging.kosick.com/wp-content/uploads/";
const list = [
  "2020/12/kc-branding.jpg",
  "2026/06/corporate-branding.jpg",
  "2025/08/home-services-lead-generation-1.webp",
  "2026/06/kosick-communications-branding.jpg",
  "2025/07/branding-agency.webp",
  "2023/06/MBYMockupcards2.jpeg",
];
const W = 760;
const H = 560;
const cols = 2;
const tiles = [];
for (const [i, path] of list.entries()) {
  const res = await fetch(base + path);
  console.log(path, res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log(" ", meta.width, meta.height);
  const img = await sharp(buf).resize(W, H, { fit: "contain", background: "#222" }).toBuffer();
  tiles.push({ input: img, left: (i % cols) * W, top: Math.floor(i / cols) * H });
}
await sharp({ create: { width: W * cols, height: H * Math.ceil(list.length / cols), channels: 3, background: "#111" } })
  .composite(tiles)
  .jpeg({ quality: 82 })
  .toFile("tmp-audit/cb-img/sheet2.jpg");
