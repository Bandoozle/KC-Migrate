import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("tmp-audit/radio-img", { recursive: true });
const urls = [
  "https://staging.kosick.com/wp-content/uploads/2026/06/radio-advertising.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/radio-streaming-advertising.jpg",
  "https://staging.kosick.com/wp-content/uploads/2024/03/podcast.webp",
  "https://staging.kosick.com/wp-content/uploads/2024/03/radio-1.webp",
  "https://staging.kosick.com/wp-content/uploads/2021/07/audio-recording.jpg",
];
for (const u of urls) {
  const r = await fetch(u);
  const b = Buffer.from(await r.arrayBuffer());
  const name = u.split("/").pop();
  writeFileSync(`tmp-audit/radio-img/${name}`, b);
  console.log(name, r.status, b.length);
}
