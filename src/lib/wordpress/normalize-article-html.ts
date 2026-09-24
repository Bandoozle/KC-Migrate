import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { getWordPressUrl } from "@/lib/wordpress";
import { absUrl, cleanText, toLocalPath } from "@/lib/wordpress/shared";

const ALLOWED_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "figure",
  "figcaption",
  "blockquote",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "strong",
  "em",
  "b",
  "i",
  "br",
  "hr",
  "iframe",
  "div",
  "span",
]);

const UNWRAP_SELECTORS = [
  "style",
  "script",
  "noscript",
  ".kb-row-layout-wrap",
  ".kt-row-column-wrap",
  ".wp-block-kadence-column",
  ".kt-inside-inner-col",
  ".wp-block-kadence-image",
  ".wp-block-kadence-advancedbtn",
  ".kb-buttons-wrap",
  ".wp-block-group",
  ".wp-block-group__inner-container",
  ".wp-block-embed__wrapper",
  ".kt-blocks-carousel",
  ".splide",
  ".splide__track",
  ".splide__list",
  ".kb-slide-item",
  ".kadence-blocks-gallery-item",
  ".kb-gallery-ul",
  ".kb-gallery-wrap-id",
  ".wp-block-kadence-advancedgallery",
];

/**
 * Transform WordPress/Kadence post HTML into semantic markup styled by Next.js.
 * When a lead image is rendered above the body, opening media blocks are deferred
 * until after the next text block so two large images are not stacked.
 */
export function normalizeArticleHtml(
  html: string,
  origin = getWordPressUrl(),
  options?: { hasLeadingMedia?: boolean },
): string {
  if (!html.trim()) return "";

  const $ = cheerio.load(`<div id="article-root">${html}</div>`, {
    xml: false,
  });
  const root = $("#article-root");

  root.find("style, script, noscript").remove();

  // Kadence buttons → paragraph with link
  root.find("a.kb-button, a.kt-button, a.wp-block-button__link").each((_, el) => {
    const $el = $(el);
    const href = rewriteHref($el.attr("href"), origin);
    const label =
      cleanText($el.find(".kt-btn-inner-text").text()) || cleanText($el.text());
    if (!href || !label) {
      $el.remove();
      return;
    }
    $el.replaceWith(
      `<p class="article-cta"><a href="${escapeAttr(href)}">${escapeText(label)}</a></p>`,
    );
  });
  root.find(".wp-block-kadence-advancedbtn, .kb-buttons-wrap, .wp-block-buttons").each((_, el) => {
    const $el = $(el);
    if (!$el.find("a, p.article-cta").length) $el.remove();
    else $el.replaceWith($el.contents());
  });

  // Advanced gallery / carousel → simple figure list
  root
    .find(".wp-block-kadence-advancedgallery, .kb-gallery-ul, .wp-block-gallery")
    .each((_, el) => {
      const $el = $(el);
      const figures: string[] = [];
      $el.find("img").each((__, img) => {
        const normalized = normalizeImage($, img, origin);
        if (normalized) figures.push(`<figure>${normalized}</figure>`);
      });
      if (figures.length === 0) {
        $el.remove();
        return;
      }
      $el.replaceWith(`<div class="article-gallery">${figures.join("")}</div>`);
    });

  // Unwrap layout chrome (repeat for nesting)
  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    for (const selector of UNWRAP_SELECTORS) {
      root.find(selector).each((_, el) => {
        const $el = $(el);
        if ($el.is("style, script, noscript")) {
          $el.remove();
          changed = true;
          return;
        }
        $el.replaceWith($el.contents());
        changed = true;
      });
    }
    if (!changed) break;
  }

  // Normalize remaining images
  root.find("img").each((_, img) => {
    const htmlImg = normalizeImage($, img, origin);
    if (!htmlImg) {
      $(img).remove();
      return;
    }
    const $img = $(img);
    if ($img.parent().is("figure")) {
      $img.replaceWith(htmlImg);
    } else {
      $img.replaceWith(`<figure>${htmlImg}</figure>`);
    }
  });

  // Embeds / iframes
  root.find("iframe").each((_, el) => {
    const $el = $(el);
    const src = absUrl($el.attr("src"), origin);
    if (!src || !isAllowedEmbed(src)) {
      $el.remove();
      return;
    }
    const title = escapeAttr($el.attr("title") || "Embedded media");
    const allow = escapeAttr(
      $el.attr("allow") ||
        "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share",
    );
    $el.replaceWith(
      `<figure class="article-embed"><iframe src="${escapeAttr(src)}" title="${title}" allow="${allow}" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></figure>`,
    );
  });

  // Links
  root.find("a[href]").each((_, el) => {
    const $el = $(el);
    const href = rewriteHref($el.attr("href"), origin);
    if (!href) {
      $el.replaceWith($el.contents());
      return;
    }
    $el.attr("href", href);
    if (/^https?:\/\//i.test(href) && !href.startsWith(origin)) {
      $el.attr("target", "_blank");
      $el.attr("rel", "noopener noreferrer");
    } else {
      $el.removeAttr("target");
      $el.removeAttr("rel");
    }
  });

  // Strip presentation attributes / empty spans
  root.find("*").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName?.toLowerCase();
    if (!tag) return;

    if (!ALLOWED_TAGS.has(tag)) {
      $el.replaceWith($el.contents());
      return;
    }

    const keep = keepAttributes(tag, $el.get(0) as Element);
    Object.keys(el.attribs || {}).forEach((name) => {
      if (!keep.has(name.toLowerCase())) $el.removeAttr(name);
    });

    // Drop empty decorative wrappers
    if (
      (tag === "div" || tag === "span") &&
      !$el.text().trim() &&
      $el.find("img, iframe, table").length === 0
    ) {
      $el.remove();
    }
  });

  // Promote leftover divs that only wrap block content
  root.find("div").each((_, el) => {
    const $el = $(el);
    const cls = $el.attr("class") || "";
    if (cls === "article-gallery" || cls === "article-embed") return;
    $el.replaceWith($el.contents());
  });

  // Spans → unwrap
  root.find("span").each((_, el) => {
    $(el).replaceWith($(el).contents());
  });

  separateConsecutiveMedia($, root, Boolean(options?.hasLeadingMedia));

  return root.html()?.trim() || "";
}

function blockKind($: cheerio.CheerioAPI, el: Element): "media" | "text" | "other" {
  const tag = el.tagName?.toLowerCase();
  if (!tag) return "other";

  if (tag === "img") return "media";
  if (tag === "div" && ($(el).attr("class") || "") === "article-gallery") return "media";
  if (tag === "figure") {
    if (($(el).attr("class") || "").includes("article-embed")) return "other";
    if ($(el).find("img").length > 0) return "media";
    return "other";
  }

  if (["h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "blockquote", "table", "p"].includes(tag)) {
    return cleanText($(el).text()).length > 0 ? "text" : "other";
  }

  return "other";
}

/**
 * Move a media block that sits directly against another image until after the
 * next paragraph, heading, list, quote, or table. Captions stay inside the figure.
 */
function separateConsecutiveMedia(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<AnyNode>,
  hasLeadingMedia: boolean,
) {
  const elements = root
    .children()
    .toArray()
    .filter((node): node is Element => node.type === "tag");
  if (elements.length < 2 && !hasLeadingMedia) return;

  const blocks = elements.map((el) => ({ el, kind: blockKind($, el) }));
  const output: Element[] = [];
  const deferred: Element[] = [];
  let previous: "media" | "text" | null = hasLeadingMedia ? "media" : null;

  const nextSignificant = (index: number): "media" | "text" | null => {
    for (let cursor = index + 1; cursor < blocks.length; cursor += 1) {
      const kind = blocks[cursor].kind;
      if (kind !== "other") return kind;
    }
    return null;
  };

  blocks.forEach((block, index) => {
    if (block.kind === "media") {
      if (previous === "media") deferred.push(block.el);
      else {
        output.push(block.el);
        previous = "media";
      }
      return;
    }

    if (block.kind === "text") {
      output.push(block.el);
      previous = "text";
      if (deferred.length > 0 && nextSignificant(index) !== "media") {
        output.push(deferred.shift() as Element);
      }
      return;
    }

    output.push(block.el);
  });

  output.push(...deferred);
  root.empty();
  output.forEach((el) => root.append(el));
}

function keepAttributes(tag: string, el: Element): Set<string> {
  const keep = new Set<string>();
  if (tag === "a") {
    keep.add("href");
    keep.add("target");
    keep.add("rel");
  }
  if (tag === "img") {
    keep.add("src");
    keep.add("alt");
    keep.add("width");
    keep.add("height");
    keep.add("loading");
    keep.add("decoding");
    keep.add("srcset");
    keep.add("sizes");
    if (el.attribs?.class === "article-image-inline") keep.add("class");
  }
  if (tag === "iframe") {
    keep.add("src");
    keep.add("title");
    keep.add("allow");
    keep.add("allowfullscreen");
    keep.add("loading");
    keep.add("referrerpolicy");
  }
  if (tag === "td" || tag === "th") {
    keep.add("colspan");
    keep.add("rowspan");
  }
  if (tag === "div" || tag === "figure" || tag === "p") {
    const cls = el.attribs?.class;
    if (
      cls === "article-gallery" ||
      cls === "article-embed" ||
      cls === "article-cta"
    ) {
      keep.add("class");
    }
  }
  return keep;
}

function normalizeImage(
  $: cheerio.CheerioAPI,
  img: AnyNode,
  origin: string,
): string | null {
  const $img = $(img);
  const src = absUrl($img.attr("src") || $img.attr("data-src"), origin);
  if (!src || src.startsWith("data:")) return null;
  const alt = escapeAttr($img.attr("alt") || "");
  const srcset = rewriteSrcset($img.attr("srcset"), origin);
  const widthAttr = $img.attr("width");
  const heightAttr = $img.attr("height");
  const width = Number(widthAttr);
  const inline = Number.isFinite(width) && width > 0 && width < 200;
  const parts = [
    `src="${escapeAttr(src)}"`,
    `alt="${alt}"`,
    `loading="lazy"`,
    `decoding="async"`,
  ];
  if (inline) parts.push(`class="article-image-inline"`);
  if (srcset) parts.push(`srcset="${escapeAttr(srcset)}"`);
  parts.push(`sizes="min(1290px, 100vw)"`);
  if (widthAttr && /^\d+$/.test(widthAttr)) parts.push(`width="${widthAttr}"`);
  if (heightAttr && /^\d+$/.test(heightAttr)) parts.push(`height="${heightAttr}"`);
  return `<img ${parts.join(" ")} />`;
}

function rewriteSrcset(srcset: string | undefined, origin: string): string | null {
  if (!srcset) return null;
  const parts = srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [url, descriptor] = part.split(/\s+/, 2);
      const abs = absUrl(url, origin);
      if (!abs) return null;
      return descriptor ? `${abs} ${descriptor}` : abs;
    })
    .filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function rewriteHref(href: string | undefined, origin: string): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith("#")) return trimmed || null;
  if (/^javascript:/i.test(trimmed)) return null;
  if (trimmed.startsWith("tel:") || trimmed.startsWith("mailto:")) return trimmed;

  const abs = absUrl(trimmed, origin);
  if (!abs) return null;

  // Media / file URLs stay absolute
  if (/\.(png|jpe?g|gif|webp|avif|svg|pdf|mp4|webm)(\?|$)/i.test(abs)) {
    return abs;
  }

  const local = toLocalPath(abs, origin);
  return local || abs;
}

function isAllowedEmbed(src: string): boolean {
  try {
    const host = new URL(src).hostname.replace(/^www\./, "");
    return (
      host === "player.vimeo.com" ||
      host === "vimeo.com" ||
      host === "youtube.com" ||
      host === "youtube-nocookie.com" ||
      host === "youtu.be"
    );
  } catch {
    return false;
  }
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
