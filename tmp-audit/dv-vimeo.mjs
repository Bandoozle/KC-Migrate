const origin = "https://staging.kosick.com";

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|h\d|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const posts = await fetch(`${origin}/wp-json/wp/v2/posts?slug=connected-tv-advertising-canada&_fields=title,link,content`).then((r) => r.json());
const post = posts[0];
console.log("POST", post.title.rendered, post.link);
const html = post.content.rendered;
const idx = html.search(/vimeo/i);
console.log(text(html.slice(Math.max(0, idx - 800), idx + 400)));

for (const q of ["trane-web", "trane web", "how-we-run", "how we run"]) {
  const items = await fetch(`${origin}/wp-json/wp/v2/media?search=${encodeURIComponent(q)}&per_page=10&_fields=source_url,mime_type,title`).then((r) => r.json());
  console.log("\n", q);
  for (const item of items) console.log(item.mime_type, item.title?.rendered, item.source_url);
}

const tv = await fetch(`${origin}/wp-json/wp/v2/pages?slug=television-advertising&_fields=content`).then((r) => r.json());
const tvHtml = tv[0].content.rendered;
const sources = [...tvHtml.matchAll(/(?:src|data-src|data-desktop)="([^"]+\.mp4[^"]*)"/gi)].map((m) => m[1]);
console.log("\nTV SOURCES", [...new Set(sources)]);
const trane = [...tvHtml.matchAll(/trane[^"'\s]{0,80}/gi)].slice(0, 20);
console.log("TRANE HITS", [...new Set(trane.map((m) => m[0]))]);
