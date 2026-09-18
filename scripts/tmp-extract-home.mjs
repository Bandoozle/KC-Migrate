import { load } from "cheerio";
import { readFileSync, writeFileSync } from "fs";

const html = readFileSync("tmp-parity/home.html", "utf8");
const $ = load(html);

function clean(s) {
  return s
    .replace(/\u00a0/g, " ")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function textKeepBr(selOrEl) {
  const el = typeof selOrEl === "string" ? $(selOrEl).first() : selOrEl;
  if (!el.length) return null;
  const clone = el.clone();
  clone.find("a[href*='lovable.app']").remove();
  clone.find("br").replaceWith("\n");
  const t = clean(clone.text());
  return t || null;
}

function textFlat(selOrEl) {
  const t = textKeepBr(selOrEl);
  return t ? t.replace(/\n+/g, " ").replace(/\s+/g, " ").trim() : null;
}

function decodeCfEmail(encoded) {
  if (!encoded) return null;
  const hex = encoded.replace(/^.*#/, "");
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length < 2) return null;
  const key = parseInt(hex.slice(0, 2), 16);
  let out = "";
  for (let i = 2; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
  }
  return out;
}

// --- HERO ---
const hero = $(".kb-row-layout-id4541_65264e-2a").first();
const iframeSrc = hero.find("iframe.kb-blocks-bg-video").attr("src") || null;
const cta = hero.find("a.kb-btn4541_43c642-44").first();

// --- BRAND TABS ---
const brandTabs = [];
$(".amplitude-tabs .kt-tabs-title-list .kt-title-item").each((i, li) => {
  const label = $(li).find(".kt-title-text").text().trim();
  const pane = $(`.amplitude-tabs .kt-inner-tab-${i + 1}`).first();
  const img = pane.find("img").first();
  const heading = textFlat(pane.find("h2, h3").first());
  const bodyParagraphs = [];
  const lists = [];
  pane.find("p").each((_, p) => {
    const t = textKeepBr($(p));
    if (t) bodyParagraphs.push(t);
  });
  pane.find("ul, ol").each((_, list) => {
    const items = [];
    $(list)
      .children("li")
      .each((__, liEl) => {
        const t = textFlat($(liEl));
        if (t) items.push(t);
      });
    if (items.length) {
      lists.push({ type: list.name || list.tagName?.toLowerCase?.() || "ul", items });
    }
  });
  brandTabs.push({
    label,
    image: {
      src: img.attr("src") || null,
      alt: img.attr("alt") != null && img.attr("alt") !== "" ? img.attr("alt") : null,
    },
    heading,
    bodyParagraphs,
    lists: lists.length ? lists : [],
  });
});

// --- TESTIMONIALS ---
const testimonialTitle = textFlat(
  "h2.wp-elements-11, .kadence-column4541_19dd62-f1 > .kt-inside-inner-col > h2",
);
const testimonialCards = [];
$(".kb-row-layout-id4541_575ec1-27 > .kt-row-column-wrap > .wp-block-kadence-column").each(
  (_, col) => {
    const $col = $(col);
    const author = textFlat($col.find(".testimonial-logo").first());
    const quote = textFlat($col.find(".testimonial-quote").first());
    if (!quote && !author) return;
    const logoImg = $col.find(".testimonial-logo img, img").filter((_, img) => {
      return $(img).closest(".testimonial-quote").length === 0;
    }).first();
    const avatar = $col.find(".testimonial-avatar img").first();
    const role = textFlat($col.find(".testimonial-role, .testimonial-name").first());
    testimonialCards.push({
      quote,
      author,
      role: role && role !== author ? role : null,
      logo: null,
      avatar: avatar.length
        ? { src: avatar.attr("src") || null, alt: avatar.attr("alt") || null }
        : null,
    });
  },
);

// --- WHY CHOOSE ---
const why = $(".kb-row-layout-id4541_cb53d2-62").first();
const whyTitle = textFlat(why.find("h2").first());
const whyLead = textKeepBr(why.find("p.wp-elements-14, p").first());
const metrics = [];
$(".kb-row-layout-id4541_cb5129-82 .wp-block-kadence-countup").each((_, el) => {
  const $el = $(el);
  const end = $el.attr("data-end") || null;
  const prefix = $el.attr("data-prefix") || "";
  const suffix = $el.attr("data-suffix") || "";
  const label = textFlat($el.find(".kb-count-up-title").first());
  metrics.push({
    value: `${prefix}${end}${suffix}`,
    label,
  });
});

const tileButtonLabels = [];
for (const sel of [
  ".kb-row-layout-id4541_5747e9-5c",
  ".kb-row-layout-id4541_c3a682-45",
  ".kb-row-layout-id4541_1131a9-81",
]) {
  $(sel)
    .find(".kb-button .kt-btn-inner-text, .kb-button")
    .each((_, btn) => {
      // prefer inner text node once
      if ($(btn).hasClass("kb-button") && $(btn).find(".kt-btn-inner-text").length) return;
      const t = textFlat($(btn));
      if (t) tileButtonLabels.push(t);
    });
}

// dedupe if both matched
const tilesUnique = [];
for (const t of tileButtonLabels) {
  if (!tilesUnique.includes(t)) tilesUnique.push(t);
}

// --- QUOTE ---
const quoteSec = $(".kb-row-layout-id4541_605b2b-60").first();
const quoteText = textFlat(quoteSec.find("p").first());
const attribEl = quoteSec.find("p").eq(1);
const attribName = attribEl.find("strong").length
  ? textFlat(attribEl.find("strong").first())
  : null;
const attribFull = textKeepBr(attribEl);
let attribRole = null;
if (attribFull && attribName) {
  attribRole = attribFull.replace(attribName, "").replace(/^\n+/, "").trim() || null;
}
const quotePhoto = quoteSec.find("img").first();

// --- CONTACT ---
const contact = $(".kb-row-layout-id4541_09415d-fe").first();
const contactHeading = textFlat(".kt-adv-heading4541_8e787d-69");
const contactLead = textFlat(".kt-adv-heading4541_5cf49d-94");
const phone = textFlat(contact.find('a[href^="tel:"]').first());
const phoneHref = contact.find('a[href^="tel:"]').attr("href") || null;
const emailA = contact.find('a[href*="email-protection"], a[href^="mailto:"]').first();
const emailHref = emailA.attr("href") || null;
let email = null;
if (emailHref?.startsWith("mailto:")) {
  email = emailHref.replace(/^mailto:/, "");
} else if (emailHref?.includes("email-protection")) {
  const hash = emailHref.split("#")[1] || null;
  email = decodeCfEmail(hash);
}
// also from RTL visible text as fallback evidence
const emailRtl = emailA.find("span").first().text();
const emailFromRtl = emailRtl
  ? emailRtl.replace(/obfsctd-[a-z0-9]+/gi, "").split("").reverse().join("").replace(/\s+/g, "")
  : null;

const locations = textKeepBr(".kt-adv-heading4541_39501c-d1");
const locationsValue = locations
  ? locations.replace(/^Locations\s*/i, "").trim()
  : null;

const form = $("#kb-adv-form-11283-cpt-id").first();
const fields = [];
form.find(".kb-adv-form-field").each((_, field) => {
  const $f = $(field);
  const label = textFlat($f.find("label").first())?.replace(/\*$/, "").trim() || null;
  const required = $f.find("[required], [data-required='yes']").length > 0;
  const input = $f.find("input, textarea, select, button").first();
  if (!input.length) return;
  if (input.is("button")) {
    fields.push({
      type: "submit",
      name: null,
      id: input.attr("id") || null,
      label: textFlat(input.find(".kt-btn-inner-text").first()) || textFlat(input),
      placeholder: null,
      required: false,
    });
    return;
  }
  fields.push({
    type: input.attr("type") || input.prop("tagName")?.toLowerCase?.() || input[0].name,
    name: input.attr("name") || null,
    id: input.attr("id") || null,
    label: input.attr("data-label") || label,
    placeholder: (input.attr("placeholder") || "").replace(/^\s+/, "") || null,
    required,
  });
});

const hidden = [];
form.find('input[type="hidden"]').each((_, inp) => {
  hidden.push({ name: $(inp).attr("name"), value: $(inp).attr("value") });
});

const vimeoUrls = [];
$("iframe[src*='911448655'], meta[property='og:video']").each((_, el) => {
  const u = $(el).attr("src") || $(el).attr("content");
  if (u && !vimeoUrls.includes(u)) vimeoUrls.push(u);
});
const mp4Urls = [];
$("video source, video, a[href$='.mp4'], source[src*='.mp4']").each((_, el) => {
  const u = $(el).attr("src") || $(el).attr("href");
  if (u && u.includes(".mp4") && !mp4Urls.includes(u)) mp4Urls.push(u);
});

const result = {
  source: "tmp-parity/home.html",
  hero: {
    vimeoIframeSrc: iframeSrc,
    backgroundVideoUrl: null,
    backgroundMp4Url: null,
    ctaHref: cta.attr("href") || null,
    wordpress: {
      title: textFlat(".kt-adv-heading4541_5ddf4f-b9"),
      subtitle: textFlat(".kt-adv-heading4541_d365d0-34"),
      ctaText: textFlat(cta.find(".kt-btn-inner-text")),
    },
    interactForced: {
      title: "THE ART OF MARKETING",
      subtitle: "Digital • Media • Branding • Business Development",
      ctaText: "CONNECT WITH US",
    },
  },
  whatWeDoIntro: {
    title: textFlat(".kt-adv-heading4541_f35171-26"),
    description: textFlat(".kt-adv-heading4541_72c33d-12"),
  },
  solutions: {
    sectionTitle: textFlat(
      ".kb-row-layout-id4541_99352b-d8 .kt-adv-heading4541_2190c1-61",
    ),
    subtitleWordpress: textFlat(
      ".kb-row-layout-id4541_99352b-d8 .kt-adv-heading4541_c61f36-a2",
    ),
    subtitleForcedByInteract:
      "Strategy, creative, and media working together — tailored solutions that build visibility and drive measurable growth.",
  },
  brandTabs,
  brandTabsSectionNote: {
    precedingTitle: textFlat("h2.wp-elements-6"),
    precedingDescription: textFlat(
      "h2.wp-elements-6 + p, .entry-content > p.has-text-align-center.wp-block-paragraph",
    ),
  },
  testimonials: {
    sectionTitle: testimonialTitle,
    sectionLead: textFlat(".kadence-column4541_19dd62-f1 p.wp-elements-12"),
    cards: testimonialCards,
  },
  whyChoose: {
    sectionTitle: whyTitle,
    leadParagraph: whyLead,
    metrics,
    tileButtonLabels: tilesUnique.slice(0, 6),
  },
  quote: {
    quoteText,
    attribution: {
      name: attribName,
      role: attribRole,
    },
    photoUrl: quotePhoto.attr("src") || null,
  },
  contact: {
    heading: contactHeading,
    lead: contactLead,
    phone,
    phoneHref,
    email,
    emailHref,
    emailDecodedFromCloudflare: email,
    emailRtlVisibleRaw: emailFromRtl || null,
    addresses: locationsValue ? [locationsValue] : [],
    locationsLabel: "Locations",
    form: {
      id: form.attr("id") || null,
      formPostId: "11283",
      action: form.attr("action") || null,
      method: form.attr("method") || null,
      submitActionHidden: hidden.find((h) => h.name === "action")?.value || null,
      fields,
      hidden,
    },
  },
  heroVideo: {
    vimeoId: "911448655",
    vimeoPlayerUrl:
      vimeoUrls.find((u) => u.includes("player.vimeo.com/video/911448655")) || null,
    vimeoUrls,
    mp4Url: mp4Urls[0] || null,
    mp4Urls,
  },
  instagram: {
    presentInWordpressHtml: $("#sb_instagram").length > 0,
    sectionRowClass: "kb-row-layout-id4541_de853e-ad",
    sectionTitleInWp: textFlat(".kb-row-layout-id4541_de853e-ad p strong"),
    hiddenInNextJs: true,
    hiddenBy:
      "src/styles/wordpress-compat.css rule `.kb-row-layout-id4541_de853e-ad { display: none !important; }` (comment: Hide homepage \"Kosick In Motion\" Instagram section)",
  },
};

writeFileSync("tmp-home-extract.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
