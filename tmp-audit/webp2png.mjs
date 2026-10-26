import sharp from "sharp";
for (const name of ["podcast", "radio-1"]) {
  const meta = await sharp(`tmp-audit/radio-img/${name}.webp`).metadata();
  console.log(name, meta.width, meta.height);
  await sharp(`tmp-audit/radio-img/${name}.webp`).resize({ width: 900 }).png().toFile(`tmp-audit/radio-img/${name}.png`);
}
for (const name of ["radio-advertising.jpg", "radio-streaming-advertising.jpg", "audio-recording.jpg"]) {
  const meta = await sharp(`tmp-audit/radio-img/${name}`).metadata();
  console.log(name, meta.width, meta.height);
}
