import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("tmp-audit/outdoor-img", { recursive: true });
const urls = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      "2024/03/digital-superboard.webp",
      "2026/06/transit-out-of-home-advertising-1.jpg",
      "2026/06/billboard-2.jpg",
      "2026/06/outdoor-advertising.jpg",
      "2023/07/home-services-billboards.jpg",
      "2024/03/billboards.webp",
      "2023/07/billboards-scaled.png",
      "2023/07/smartmockups_ljx6qkvg-scaled.jpg",
      "2026/06/hvac-billboard-advertising.jpg",
      "2026/06/arcteryx-billboard-advertising.jpg",
      "2026/01/outdoor-billboard-advertising.jpg",
      "2024/03/billboard-advertising.webp",
      "2023/09/outdoor-advertising-scaled.jpg",
      "2023/07/outdoor-advertising-1-scaled.jpg",
      "2024/03/transit-shelter-ads.webp",
      "2024/03/transit-shelter.webp",
      "2024/03/tsa.webp",
      "2023/06/outdoor-tsa.jpg",
      "2025/07/outdoor-advertising.webp",
      "2026/01/outdoor-advertising.jpg",
      "2023/07/outdoor-advertising.jpg",
      "2025/07/billboard-dimensions.webp",
    ];
for (const u of urls) {
  const url = u.startsWith("http") ? u : `https://staging.kosick.com/wp-content/uploads/${u}`;
  const r = await fetch(url);
  if (!r.ok) { console.log(r.status, url); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  const name = url.split("/uploads/")[1].replace(/\//g, "_").replace(/\.\w+$/, "");
  const meta = await sharp(buf).metadata();
  await sharp(buf).resize({ width: 640 }).jpeg({ quality: 70 }).toFile(`tmp-audit/outdoor-img/${name}.jpg`);
  console.log(`${meta.width}x${meta.height} ${name}`);
}
