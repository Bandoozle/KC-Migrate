const origin = "https://staging.kosick.com";

async function getAll(path) {
  const items = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `${origin}/wp-json/wp/v2/${path}?per_page=100&page=${page}&status=publish&_fields=id,slug,type,link,title,content,excerpt`,
    );
    if (!res.ok) break;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    items.push(...data);
    const total = Number(res.headers.get("X-WP-TotalPages") || 1);
    if (page >= total) break;
  }
  return items;
}

function findShortcodes(html = "") {
  return [...html.matchAll(/\[\/?[a-zA-Z][\w-]*(?:\s[^\]]*)?\]/g)].map((m) => m[0]);
}

const pages = await getAll("pages");
const posts = await getAll("posts");
const summary = [];

for (const item of [...pages, ...posts]) {
  const html = `${item.content?.rendered || ""}\n${item.excerpt?.rendered || ""}`;
  const codes = [...new Set(findShortcodes(html))];
  const flags = {
    slug: item.slug,
    type: item.type || (item.link?.includes("/feature") ? "post" : "page"),
    id: item.id,
    shortcodes: codes,
    hasInstagramFeedShortcode: /\[instagram-feed/i.test(html),
    hasSbInstagramMarkup: html.includes('id="sb_instagram"') || html.includes("id='sb_instagram'"),
    hasSmartSlider: html.includes("n2-ss-") || /\[smartslider/i.test(html),
    hasKadenceForm: html.includes("kb-advanced-form") || html.includes("kb-adv-form"),
    hasPlaceholderImg: html.includes("instagram-feed/img/placeholder.png"),
  };
  if (
    flags.shortcodes.length ||
    flags.hasInstagramFeedShortcode ||
    flags.hasSbInstagramMarkup ||
    flags.hasSmartSlider ||
    flags.hasKadenceForm
  ) {
    summary.push(flags);
  }
}

console.log("counts", { pages: pages.length, posts: posts.length, hits: summary.length });
console.log(JSON.stringify(summary, null, 2));
