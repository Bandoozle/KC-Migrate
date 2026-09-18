import { writeFileSync } from "node:fs";

const origin = "https://staging.kosick.com";
const samples = [
  "is-television-advertising-worth-it",
  "digital-marketing-vs-traditional-advertising",
  "blog-kosick-com-corporate-branding-guide",
  "connected-tv-advertising-canada",
  "hvac-marketing-strategies",
];

for (const slug of samples) {
  const res = await fetch(
    `${origin}/wp-json/wp/v2/posts?slug=${slug}&_embed=1`,
  );
  const [post] = await res.json();
  if (!post) {
    console.log("missing", slug);
    continue;
  }
  writeFileSync(`tmp-parity/rest/post-${slug}.html`, post.content.rendered);
  const classes = new Set();
  for (const m of post.content.rendered.matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) {
      if (/^(wp-block|kt-|kb-|kadence)/i.test(c)) classes.add(c.split("_")[0] || c);
    }
  }
  console.log("\n===", slug, "===");
  console.log("title", post.title.rendered);
  console.log("date", post.date);
  console.log("modified", post.modified);
  console.log("featured", post._embedded?.["wp:featuredmedia"]?.[0]?.source_url?.slice(0, 80));
  console.log("excerpt", post.excerpt.rendered.replace(/<[^>]+>/g, "").trim().slice(0, 100));
  console.log("kadence class prefixes", [...classes].slice(0, 30).join(", "));
  console.log("has yoast", Boolean(post.yoast_head_json || post.yoast_head));
  console.log("keys", Object.keys(post).filter((k) => /yoast|rank|seo|jetpack|meta/i.test(k)));
}
