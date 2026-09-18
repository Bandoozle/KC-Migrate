import { readFileSync, writeFileSync } from "node:fs";
import { load } from "cheerio";

function inventory(slug, file) {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const page = Array.isArray(raw) ? raw[0] : raw;
  const html = page.content.rendered;
  const $ = load(`<div id="root">${html}</div>`);

  const top = $("#root")
    .children()
    .toArray()
    .map((el, i) => {
      const $el = $(el);
      const cls = ($el.attr("class") || "").slice(0, 120);
      const text = $el.text().replace(/\s+/g, " ").trim().slice(0, 140);
      const imgs = $el.find("img").length;
      const hasFaq = $el.find(".kt-accordion, .wp-block-kadence-accordion, details, .kb-accordion").length;
      const hasOverlay = $el.find(".wp-block-kadence-imageoverlay").length;
      const hasSlider = $el.find(".n2-ss-slide, .n2-section-smartslider, ss3-force-full-width").length;
      const headings = $el
        .find(".wp-block-kadence-advancedheading, h1, h2, h3")
        .toArray()
        .map((h) => $(h).text().replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(0, 8);
      return {
        i,
        tag: el.tagName,
        cls,
        imgs,
        hasFaq,
        hasOverlay,
        hasSlider,
        headings,
        text,
      };
    })
    .filter((r) => r.tag !== "style" && r.tag !== "script");

  const faqs = [];
  $(".kt-accordion-panel-inner, .kt-accordion-panel, .kb-accordion-pane, .kt-blocks-accordion-header").each(
    (_, el) => {
      const t = $(el).text().replace(/\s+/g, " ").trim().slice(0, 100);
      if (t) faqs.push(t);
    },
  );

  const accordionHeaders = $(".kt-blocks-accordion-header, .kt-accordion-header")
    .toArray()
    .map((el) => $(el).text().replace(/\s+/g, " ").trim());

  const related = $(".wp-block-kadence-iconlist, .kt-svg-icon-list, ul")
    .toArray()
    .slice(0, 0);

  // Count patterns
  const patterns = {
    smartSlider: (html.match(/n2-ss|smartslider/gi) || []).length,
    accordion: (html.match(/accordion/gi) || []).length,
    imageoverlay: (html.match(/imageoverlay/gi) || []).length,
    infoBox: (html.match(/info-box|infobox/gi) || []).length,
    offerLike: (html.match(/kb-button|kt-button/gi) || []).length,
    rowLayouts: (html.match(/kb-row-layout-wrap/gi) || []).length,
  };

  return {
    slug,
    title: page.title.rendered,
    topCount: top.length,
    top,
    accordionHeaders: accordionHeaders.slice(0, 20),
    faqSample: faqs.slice(0, 10),
    patterns,
    hasN2: html.includes("n2-ss"),
  };
}

const files = {
  "email-marketing": "scripts/tmp-email-rest.json",
  "social-media-marketing": "scripts/tmp-social-rest.json",
  "search-engine-optimization": "scripts/tmp-seo-rest.json",
};

const out = {};
for (const [slug, file] of Object.entries(files)) {
  out[slug] = inventory(slug, file);
}
writeFileSync("scripts/tmp-service3-inventory.json", JSON.stringify(out, null, 2));

for (const [slug, data] of Object.entries(out)) {
  console.log("\n====", slug, data.title, "====");
  console.log("patterns", data.patterns);
  console.log("accordionHeaders", data.accordionHeaders);
  console.log(
    "top rows:",
    data.top.map((r) => ({
      i: r.i,
      cls: r.cls.slice(0, 80),
      headings: r.headings,
      imgs: r.imgs,
      hasFaq: r.hasFaq,
      hasSlider: r.hasSlider,
      hasOverlay: r.hasOverlay,
    })),
  );
}
