const html = await (await fetch("http://127.0.0.1:3010/travel-marketing-canada/")).text();
const imgs = [...html.matchAll(/<img\b[^>]*src=["']([^"']+)["']/gi)].map((match) => match[1]);
console.log("images", imgs.length);
for (const src of imgs.slice(0, 12)) {
  try {
    const response = await fetch(src, { method: "HEAD" });
    console.log(response.status, src);
  } catch (error) {
    console.log("ERR", src, error instanceof Error ? error.message : error);
  }
}
const hvac = await (await fetch("http://127.0.0.1:3010/services/hvac-marketing/")).text();
const videos = [...hvac.matchAll(/<(?:iframe|video)\b[^>]*>/gi)].map((match) => match[0].slice(0, 220));
console.log("hvac media", videos.length);
for (const video of videos) console.log(video);
