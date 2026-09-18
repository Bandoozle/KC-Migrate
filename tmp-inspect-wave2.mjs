import fs from "node:fs";
import * as cheerio from "cheerio";

const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const origin =
  (env.match(/^WORDPRESS_URL=(.+)$/m)?.[1] || "https://staging.kosick.com").trim();

fs.mkdirSync("tmp-wave2", { recursive: true });

for (const slug of ["services", "marketing-results", "marketing-programs", "thanks"]) {
  const pageRes = await fetch(
    `${origin}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&status=publish`,
  );
  const page = (await pageRes.json())[0];
  if (!page) {
    console.log("MISSING", slug);
    continue;
  }
  fs.writeFileSync(`tmp-wave2/${slug}.json`, JSON.stringify({
    id: page.id,
    slug: page.slug,
    title: page.title.rendered,
    excerpt: page.excerpt?.rendered,
    content: page.content.rendered,
  }, null, 2));

  const html = page.content.rendered || "";
  const $ = cheerio.load(`<div id="r">${html}</div>`);
  const rows = $("#r > .kb-row-layout-wrap, #r .kb-row-layout-wrap").toArray();
  console.log("\n====", slug, "====");
  console.log("title:", page.title.rendered);
  console.log("content len:", html.length);
  console.log("top rows:", $("#r").children(".kb-row-layout-wrap").length);
  console.log("all rows:", rows.length);
  console.log("slider:", /smartslider|n2-ss/.test(html));
  console.log("media-text:", ($(".wp-block-media-text").length));
  console.log("headings:", $("h1,h2,h3,.wp-block-kadence-advancedheading").toArray().slice(0, 20).map((el) => clean($(el).text())).filter(Boolean));
  console.log("images:", $("img").toArray().slice(0, 12).map((el) => ($(el).attr("src") || "").split("/").pop()));
  console.log("bg urls:", [...html.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)].map((m) => m[2]).slice(0, 8));
  console.log("links:", $("a[href]").toArray().slice(0, 15).map((a) => ({ t: clean($(a).text()), h: $(a).attr("href") })));

  // Also fetch live HTML for slider slides if needed
  if (/smartslider|n2-ss/.test(html) || slug !== "thanks") {
    const live = await fetch(`${origin}/${slug === "home" ? "" : slug + "/"}`);
    const liveHtml = await live.text();
    fs.writeFileSync(`tmp-wave2/${slug}-live.html`, liveHtml);
    const slides = [...liveHtml.matchAll(/background-image:\s*url\((['"]?)([^)'"]+)\1\)/gi)]
      .map((m) => m[2])
      .filter((u) => /\/wp-content\/uploads\//.test(u));
    console.log("live slide/bg count:", [...new Set(slides)].length);
  }
}

function clean(s) {
  return s.replace(/\s+/g, " ").replace(/&#8217;/g, "'").replace(/&#038;/g, "&").trim();
}
