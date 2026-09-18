import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const full = readFileSync("tmp-parity/contact.html", "utf8");
const $ = cheerio.load(full);

const flags = {
  captcha: /recaptcha|hcaptcha|turnstile|captcha/i.test(full),
  honeypot: /honeypot|kb-adv-form-honeypot|kb-honey/i.test(full),
  form: $(".kb-advanced-form, .wp-block-kadence-advanced-form, form.kb-advanced-form").length,
  smartSlider: /n2-ss-|smartslider/i.test(full),
};

console.log("FLAGS", flags);

// Find advanced forms
$("form").each((i, form) => {
  const $f = $(form);
  const cls = ($f.attr("class") || "").slice(0, 120);
  const action = $f.attr("action") || "";
  const method = $f.attr("method") || "";
  const id = $f.attr("id") || "";
  console.log(`\nFORM #${i} id=${id} method=${method}`);
  console.log("  class:", cls);
  console.log("  action:", action.slice(0, 120));

  $f.find("input, select, textarea, button").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName;
    const type = $el.attr("type") || tag;
    const name = $el.attr("name") || "";
    const required = $el.is("[required]") || $el.attr("aria-required") === "true";
    const placeholder = $el.attr("placeholder") || "";
    const value = $el.attr("value") || "";
    const label =
      $el.closest(".kb-adv-form-field, .kadence-blocks-form-field, .kb-field").find("label").first().text().replace(/\s+/g, " ").trim() ||
      ($el.attr("aria-label") || "");
    if (!name && type === "submit") {
      console.log(`  [${type}] label=${($el.text() || value || "").trim()} `);
      return;
    }
    if (!name && type === "hidden") return;
    console.log(
      `  [${type}] name=${name} required=${required} label="${label.slice(0, 60)}" ph="${placeholder.slice(0, 40)}" val="${value.slice(0, 40)}"`,
    );
    if (tag === "select") {
      $el.find("option").each((__, opt) => {
        console.log(`    option: ${$(opt).text().replace(/\s+/g, " ").trim()} = ${$(opt).attr("value")}`);
      });
    }
  });
});

// Page structure headings
console.log("\nHEADINGS");
$("h1,h2,h3,.wp-block-kadence-advancedheading").each((_, el) => {
  const t = $(el).text().replace(/\s+/g, " ").trim();
  if (t && t.length < 120) console.log(" -", t);
});

// Contact details
console.log("\nLINKS tel/mailto");
$('a[href^="tel:"], a[href^="mailto:"]').each((_, a) => {
  console.log(" -", $(a).attr("href"), $(a).text().replace(/\s+/g, " ").trim());
});

// Extract form post id patterns
const postIds = [...full.matchAll(/_kb_adv_form_post_id[^>]*value=["']?(\d+)/gi)].map((m) => m[1]);
const formIds = [...full.matchAll(/_kb_adv_form_id[^>]*value=["']?([^"'\s>]+)/gi)].map((m) => m[1]);
console.log("\npostIds", [...new Set(postIds)]);
console.log("formIds", [...new Set(formIds)]);

// REST: try fetch contact page content if we have slug
writeFileSync(
  "tmp-parity/rest/contact-audit.json",
  JSON.stringify({ flags, postIds: [...new Set(postIds)], formIds: [...new Set(formIds)] }, null, 2),
);
