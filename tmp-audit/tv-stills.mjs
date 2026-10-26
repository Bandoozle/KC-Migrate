import fs from "fs";
fs.mkdirSync("tmp-audit/tv-frames", { recursive: true });
const files = [
  ["sportsnet", "https://staging.kosick.com/wp-content/uploads/2023/06/Screen-Shot-2021-12-09-at-1.05.09-PM.jpg"],
  ["buying", "https://staging.kosick.com/wp-content/uploads/2026/06/tv-media-buying-1.jpg"],
  ["tvad", "https://staging.kosick.com/wp-content/uploads/2026/06/tv-advertising.jpg"],
];
for (const [name, url] of files) {
  const response = await fetch(url);
  const buf = Buffer.from(await response.arrayBuffer());
  const path = `tmp-audit/tv-frames/${name}.jpg`;
  fs.writeFileSync(path, buf);
  console.log(name, response.status, buf.length);
}
