import fs from "fs";
import sharp from "sharp";

fs.mkdirSync("tmp-audit/cb-img", { recursive: true });
const known = [
  "https://staging.kosick.com/wp-content/uploads/2022/01/Motor-Court.webp",
  "https://staging.kosick.com/wp-content/uploads/2023/06/Trane_WRT_HeatUnit_Shot3_0232_251022133344-e1686845864632.jpg",
  "https://staging.kosick.com/wp-content/uploads/2023/06/product-packaging.jpg",
  "https://staging.kosick.com/wp-content/uploads/2023/06/business-cards-printing.jpg",
  "https://staging.kosick.com/wp-content/uploads/2023/06/print-ads.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/social-media-engagement.jpg",
];

const found = new Map();
for (const term of ["brand", "branding", "logo", "packaging", "identity", "business card", "stationery", "rebrand", "mockup", "signage", "billboard", "collateral", "brochure", "print"]) {
  const res = await fetch(`https://staging.kosick.com/wp-json/wp/v2/media?search=${encodeURIComponent(term)}&per_page=40&_fields=source_url,alt_text,title,media_details`);
  if (!res.ok) continue;
  for (const item of await res.json()) {
    const md = item.media_details ?? {};
    found.set(item.source_url, `${md.width}x${md.height} | ${item.title?.rendered} | ${item.alt_text}`);
  }
}
console.log("--- MEDIA SEARCH ---");
for (const [src, info] of found) console.log(src.replace("https://staging.kosick.com/wp-content/uploads/", ""), "|", info);

const contact = [];
for (const src of known) {
  const name = src.split("/").pop().replace(/\.\w+$/, "");
  const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log("KNOWN", name, `${meta.width}x${meta.height}`);
  const out = `tmp-audit/cb-img/${name}.jpg`;
  await sharp(buf).resize({ width: 640 }).jpeg({ quality: 78 }).toFile(out);
  contact.push(out);
}
