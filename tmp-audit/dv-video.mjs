const origin = "https://staging.kosick.com";

async function search(q) {
  const res = await fetch(`${origin}/wp-json/wp/v2/media?search=${encodeURIComponent(q)}&per_page=20&_fields=source_url,mime_type,title,alt_text`);
  const items = await res.json();
  console.log("\n==", q, Array.isArray(items) ? items.length : items);
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (!/video|mp4|webm/i.test(`${item.mime_type} ${item.source_url}`)) continue;
    console.log(item.mime_type, item.title?.rendered, item.source_url);
  }
}

for (const q of ["trane", "bluejay", "connected", "pre-roll", "preroll", "ctv", "streaming ad", "commercial"]) {
  await search(q);
}

const page = await fetch(`${origin}/wp-json/wp/v2/pages?slug=television-advertising&_fields=content`).then((r) => r.json());
const html = page[0].content.rendered;
const mp4 = [...html.matchAll(/https?:[^"'\s>]+\.mp4/gi)].map((m) => m[0]);
console.log("\nTV PAGE MP4", [...new Set(mp4)]);

const article = await fetch(`${origin}/wp-json/wp/v2/posts?slug=connected-tv-advertising-canada&_fields=content`).then((r) => r.json());
if (article[0]) {
  const ahtml = article[0].content.rendered;
  console.log("ARTICLE MP4", [...ahtml.matchAll(/https?:[^"'\s>]+\.mp4/gi)].map((m) => m[0]));
  console.log("ARTICLE IFRAME", [...ahtml.matchAll(/iframe[^>]+src="([^"]+)"/gi)].map((m) => m[1]));
}
