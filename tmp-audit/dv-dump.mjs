const origin = "https://staging.kosick.com";

function text(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h\d|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#038;/g, "&")
    .replace(/&hellip;/g, "…")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

const pages = await fetch(`${origin}/wp-json/wp/v2/pages?slug=digital-connected-tv&_fields=id,slug,title,link,content`).then((r) => r.json());
const page = pages[0];
const html = page.content.rendered;
console.log("TITLE", page.title.rendered);

const imgs = [...html.matchAll(/<img[^>]+>/gi)].map((m) => {
  const src = m[0].match(/src="([^"]+)"/)?.[1];
  const alt = m[0].match(/alt="([^"]*)"/)?.[1] || "";
  return `${alt} | ${src}`;
});
console.log("\nIMAGES", imgs.length);
for (const img of imgs) console.log(img);

const bgs = [...html.matchAll(/background-image:\s*url\(([^)]+)\)/gi)].map((m) => m[1].replace(/['"]/g, ""));
console.log("\nBACKGROUNDS");
for (const bg of [...new Set(bgs)]) console.log(bg);

const iframes = [...html.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map((m) => m[1]);
const videos = [...html.matchAll(/https?:[^"'\s>]+\.mp4/gi)].map((m) => m[0]);
const vimeo = [...html.matchAll(/vimeo\.com[^"'\s]*/gi)].map((m) => m[0]);
console.log("\nIFRAMES", iframes);
console.log("MP4", videos);
console.log("VIMEO", vimeo);

const links = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => `${text(m[2])} -> ${m[1]}`);
console.log("\nLINKS");
for (const link of links) console.log(link);

const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => `H${m[1]} ${text(m[2])}`);
console.log("\nHEADINGS");
for (const h of headings) console.log(h);

console.log("\n--- TEXT ---\n");
console.log(text(html));

const media = await fetch(`${origin}/wp-json/wp/v2/media?search=streaming&per_page=20&_fields=source_url,mime_type,alt_text,title`).then((r) => r.json());
console.log("\nMEDIA SEARCH streaming");
for (const item of media) console.log(item.mime_type, item.title?.rendered, item.source_url);

const media2 = await fetch(`${origin}/wp-json/wp/v2/media?media_type=video&per_page=20&_fields=source_url,mime_type,alt_text,title`).then((r) => r.json());
console.log("\nVIDEO MEDIA");
for (const item of media2) console.log(item.mime_type, item.title?.rendered, item.source_url);
