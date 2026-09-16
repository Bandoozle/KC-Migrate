import { extractBalanced } from "@/lib/wordpress-html";

export const INSTAGRAM_FEED_SHORTCODE = /\[instagram-feed(?:\s[^\]]*)?\]/gi;

export const INSTAGRAM_FEED_COMPAT_CSS = `
#sb_instagram #sbi_images .sbi_item {
  opacity: 1 !important;
}
#sb_instagram #sbi_images .sbi_item .sbi_photo_wrap::before {
  padding-top: var(--sbi-aspect, 125%);
}
#sb_instagram #sbi_images .sbi_item .sbi_photo {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
#sb_instagram #sbi_images .sbi_item .sbi_photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`.trim();

export function extractInstagramFeedHtml(html: string): string {
  const marker = 'id="sb_instagram"';
  const idIndex = html.indexOf(marker);
  if (idIndex < 0) return "";
  const start = html.lastIndexOf("<div", idIndex);
  if (start < 0) return "";
  return extractBalanced(html, start, "<div", "</div>");
}

export function splitInstagramFeed(html: string): {
  before: string;
  feed: string;
  after: string;
} {
  const feed = extractInstagramFeedHtml(html);
  if (!feed) return { before: html, feed: "", after: "" };
  const start = html.indexOf(feed);
  if (start < 0) return { before: html, feed: "", after: "" };
  return {
    before: html.slice(0, start),
    feed,
    after: html.slice(start + feed.length),
  };
}

export function replaceInstagramFeedShortcodes(html: string, feedHtml: string): string {
  INSTAGRAM_FEED_SHORTCODE.lastIndex = 0;
  if (!INSTAGRAM_FEED_SHORTCODE.test(html)) return html;
  INSTAGRAM_FEED_SHORTCODE.lastIndex = 0;

  if (!feedHtml.trim()) {
    return html.replace(
      INSTAGRAM_FEED_SHORTCODE,
      "<!-- wordpress-instagram-feed: shortcode omitted; no rendered Smash Balloon markup was available -->",
    );
  }

  return html.replace(INSTAGRAM_FEED_SHORTCODE, feedHtml);
}

function decodeHtmlAttr(value: string): string {
  return value
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseFeedSrcSet(raw: string | null): {
  src: string | null;
  srcset: string | null;
  byWidth: Record<string, string>;
} {
  if (!raw) return { src: null, srcset: null, byWidth: {} };
  try {
    const parsed = JSON.parse(decodeHtmlAttr(raw)) as Record<string, string>;
    const src = parsed["640"] || parsed["320"] || parsed["150"] || parsed.d || null;
    const parts: string[] = [];
    if (parsed["320"]) parts.push(`${parsed["320"]} 320w`);
    if (parsed["640"]) parts.push(`${parsed["640"]} 640w`);
    return { src, srcset: parts.length ? parts.join(", ") : null, byWidth: parsed };
  } catch {
    return { src: null, srcset: null, byWidth: {} };
  }
}

function aspectPadding(ratio: string | null): string {
  const match = ratio?.match(/^(\d+)\s*:\s*(\d+)$/);
  if (!match) return "125%";
  return `${(Number(match[2]) / Number(match[1])) * 100}%`;
}

function mergeInlineStyle(tag: string, extra: string): string {
  if (/\bstyle=/i.test(tag)) {
    return tag.replace(/\bstyle=(['"])([\s\S]*?)\1/i, (_full, quote: string, value: string) => {
      const next = `${value}${value.trim().endsWith(";") || !value.trim() ? "" : ";"}${extra}`;
      return `style=${quote}${next}${quote}`;
    });
  }

  return tag.replace(/^(<[a-zA-Z0-9-]+)/, `$1 style="${extra}"`);
}

export function hydrateInstagramFeedHtml(html: string): string {
  let next = html.replace(
    /\bclass="([^"]*\bsbi_item\b[^"]*)"/gi,
    (_full, className: string) =>
      `class="${className
        .replace(/\bsbi_transition\b/g, "")
        .replace(/\bsbi_new\b/g, "")
        .replace(/\s+/g, " ")
        .trim()}"`,
  );

  next = next.replace(/<div\b([^>]*\bid="sb_instagram"[^>]*)>/i, (tag) => {
    const ratio = tag.match(/data-imageaspectratio=(['"])([^'"]*)\1/i)?.[2] ?? "4:5";
    return mergeInlineStyle(tag, `--sbi-aspect:${aspectPadding(ratio)}`);
  });

  return next.replace(
    /<a\b([^>]*\bsbi_photo\b[^>]*)>([\s\S]*?)<\/a>/gi,
    (full, attrs: string, inner: string) => {
      const srcSet = attrs.match(/data-img-src-set=(['"])([\s\S]*?)\1/i)?.[2] ?? null;
      const fullRes = attrs.match(/data-full-res=(['"])([\s\S]*?)\1/i)?.[2] ?? null;
      const parsed = parseFeedSrcSet(srcSet);
      const src = parsed.src || (fullRes ? decodeHtmlAttr(fullRes) : null);
      if (!src) return full;

      const safeSrc = src.replace(/"/g, "&quot;");
      const safeSrcSet = parsed.srcset?.replace(/"/g, "&quot;") ?? "";
      let nextInner = inner.replace(
        /(<img\b[^>]*\bsrc=")([^"]*)("[^>]*>)/i,
        `$1${safeSrc}$3`,
      );
      if (safeSrcSet) {
        if (/\bsrcset=/i.test(nextInner)) {
          nextInner = nextInner.replace(/\bsrcset=(['"])[^'"]*\1/i, `srcset="${safeSrcSet}"`);
        } else {
          nextInner = nextInner.replace(
            /<img\b/i,
            `<img srcset="${safeSrcSet}" sizes="(max-width: 800px) 50vw, 25vw"`,
          );
        }
      }

      const open = mergeInlineStyle(
        `<a${attrs}>`,
        `background-image:url('${safeSrc.replace(/'/g, "%27")}');background-size:cover;background-position:center;background-repeat:no-repeat`,
      );
      return `${open}${nextInner}</a>`;
    },
  );
}

export function hydrateInstagramFeedElement(root: ParentNode | null) {
  if (!root) return;

  const feed = root instanceof Element && root.id === "sb_instagram" ? root : root.querySelector("#sb_instagram");
  const ratio = feed?.getAttribute("data-imageaspectratio") ?? "4:5";
  if (feed instanceof HTMLElement) {
    feed.style.setProperty("--sbi-aspect", aspectPadding(ratio));
  }

  root.querySelectorAll(".sbi_item").forEach((item) => {
    item.classList.remove("sbi_transition", "sbi_new");
  });

  root.querySelectorAll("a.sbi_photo").forEach((anchor) => {
    const img = anchor.querySelector("img");
    if (!img) return;
    const parsed = parseFeedSrcSet(anchor.getAttribute("data-img-src-set"));
    const src = parsed.src || anchor.getAttribute("data-full-res");
    if (!src) return;
    img.setAttribute("src", src);
    if (parsed.srcset) {
      img.setAttribute("srcset", parsed.srcset);
      if (!img.getAttribute("sizes")) {
        img.setAttribute("sizes", "(max-width: 800px) 50vw, 25vw");
      }
    }
    if (anchor instanceof HTMLElement) {
      anchor.style.backgroundImage = `url("${src}")`;
      anchor.style.backgroundSize = "cover";
      anchor.style.backgroundPosition = "center";
      anchor.style.backgroundRepeat = "no-repeat";
    }
  });
}
