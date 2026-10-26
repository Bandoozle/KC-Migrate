import { readFileSync } from "node:fs";

const html = readFileSync("tmp-parity/rest/golf-marketing.html", "utf8");
const urls = [...html.matchAll(/https?:\/\/[^"'\s>]+\.(?:jpe?g|webp|png|mp4)/gi)].map((match) =>
  match[0].replace(/&amp;/g, "&"),
);
const uniq = [...new Set(urls)].filter((url) => /golf|\.mp4/i.test(url));

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    const size = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + size;
  }
  return null;
}

function webpSize(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  const format = buf.toString("ascii", 8, 12);
  if (format !== "WEBP") return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  if (chunk === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
  }
  return null;
}

const candidates = [
  ...uniq,
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-branding-marketing.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-marketing-food-beverage.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-social-media-marketing.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-branding-marketing-1024x1536.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-branding-marketing-1140x1710.jpg",
  "https://www.kosick.com/wp-content/uploads/2026/06/golf-course-branding-marketing.jpg",
  "https://www.kosick.com/wp-content/uploads/2026/06/golf-social-media-marketing.jpg",
  "https://www.kosick.com/wp-content/uploads/2026/06/golf-course-marketing-food-beverage.jpg",
];

for (const url of [...new Set(candidates)]) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(response.status, url);
      continue;
    }
    const buf = Buffer.from(await response.arrayBuffer());
    const size = url.endsWith(".webp") ? webpSize(buf) : jpegSize(buf);
    console.log(size ? `${size.width}x${size.height}` : `bytes ${buf.length}`, buf.length, url);
  } catch (error) {
    console.log("ERR", url, error.message);
  }
}
