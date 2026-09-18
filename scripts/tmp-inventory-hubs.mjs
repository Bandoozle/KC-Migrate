import { writeFileSync } from "node:fs";
import { load } from "cheerio";

async function fetchPage(slug) {
  const res = await fetch(
    `https://staging.kosick.com/wp-json/wp/v2/pages?slug=${slug}`,
  );
  const data = await res.json();
  if (!Array.isArray(data) || !data[0]) throw new Error(`No page for ${slug}`);
  return data[0];
}

function inventory(slug, html) {
  const $ = load(`<div id="root">${html}</div>`);
  const root = $("#root");

  const sliderImgs = [];
  $(".n2-ss-slide img, .n2-ss-layer img, .n2-ss-slide-background-image img").each(
    (_, img) => {
      const src = $(img).attr("src") || $(img).attr("data-src") || "";
      if (src) sliderImgs.push(src.slice(0, 120));
    },
  );

  const sliderTexts = [];
  $(".n2-ss-layer").each((_, el) => {
    const text = $(el).clone().children().remove().end().text().replace(/\s+/g, " ").trim();
    if (text && text.length < 120) sliderTexts.push(text);
  });

  const overlays = [];
  $(
    ".wp-block-kadence-imageoverlay, .kt-blocks-image-overlay, .kadence-image-overlay, [class*='image-overlay'], [class*='imageoverlay']",
  ).each((_, el) => {
    const $el = $(el);
    overlays.push({
      class: ($el.attr("class") || "").slice(0, 160),
      title: $el
        .find("h2,h3,h4,.kt-image-overlay-title,.kt-blocks-overlay-title")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 80),
      img: ($el.find("img").first().attr("src") || "").slice(0, 120),
      href: $el.find("a[href]").first().attr("href") || null,
      htmlSnippet: $.html($el).slice(0, 300),
    });
  });

  const topRows = root.children().toArray().map((el) => ({
    tag: el.tagName,
    class: ($(el).attr("class") || "").slice(0, 140),
    textPreview: $(el).text().replace(/\s+/g, " ").trim().slice(0, 100),
  }));

  // Also look for figure/img cards that might be industries
  const figures = [];
  $("figure, .wp-block-image, .kb-gallery-item, .kt-blocks-info-box").each((_, el) => {
    const $el = $(el);
    const title = $el.find("figcaption, h2, h3, h4, .kt-blocks-info-box-title").first().text().replace(/\s+/g, " ").trim();
    const img = $el.find("img").first().attr("src");
    if (img && title) figures.push({ title: title.slice(0, 80), img: img.slice(0, 100) });
  });

  return {
    slug,
    title: null,
    sliderImgs: [...new Set(sliderImgs)].slice(0, 20),
    sliderImgCount: sliderImgs.length,
    sliderTexts: [...new Set(sliderTexts)],
    overlayCount: overlays.length,
    overlays: overlays.slice(0, 20),
    figures: figures.slice(0, 20),
    topChildren: topRows.slice(0, 30),
    hasSmartSlider: html.includes("n2-ss") || html.includes("smartslider"),
    classHits: {
      imageoverlay: (html.match(/imageoverlay/gi) || []).length,
      image_overlay: (html.match(/image-overlay/gi) || []).length,
      overlay: (html.match(/overlay/gi) || []).length,
    },
  };
}

const out = {};
for (const slug of ["marketing-results", "marketing-programs", "services"]) {
  const page = await fetchPage(slug);
  const inv = inventory(slug, page.content.rendered);
  inv.title = page.title.rendered;
  out[slug] = inv;
  writeFileSync(`scripts/tmp-${slug}-rest.json`, JSON.stringify(page, null, 2));
}

writeFileSync("scripts/tmp-hub-inventory.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
