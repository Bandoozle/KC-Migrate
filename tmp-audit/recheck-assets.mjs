const urls = [
  "http://127.0.0.1:3010/corporate-events-group-travel/",
  "https://www.kosick.com/corporate-events-group-travel/",
  "https://staging.kosick.com/wp-content/uploads/2024/04/cityscape-of-capital-of-corfu-island-colorful-building-at-the-morning-corfu-island-greece.webp",
  "https://staging.kosick.com/wp-content/uploads/2023/07/smartmockups_ljx6qkvg-scaled.jpg",
  "https://staging.kosick.com/wp-content/uploads/2024/03/Screen-Recording-2024-03-14-at-9.30.00-AM.mov",
];
for (const url of urls) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(25000) });
    console.log(response.status, response.headers.get("content-type"), url);
  } catch (error) {
    console.log("ERR", error instanceof Error ? error.message : error, url);
  }
}
