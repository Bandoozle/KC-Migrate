import sharp from "sharp";
import fs from "node:fs";

async function wikiThumb(title) {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=pageimages&format=json&pithumbsize=1000&origin=*";
  const res = await fetch(url, {
    headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
  });
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  return page?.thumbnail?.source || null;
}

async function savePng(srcUrl, outPath) {
  const res = await fetch(srcUrl, {
    headers: { "User-Agent": "KosickWebsiteBot/1.0 (local asset prep)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${srcUrl} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf).png().toFile(outPath);
  const meta = await sharp(outPath).metadata();
  console.log("saved", outPath, meta.width, meta.height);
}

const mavi = await wikiThumb("Mavi (company)");
const arc = await wikiThumb("Arc'teryx");
console.log({ mavi, arc });

if (mavi) await savePng(mavi, "public/images/brands/mavi-wiki.png");
if (arc) await savePng(arc, "public/images/brands/arcteryx-wiki.png");
