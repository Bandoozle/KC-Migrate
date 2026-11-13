import sharp from "sharp";
import fs from "node:fs";

async function wikiImageUrl(title) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=imageinfo&iiprop=url&format=json&origin=*";
  const res = await fetch(url, {
    headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
  });
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

const titles = ["File:Arc'teryx logo (51888828933).jpg", "File:Arc'teryx logo (2026-02-27).jpg"];

for (const title of titles) {
  const src = await wikiImageUrl(title);
  console.log(title, src);
  if (!src) continue;
  const res = await fetch(src, {
    headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
  });
  if (!res.ok) {
    console.log("download fail", res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const rawPath = `tmp-audit/arcteryx-wiki-raw-${titles.indexOf(title)}.jpg`;
  fs.writeFileSync(rawPath, buf);
  const meta = await sharp(buf).metadata();
  console.log("meta", meta.width, meta.height);

  // Convert near-white background to transparent, keep dark mark
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum > 210) {
      data[i + 3] = 0;
    } else {
      // normalize to near-black for brand wall consistency
      data[i] = 20;
      data[i + 1] = 20;
      data[i + 2] = 20;
    }
  }

  const out = "public/images/brands/arcteryx.png";
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .resize({ width: 780, height: 240, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(out);
  console.log("saved", out, await sharp(out).metadata());
  break;
}
