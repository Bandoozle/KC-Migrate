const urls = [
  "https://staging.kosick.com/wp-content/uploads/2024/04/Web.webp",
  "https://staging.kosick.com/wp-content/uploads/2024/04/cityscape-of-capital-of-corfu-island-colorful-building-at-the-morning-corfu-island-greece.webp",
  "https://staging.kosick.com/wp-content/uploads/2023/06/DigitalLead_graphic-e1686855242864.png",
  "https://staging.kosick.com/wp-content/uploads/2026/03/website-development-e-commerce.jpg",
];

function dims(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) {
    return { type: "png", w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 8) {
      if (buf[i] !== 0xff) break;
      const marker = buf[i + 1];
      const size = buf.readUInt16BE(i + 2);
      if (marker === 0xc0 || marker === 0xc2) {
        return { type: "jpeg", h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      i += 2 + size;
    }
  }
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const format = buf.toString("ascii", 12, 16);
    if (format === "VP8X") {
      const w = 1 + buf.readUIntLE(24, 3);
      const h = 1 + buf.readUIntLE(27, 3);
      return { type: "webp", w, h };
    }
    if (format === "VP8 ") {
      return { type: "webp", w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    }
    if (format === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { type: "webp", w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    return { type: "webp", format };
  }
  return { type: "unknown", head: buf.subarray(0, 16).toString("hex") };
}

for (const url of urls) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(res.status, buf.length, JSON.stringify(dims(buf)), url.split("/").pop());
}
