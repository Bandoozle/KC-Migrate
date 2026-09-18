import { writeFileSync } from "node:fs";

const origin = process.env.WORDPRESS_URL || "https://staging.kosick.com";

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const res = await fetch(
      `${origin}/wp-json/wp/v2/posts?per_page=100&page=${page}&status=publish&_embed=1&_fields=id,slug,link,date,modified,title,excerpt,content,featured_media,categories,tags,yoast_head_json,_embedded`,
      { headers: { Accept: "application/json" } },
    );
    totalPages = Number(res.headers.get("x-wp-totalpages") || "1");
    const batch = await res.json();
    if (!Array.isArray(batch)) throw new Error(JSON.stringify(batch));
    posts.push(...batch);
    page += 1;
  }
  return posts;
}

function analyzeContent(html = "") {
  const patterns = {
    h2: (html.match(/<h2[\s>]/gi) || []).length,
    h3: (html.match(/<h3[\s>]/gi) || []).length,
    h4: (html.match(/<h4[\s>]/gi) || []).length,
    p: (html.match(/<p[\s>]/gi) || []).length,
    ul: (html.match(/<ul[\s>]/gi) || []).length,
    ol: (html.match(/<ol[\s>]/gi) || []).length,
    img: (html.match(/<img[\s>]/gi) || []).length,
    figure: (html.match(/<figure[\s>]/gi) || []).length,
    figcaption: (html.match(/<figcaption[\s>]/gi) || []).length,
    blockquote: (html.match(/<blockquote[\s>]/gi) || []).length,
    table: (html.match(/<table[\s>]/gi) || []).length,
    iframe: (html.match(/<iframe[\s>]/gi) || []).length,
    youtube: /youtube\.com|youtu\.be/i.test(html),
    vimeo: /vimeo\.com/i.test(html),
    kadence: /wp-block-kadence|kt-|kb-/i.test(html),
    gutenberg: /wp-block-/i.test(html),
    buttons: /kb-button|wp-block-button|kt-button/i.test(html),
    columns: /wp-block-columns|wp-block-kadence-column|wp-block-media-text/i.test(html),
    gallery: /wp-block-gallery|kb-gallery|wp-block-kadence-advancedgallery/i.test(html),
    embed: /wp-block-embed/i.test(html),
    styleTags: (html.match(/<style[\s>]/gi) || []).length,
    inlineStyle: (html.match(/\sstyle="/gi) || []).length,
  };
  return patterns;
}

const posts = await fetchAllPosts();
console.log("total posts", posts.length);

const summaries = posts.map((p) => {
  const html = p.content?.rendered || "";
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  return {
    slug: p.slug,
    title: (p.title?.rendered || "").replace(/<[^>]+>/g, ""),
    date: p.date,
    hasFeatured: Boolean(media?.source_url || p.featured_media),
    hasYoast: Boolean(p.yoast_head_json),
    contentLen: html.length,
    patterns: analyzeContent(html),
  };
});

const aggregate = {
  total: summaries.length,
  withFeatured: summaries.filter((s) => s.hasFeatured).length,
  withYoast: summaries.filter((s) => s.hasYoast).length,
  withImages: summaries.filter((s) => s.patterns.img > 0).length,
  withLists: summaries.filter((s) => s.patterns.ul + s.patterns.ol > 0).length,
  withEmbeds: summaries.filter((s) => s.patterns.iframe > 0 || s.patterns.embed).length,
  withTables: summaries.filter((s) => s.patterns.table > 0).length,
  withBlockquote: summaries.filter((s) => s.patterns.blockquote > 0).length,
  withKadence: summaries.filter((s) => s.patterns.kadence).length,
  withButtons: summaries.filter((s) => s.patterns.buttons).length,
  withColumns: summaries.filter((s) => s.patterns.columns).length,
  withGallery: summaries.filter((s) => s.patterns.gallery).length,
  withStyleTags: summaries.filter((s) => s.patterns.styleTags > 0).length,
};

// Pick representative samples
const samples = {
  simple: summaries.find((s) => s.patterns.img === 0 && s.patterns.iframe === 0 && s.contentLen < 4000),
  multiImage: [...summaries].sort((a, b) => b.patterns.img - a.patterns.img)[0],
  withLists: summaries.find((s) => s.patterns.ul + s.patterns.ol >= 2),
  withEmbed: summaries.find((s) => s.patterns.iframe > 0 || s.patterns.vimeo || s.patterns.youtube),
  withKadence: summaries.find((s) => s.patterns.kadence),
  withTable: summaries.find((s) => s.patterns.table > 0),
  withBlockquote: summaries.find((s) => s.patterns.blockquote > 0),
  longest: [...summaries].sort((a, b) => b.contentLen - a.contentLen)[0],
};

console.log("AGGREGATE", aggregate);
console.log("\nSAMPLES");
for (const [k, v] of Object.entries(samples)) {
  console.log(k, v ? `${v.slug} imgs=${v.patterns.img} lists=${v.patterns.ul + v.patterns.ol} iframe=${v.patterns.iframe} kadence=${v.patterns.kadence}` : "none");
}

writeFileSync(
  "tmp-parity/rest/posts-audit.json",
  JSON.stringify({ aggregate, samples, slugs: summaries.map((s) => s.slug), summaries }, null, 2),
);
console.log("\nWrote tmp-parity/rest/posts-audit.json");
