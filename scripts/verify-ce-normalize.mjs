import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// Load TS via next/tsx if available; otherwise spawn note.
const html = readFileSync("tmp-parity/rest/corporate-events.html", "utf8");
const metaRaw = readFileSync("tmp-parity/rest/corporate-events.meta.json", "utf8").replace(/^\uFEFF/, "");
const meta = JSON.parse(metaRaw);

const { normalizeServicePageHtml } = await import(
  "../src/lib/wordpress/service-page-parse.ts"
);

const content = normalizeServicePageHtml(
  html,
  meta.title || "Corporate Events",
  meta.excerpt || "",
);

const summary = {
  title: content.title,
  heroSlides: content.hero.slides.length,
  hero: {
    eyebrow: content.hero.eyebrow,
    displayTitle: content.hero.displayTitle,
    subtitle: content.hero.subtitle,
    cta: content.hero.cta,
  },
  features: content.features.map((f) => ({
    eyebrow: f.eyebrow,
    title: f.title,
    bullets: f.bullets?.length || 0,
    hasImage: Boolean(f.image?.src),
    cta: f.cta?.label,
  })),
  processSteps: content.processSection?.steps?.length || 0,
  processTitle: content.processSection?.title || content.processSection?.eyebrow,
  videos: content.videoSections.map((v) => v.src),
  promoBand: content.promoBand
    ? {
        eyebrow: content.promoBand.eyebrow,
        title: content.promoBand.title,
        bodyLen: content.promoBand.body?.length || 0,
        cta: content.promoBand.cta?.label,
        bg: content.promoBand.backgroundImage,
      }
    : null,
  faqs: content.faqs?.items?.length || 0,
  faqTitle: content.faqs?.title,
  related: content.relatedServices.map((r) => ({
    title: r.title,
    items: r.items.length,
    image: r.image?.src || null,
  })),
  cta: content.cta
    ? { title: content.cta.title, primary: content.cta.primary?.label }
    : null,
};

writeFileSync("tmp-parity/rest/corporate-events.normalized.json", JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
