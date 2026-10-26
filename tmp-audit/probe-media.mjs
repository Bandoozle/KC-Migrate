const urls = [
  "https://www.kosick.com/wp-content/uploads/2024/03/resort-marketing.mp4",
  "https://www.kosick.com/wp-content/uploads/2024/04/cityscape-of-capital-of-corfu-island-colorful-building-at-the-morning-corfu-island-greece.webp",
  "https://www.kosick.com/wp-content/uploads/2024/04/cityscape-of-capital-of-corfu-island-colorful-building-at-the-morning-corfu-island-greece.jpg",
  "https://www.kosick.com/wp-content/uploads/2023/07/smartmockups_ljx6qkvg-scaled.jpg",
  "https://www.kosick.com/wp-content/uploads/2023/07/smartmockups_ljx6qkvg.jpg",
  "https://www.kosick.com/wp-content/uploads/2024/03/Screen-Recording-2024-03-14-at-9.30.00-AM.mov",
  "https://www.kosick.com/wp-content/uploads/2024/03/screen-recording-2024-03-14-at-9.30.00-am-1.mp4",
  "https://staging.kosick.com/wp-content/uploads/2024/03/resort-marketing.mp4",
  "https://staging.kosick.com/wp-content/uploads/2023/07/smartmockups_ljx6qkvg.jpg",
  "https://staging.kosick.com/wp-content/uploads/2024/03/screen-recording-2024-03-14-at-9.30.00-am-1.mp4",
];
for (const url of urls) {
  const response = await fetch(url, { method: "HEAD" });
  console.log(response.status, response.headers.get("content-type"), url);
}
