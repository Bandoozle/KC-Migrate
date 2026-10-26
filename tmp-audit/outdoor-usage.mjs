const base = "https://staging.kosick.com";
const files = [
  "outdoor-advertising-1-scaled", "transit-shelter-ads", "hvac-billboard-advertising", "2026/01/outdoor-advertising",
  "2025/07/outdoor-advertising", "billboard-advertising.webp", "home-services-billboards", "billboards-scaled",
  "outdoor-tsa", "digital-superboard", "billboard-dimensions.webp",
];
const all = [];
for (const type of ["pages", "posts"]) {
  for (let p = 1; p < 5; p++) {
    const r = await fetch(`${base}/wp-json/wp/v2/${type}?per_page=100&page=${p}&_fields=slug,content`);
    if (!r.ok) break;
    const items = await r.json();
    if (!items.length) break;
    all.push(...items.map((i) => ({ type, slug: i.slug, html: i.content.rendered })));
  }
}
console.log("docs", all.length);
for (const f of files) {
  const uses = all.filter((d) => d.html.includes(f));
  console.log(`\n# ${f}: ${uses.map((u) => `${u.type}/${u.slug}`).join(", ") || "unused"}`);
  for (const u of uses.slice(0, 3)) {
    const alt = u.html.match(new RegExp(`<img[^>]*${f.replace(/[./]/g, "\\$&")}[^>]*>`, "i"))?.[0].match(/alt="([^"]*)"/)?.[1];
    const i = u.html.indexOf(f);
    const near = u.html.slice(Math.max(0, i - 1500), i + 1500).replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/[.#][\w-]+\{[^}]*\}/g, "").slice(0, 600);
    console.log(`  ${u.slug} alt="${alt}"\n   near: ${near}`);
  }
}
