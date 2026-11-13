import sharp from "sharp";

const path =
  "C:/Users/smarc/.cursor/projects/c-Users-smarc-OneDrive-Desktop-Projects-Kosick-Website/assets/image-c270db09-d72f-4fc0-b065-f829d5988e02.png";
const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
const at = (x, y) => {
  const i = (y * info.width + x) * info.channels;
  return [data[i], data[i + 1], data[i + 2]];
};
const dist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const paper = [243, 242, 237];

function band(y0, y1, label) {
  const hits = [];
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < 620; x++) {
      const c = at(x, y);
      const d = dist(c, paper);
      if (d > 20) hits.push({ x, y, c, d });
    }
  }
  hits.sort((a, b) => b.d - a.d);
  const top = hits.slice(0, 100);
  const avg = top.length
    ? top.reduce((a, h) => [a[0] + h.c[0], a[1] + h.c[1], a[2] + h.c[2]], [0, 0, 0]).map((v) => Math.round(v / top.length))
    : null;
  console.log(label, "hits", hits.length, "strongest", hits[0], "avg", avg);
}

band(0, 20, "title-clip");
band(20, 50, "title-lower-or-gap");
band(50, 100, "lead");
band(100, 140, "above-tabs");
