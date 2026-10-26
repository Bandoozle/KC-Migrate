import fs from "fs";
import path from "path";

const urls = [
  "https://staging.kosick.com/wp-content/uploads/2025/07/creative-and-production.webp",
  "https://staging.kosick.com/wp-content/uploads/2023/06/Trane_WRT_HeatUnit_Shot3_0232_251022133344-e1686845864632.jpg",
  "https://staging.kosick.com/wp-content/uploads/2025/12/trane-hvac-advertising.jpeg",
  "https://staging.kosick.com/wp-content/uploads/2026/09/Television-Advertising.jpg",
  "https://staging.kosick.com/wp-content/uploads/2024/03/television-ads.webp",
  "https://staging.kosick.com/wp-content/uploads/2024/03/digital-tv-ads.webp",
  "https://staging.kosick.com/wp-content/uploads/2026/06/television-media-buying.jpg",
  "https://staging.kosick.com/wp-content/uploads/2025/12/television-advertising-media-buying.jpg",
  "https://staging.kosick.com/wp-content/uploads/2023/06/sportsnet-ads.jpg",
  "https://staging.kosick.com/wp-content/uploads/2024/08/sportsnet-advertising.webp",
  "https://staging.kosick.com/wp-content/uploads/2026/07/trane-web-1-mp4-image.jpg",
];

const dir = "tmp-audit/tv-candidates";
fs.mkdirSync(dir, { recursive: true });

for (const url of urls) {
  const name = decodeURIComponent(url.split("/").pop());
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  const file = path.join(dir, name);
  fs.writeFileSync(file, buffer);
  console.log(response.status, buffer.length, name);
}

const shotSearch = await fetch(
  "https://staging.kosick.com/wp-json/wp/v2/media?search=Shot&per_page=20&_fields=source_url,alt_text,mime_type",
);
const shots = await shotSearch.json();
console.log("\nSHOTS");
if (Array.isArray(shots)) {
  for (const item of shots) console.log(item.alt_text, "|", item.source_url);
}
