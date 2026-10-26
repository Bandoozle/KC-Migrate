const origin = "https://staging.kosick.com";
const posts = await fetch(`${origin}/wp-json/wp/v2/posts?slug=connected-tv-advertising-canada&_fields=content`).then((r) => r.json());
const html = posts[0].content.rendered;
const idx = html.search(/Sample Connected/i);
console.log(html.slice(idx, idx + 2200));

const player = await fetch("https://player.vimeo.com/video/1161641026", { redirect: "manual" });
console.log("\nPLAYER", player.status, player.headers.get("content-type"));
const body = await player.text();
const title = body.match(/<title>([^<]+)<\/title>/i)?.[1];
console.log("TITLE", title);
console.log(body.slice(0, 400));
