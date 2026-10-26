import fs from "fs";

const files = [
  ["garden", "https://staging.kosick.com/wp-content/uploads/2026/07/Garden-Centre-Nursery-Marketing.jpg"],
  ["journey", "https://staging.kosick.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-21-2026-at-11_55_22-AM.jpg"],
  ["analytics", "https://staging.kosick.com/wp-content/uploads/2026/07/Email-Marketing-Canada.jpg"],
  ["hero", "https://staging.kosick.com/wp-content/uploads/2026/07/Email-Marketing.jpg"],
];

function jpegSize(buf) {
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

fs.mkdirSync("tmp-audit/email-assets", { recursive: true });
for (const [name, url] of files) {
  const response = await fetch(url);
  const buf = Buffer.from(await response.arrayBuffer());
  const ext = url.endsWith(".png") ? "png" : "jpg";
  const path = `tmp-audit/email-assets/${name}.${ext}`;
  if (response.ok) fs.writeFileSync(path, buf);
  console.log(name, response.status, buf.length, jpegSize(buf), path);
}
