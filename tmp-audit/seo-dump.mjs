const url =
  "https://staging.kosick.com/wp-json/wp/v2/pages?slug=search-engine-optimization&status=publish";
const res = await fetch(url);
const pages = await res.json();
const html = pages[0]?.content?.rendered || "";
console.log("title", pages[0]?.title?.rendered);
console.log("html length", html.length);

const chunks = [];
const re = /<(h[1-6]|p|li|img|a)\b([^>]*)>([\s\S]*?)<\/\1>|<img\b([^>]*)>/gi;
let m;
while ((m = re.exec(html))) {
  if (m[1] === "img" || m[4]) {
    const attrs = m[2] || m[4] || "";
    const src = attrs.match(/\ssrc="([^"]+)"/)?.[1] || "";
    const alt = attrs.match(/\salt="([^"]*)"/)?.[1] || "";
    const w = attrs.match(/\swidth="([^"]+)"/)?.[1] || "";
    const h = attrs.match(/\sheight="([^"]+)"/)?.[1] || "";
    chunks.push(`IMG ${w}x${h} ${alt} :: ${src}`);
    continue;
  }
  const text = m[3]
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (!text) continue;
  if (m[1] === "a") continue;
  chunks.push(`${m[1].toUpperCase()} ${text.slice(0, 280)}`);
}
console.log(chunks.join("\n"));
