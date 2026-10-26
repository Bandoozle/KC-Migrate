const oembed = await fetch("https://vimeo.com/api/oembed.json?url=https://vimeo.com/1161641026").then((r) => r.json());
console.log(JSON.stringify({
  title: oembed.title,
  author: oembed.author_name,
  description: oembed.description,
  width: oembed.width,
  height: oembed.height,
  thumbnail: oembed.thumbnail_url,
  duration: oembed.duration,
}, null, 2));

const origin = "https://staging.kosick.com";
const posts = await fetch(`${origin}/wp-json/wp/v2/posts?slug=connected-tv-advertising-canada&_fields=content`).then((r) => r.json());
const html = posts[0].content.rendered;
const idx = html.search(/Sample Connected/i);
console.log("\n--- context ---\n");
console.log(html.slice(idx, idx + 1800).replace(/<style[\s\S]*?<\/style>/gi, ""));
