const html = await fetch("http://localhost:3000/").then((r) => r.text());
const imgs = [...html.matchAll(/<img[^>]*class="[^"]*"|<a class="sbi_photo"[\s\S]*?<img[^>]*>/gi)];
const sbiImgs = [...html.matchAll(/<a class="sbi_photo"[\s\S]*?<img[^>]+src="([^"]+)"/gi)].map(
  (m) => m[1],
);
const unique = [...new Set(sbiImgs)];
console.log({
  hasShortcode: html.includes("[instagram-feed"),
  hasSb: html.includes('id="sb_instagram"'),
  sbiItems: (html.match(/class="sbi_item /g) || []).length,
  imageSrcs: unique.slice(0, 12),
  placeholderSrcs: unique.filter((src) => src.includes("placeholder.png")).length,
  webpSrcs: unique.filter((src) => src.includes("sb-instagram-feed-images")).length,
  sbiCss: html.includes("sbi-styles.min.css"),
  sbiJs: html.includes("sbi-scripts"),
});
