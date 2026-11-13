import sharp from "sharp";
import fs from "node:fs";

/** Dark wordmarks on transparent, matching the style of /images/brands/*.png */
const maviSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="200" viewBox="0 0 640 200">
  <text x="320" y="138" text-anchor="middle" font-family="Arial Black, Impact, Arial, sans-serif" font-size="112" font-weight="900" letter-spacing="-4" fill="#141414">mavi</text>
</svg>`;

const arcteryxSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="780" height="200" viewBox="0 0 780 200">
  <text x="390" y="128" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" letter-spacing="8" fill="#141414">ARC'TERYX</text>
</svg>`;

await sharp(Buffer.from(maviSvg)).png().toFile("public/images/brands/mavi.png");
await sharp(Buffer.from(arcteryxSvg)).png().toFile("public/images/brands/arcteryx.png");

for (const name of ["mavi", "arcteryx"]) {
  const path = `public/images/brands/${name}.png`;
  const meta = await sharp(path).metadata();
  console.log(name, meta.width, meta.height, fs.statSync(path).size);
}
