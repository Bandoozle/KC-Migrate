import sharp from "sharp";

const base = "https://staging.kosick.com/wp-content/uploads/";
const list = [
  "2026/06/corporate-branding.jpg",
  "2025/07/branding-agency.webp",
  "2023/06/kccardmockup4.jpg",
  "2023/06/MBYMockupcards2.jpeg",
  "2023/06/business-cards-printing.jpg",
  "2023/06/product-packaging.jpg",
  "2023/06/packaging.jpg",
  "2023/06/print-ads.jpg",
  "2023/06/Trane_WRT_HeatUnit_Shot3_0232_251022133344-e1686845864632.jpg",
  "2022/01/Motor-Court.webp",
  "2026/06/social-media-engagement.jpg",
  "2024/05/golf-ball-logos.webp",
  "2022/01/international-brands.webp",
  "2020/12/kc-branding.jpg",
  "2026/06/kosick-communications-branding.jpg",
  "2026/06/dental-clinic-branding.jpg",
];
const W = 420;
const H = 300;
const cols = 4;
const tiles = [];
for (const [i, path] of list.entries()) {
  const buf = Buffer.from(await (await fetch(base + path)).arrayBuffer());
  const img = await sharp(buf).resize(W, H - 24, { fit: "contain", background: "#222" }).toBuffer();
  const label = Buffer.from(
    `<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#000"/><text x="6" y="17" font-size="14" fill="#fff" font-family="Arial">${i + 1}. ${path.split("/").pop().slice(0, 48)}</text></svg>`,
  );
  tiles.push({ input: img, left: (i % cols) * W, top: Math.floor(i / cols) * H });
  tiles.push({ input: label, left: (i % cols) * W, top: Math.floor(i / cols) * H + H - 24 });
}
await sharp({ create: { width: W * cols, height: H * Math.ceil(list.length / cols), channels: 3, background: "#111" } })
  .composite(tiles)
  .jpeg({ quality: 80 })
  .toFile("tmp-audit/cb-img/sheet.jpg");
console.log("ok");
