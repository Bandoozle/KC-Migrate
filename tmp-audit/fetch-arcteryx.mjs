import sharp from "sharp";
import fs from "node:fs";

const candidates = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Arc%27teryx_logo.svg/500px-Arc%27teryx_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Arcteryx_logo.svg/500px-Arcteryx_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Arc%27teryx_Bird.svg/320px-Arc%27teryx_Bird.svg.png",
];

for (const url of candidates) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
      redirect: "follow",
    });
    console.log(res.status, url);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    const out = "public/images/brands/arcteryx.png";
    await sharp(buf)
      .ensureAlpha()
      .resize({ width: 780, height: 240, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(out);
    console.log("saved", (await sharp(out).metadata()).width);
    process.exit(0);
  } catch (e) {
    console.log("fail", e.message);
  }
}

// Fallback: bird + wordmark SVG
console.log("using svg fallback");
await import("./make-arcteryx-logo.mjs");
