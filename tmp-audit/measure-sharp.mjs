import sharp from "sharp";

const urls = [
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-social-media-marketing.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-branding-marketing.jpg",
  "https://staging.kosick.com/wp-content/uploads/2026/06/golf-course-marketing-food-beverage.jpg",
  "http://127.0.0.1:3001/_next/image/?url=https%3A%2F%2Fstaging.kosick.com%2Fwp-content%2Fuploads%2F2026%2F06%2Fgolf-social-media-marketing.jpg&w=1920&q=75",
  "http://127.0.0.1:3001/_next/image/?url=https%3A%2F%2Fstaging.kosick.com%2Fwp-content%2Fuploads%2F2026%2F06%2Fgolf-course-branding-marketing.jpg&w=1280&q=75",
];

for (const url of urls) {
  const response = await fetch(url);
  const buf = Buffer.from(await response.arrayBuffer());
  const meta = await sharp(buf).metadata();
  console.log(response.status, meta.format, meta.width, meta.height, "orient", meta.orientation, url.slice(0, 120));
}
