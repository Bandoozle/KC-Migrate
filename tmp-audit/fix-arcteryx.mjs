import sharp from "sharp";

const src = "tmp-audit/arcteryx-wiki-fresh.png";

// Full stacked lockup (fossil over wordmark), black on transparent — official mark
await sharp(src)
  .trim({ threshold: 10 })
  .resize({ width: 960, withoutEnlargement: false })
  .png()
  .toFile("public/images/brands/arcteryx-fossil.png");

// Also keep a horizontal wordmark backup out of the wall path
const meta = await sharp("public/images/brands/arcteryx-fossil.png").metadata();
console.log("wrote fossil lockup", meta.width, meta.height);

// Extract fossil-only for crest-style cells: top ~62% of stacked logo
const h = meta.height;
const fossilH = Math.round(h * 0.62);
await sharp("public/images/brands/arcteryx-fossil.png")
  .extract({ left: 0, top: 0, width: meta.width, height: fossilH })
  .trim({ threshold: 10 })
  .png()
  .toFile("public/images/brands/arcteryx-bird.png");

const bird = await sharp("public/images/brands/arcteryx-bird.png").metadata();
console.log("wrote bird", bird.width, bird.height);

// Preview on white
await sharp("public/images/brands/arcteryx-fossil.png")
  .flatten({ background: "#ffffff" })
  .jpeg({ quality: 95 })
  .toFile("tmp-audit/arcteryx-preview-lockup.jpg");
await sharp("public/images/brands/arcteryx-bird.png")
  .flatten({ background: "#ffffff" })
  .jpeg({ quality: 95 })
  .toFile("tmp-audit/arcteryx-preview-bird.jpg");
