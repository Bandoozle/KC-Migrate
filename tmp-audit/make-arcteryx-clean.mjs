import sharp from "sharp";

/**
 * Clean Arc'teryx-style bird fossil + wordmark for the brand wall.
 * Drawn as a compact silhouette so it reads at logo-grid sizes.
 */
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="820" height="240" viewBox="0 0 820 240">
  <g fill="#141414">
    <!-- Bird fossil silhouette (facing right) -->
    <g transform="translate(28,34) scale(1.15)">
      <path d="M18 78c6-18 18-34 36-44 8-4 14-12 16-22 8 10 8 24 2 36 14-2 28 4 38 14-12-2-24 4-32 14 16 0 30 10 36 24-14-8-30-6-44 4 8 12 8 26 0 38-4-14-14-24-30-28 12 16 12 34 2 50-10-14-26-22-46-22 14 12 22 28 20 46-16-12-36-14-56-6 12 8 18 22 16 36-18-8-34-4-48 10 10 4 14 14 14 24-16-2-30 8-38 22 6-2 12 0 16 4-20 8-32 26-32 46 0-2 2-4 4-4-8 18-4 36 10 50-8-4-12-12-12-22 10 20 28 32 50 32-12-8-20-20-20-36 18 16 42 20 66 10-8-10-18-16-32-18 20 4 38-2 50-16-4-8-12-14-22-16 18 0 32-10 40-26-2-6-8-10-16-12 16-4 28-16 34-32-6-2-12-2-18 0 14-12 20-30 18-50-8 4-16 4-24 2 10-18 8-38-4-54-8 8-14 18-16 30-2-22-14-40-34-50 6 10 8 22 6 34-8-18-4-36 8-52z"/>
      <!-- rib / wing detail -->
      <path opacity="0.92" d="M70 54c8 2 14 8 18 16-6-2-12-2-18 0 4 8 4 16 0 24-6-4-12-6-20-6 6 8 8 18 4 28-8-4-16-4-24-2 6 10 6 20 0 30-10-6-20-8-32-6"/>
      <path opacity="0.9" d="M108 70c6 6 8 14 8 22-6-2-12-2-18 2 2 8 0 16-4 22"/>
      <!-- head / beak -->
      <path d="M132 42c8-2 16 2 22 8 2 4 0 8-4 10-6-2-12-2-16 2-2-8-4-14-2-20z"/>
      <!-- tail -->
      <path d="M12 120c-10 8-18 20-20 34 8-4 16-6 24-4-4-10-4-20-4-30z"/>
    </g>
    <text x="250" y="148" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-size="56" font-weight="700" letter-spacing="6">ARC'TERYX</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile("public/images/brands/arcteryx.png");
console.log("clean arcteryx written");
