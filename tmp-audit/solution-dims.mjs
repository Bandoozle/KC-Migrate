const files = [
  "2026/06/social-media-content-marketing-1.jpg",
  "2026/06/tv-advertising.jpg",
  "2025/08/home-services-lead-generation-1.webp",
  "2026/06/connected-tv-streaming.jpg",
  "2026/02/media-buying.jpg",
  "2026/06/radio-streaming-advertising.jpg",
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

function webpSize(buf) {
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    };
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

for (const file of files) {
  const url = `https://staging.kosick.com/wp-content/uploads/${file}`;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const size = file.endsWith(".webp") ? webpSize(buf) : jpegSize(buf);
  console.log(file, size);
}
