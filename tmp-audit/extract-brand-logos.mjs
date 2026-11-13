import sharp from "sharp";

const maviScene = "public/images/connected-tv/mavi-living-room-day.jpg";
const arcScene = "public/wp-content/uploads/2026/06/arcteryx-billboard-advertising.jpg";
const maviOoh = "public/images/home/out-of-home-mavi-canada-place.jpg";

for (const path of [maviScene, arcScene, maviOoh]) {
  const meta = await sharp(path).metadata();
  console.log(path, meta.width, meta.height);
}

// Try a few crops of likely logo regions for visual QA later
await sharp(maviScene)
  .extract({ left: Math.floor(0.62 * 1600), top: Math.floor(0.12 * 1067), width: 280, height: 120 })
  .png()
  .toFile("tmp-audit/mavi-crop-try.png")
  .catch(async () => {
    const m = await sharp(maviScene).metadata();
    await sharp(maviScene)
      .extract({
        left: Math.floor(m.width * 0.58),
        top: Math.floor(m.height * 0.08),
        width: Math.floor(m.width * 0.2),
        height: Math.floor(m.height * 0.1),
      })
      .png()
      .toFile("tmp-audit/mavi-crop-try.png");
  });

const m = await sharp(maviScene).metadata();
await sharp(maviScene)
  .extract({
    left: Math.floor(m.width * 0.55),
    top: Math.floor(m.height * 0.06),
    width: Math.floor(m.width * 0.22),
    height: Math.floor(m.height * 0.12),
  })
  .png()
  .toFile("tmp-audit/mavi-crop-try.png");
console.log("mavi crop ok");

const a = await sharp(arcScene).metadata();
await sharp(arcScene)
  .extract({
    left: Math.floor(a.width * 0.55),
    top: Math.floor(a.height * 0.35),
    width: Math.floor(a.width * 0.35),
    height: Math.floor(a.height * 0.2),
  })
  .png()
  .toFile("tmp-audit/arcteryx-crop-try.png");
console.log("arcteryx crop ok", a.width, a.height);
