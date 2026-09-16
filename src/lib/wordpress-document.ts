import { cache } from "react";
import { getWordPressUrl } from "@/lib/wordpress";
import { extractBalanced, stripWordPressRuntimeNoise } from "@/lib/wordpress-html";
import {
  isLocalInterFontPath,
  keepInterFontFaces,
  neutralizeLegacyTextFonts,
} from "@/lib/wordpress-typography";
import {
  isWordPressFontStylesheet,
  normalizeWordPressAssetUrl,
  prepareWordPressHtml,
  rewriteInlineCssAssetUrls,
  stylesheetFetchUrl,
} from "@/lib/wordpress-urls";
import type { WordPressPreload, WordPressStylesheet } from "@/lib/wordpress-assets";

export type WordPressDocument = {
  url: string;
  htmlLang: string;
  bodyClass: string;
  stylesheets: WordPressStylesheet[];
  preloads: WordPressPreload[];
  inlineCss: string;
  skipLinkHtml: string;
  headerHtml: string;
  innerWrapHtml: string;
  hookHtml: string;
  footerHtml: string;
  drawerHtml: string;
  extrasHtml: string;
  hasSingleEntryContent: boolean;
};

function localizeAssetUrl(href: string, origin: string): string {
  const base = origin.replace(/\/+$/, "");
  if (href.startsWith(base)) {
    const path = href.slice(base.length);
    if (path.startsWith("/wp-content/") || path.startsWith("/wp-includes/")) {
      return path;
    }
  }
  return href;
}

function parseStylesheets(html: string, origin: string): WordPressStylesheet[] {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => /rel=['"]stylesheet['"]/i.test(tag))
    .map((tag, index) => {
      const href = tag.match(/href=['"]([^'"]+)/i)?.[1];
      const id = tag.match(/id=['"]([^'"]+)/i)?.[1] ?? `stylesheet-${index}`;
      if (!href) return null;
      return { id, href: localizeAssetUrl(href, origin) };
    })
    .filter((sheet): sheet is WordPressStylesheet => Boolean(sheet));
}

function parsePreloads(html: string, origin: string): WordPressPreload[] {
  const items: WordPressPreload[] = [];

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/rel=['"]preload['"]/i.test(tag)) continue;
    const href = tag.match(/href=['"]([^'"]+)/i)?.[1];
    if (!href) continue;

    const as = tag.match(/\bas=['"]([^'"]+)/i)?.[1];
    const type = tag.match(/\btype=['"]([^'"]+)/i)?.[1];
    const nextHref = normalizeWordPressAssetUrl(href, origin);

    if (as === "style" && isWordPressFontStylesheet(href)) continue;
    if (as === "font" && !isLocalInterFontPath(nextHref)) continue;

    items.push({
      href: nextHref,
      ...(as ? { as } : {}),
      ...(type ? { type } : {}),
      ...(as === "font" || /crossorigin/i.test(tag)
        ? { crossOrigin: "anonymous" as const }
        : {}),
    });
  }

  return items;
}

function parseInlineCss(html: string, origin: string): string {
  return neutralizeLegacyTextFonts(
    rewriteInlineCssAssetUrls(
      [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)]
        .map((match) => match[1].trim())
        .filter(Boolean)
        .join("\n\n"),
      origin,
    ),
  );
}

function extractById(html: string, id: string, tag: string): string {
  const marker = `id="${id}"`;
  const idIndex = html.indexOf(marker);
  if (idIndex < 0) return "";
  const start = html.lastIndexOf(`<${tag}`, idIndex);
  if (start < 0) return "";
  return extractBalanced(html, start, `<${tag}`, `</${tag}>`);
}

function extractHookHtml(html: string): string {
  const mainClose = html.indexOf("</main>");
  const footerMarker = html.indexOf('id="colophon"');
  if (mainClose < 0 || footerMarker < 0 || footerMarker < mainClose) return "";

  const footerStart = html.lastIndexOf("<footer", footerMarker);
  if (footerStart < 0 || footerStart < mainClose) return "";

  return html.slice(mainClose + "</main>".length, footerStart);
}

function prepareMarkup(html: string, origin: string): string {
  return prepareWordPressHtml(stripWordPressRuntimeNoise(html), origin);
}

export function replaceSingleEntryContent(html: string, nextInnerHtml: string): string {
  const open = html.match(
    /<div class="entry-content(?:\s[^"]*)*single-content(?:\s[^"]*)*"[^>]*>/i,
  );
  if (!open || open.index === undefined) {
    return html;
  }

  const block = extractBalanced(html, open.index, "<div", "</div>");
  if (!block) return html;

  return (
    html.slice(0, open.index) +
    open[0] +
    nextInnerHtml +
    "</div>" +
    html.slice(open.index + block.length)
  );
}

function parseDocument(html: string, url: string, origin: string): WordPressDocument {
  const bodyClass = html.match(/<body\b[^>]*class="([^"]+)"/i)?.[1] ?? "";
  const htmlLang = html.match(/<html\b[^>]*lang="([^"]+)"/i)?.[1] ?? "en-US";
  const headerHtml = prepareMarkup(extractById(html, "masthead", "header"), origin);
  const footerHtml = prepareMarkup(extractById(html, "colophon", "footer"), origin);
  const innerWrapHtml = prepareMarkup(extractById(html, "inner-wrap", "main"), origin);
  const hookHtml = prepareMarkup(extractHookHtml(html), origin);
  const drawerHtml = prepareMarkup(extractById(html, "mobile-drawer", "div"), origin);
  const skipLinkHtml = prepareMarkup(
    html.match(/<a class="skip-link[\s\S]*?<\/a>/i)?.[0] ?? "",
    origin,
  );
  const scrollUp = [
    extractById(html, "kt-scroll-up", "a"),
    extractById(html, "kt-scroll-up-reader", "button"),
  ]
    .filter(Boolean)
    .join("");

  return {
    url,
    htmlLang,
    bodyClass,
    stylesheets: parseStylesheets(html, origin),
    preloads: parsePreloads(html, origin),
    inlineCss: parseInlineCss(html, origin),
    skipLinkHtml,
    headerHtml,
    innerWrapHtml,
    hookHtml,
    footerHtml,
    drawerHtml,
    extrasHtml: prepareMarkup(scrollUp, origin),
    hasSingleEntryContent: /entry-content[^"]*single-content|single-content[^"]*entry-content/.test(
      html,
    ),
  };
}

async function inlineWordPressFontCss(
  document: WordPressDocument,
  origin: string,
): Promise<WordPressDocument> {
  const fontSheets = document.stylesheets.filter((sheet) =>
    isWordPressFontStylesheet(sheet.href),
  );
  if (fontSheets.length === 0) return document;

  const fontCss = (
    await Promise.all(
      fontSheets.map(async (sheet) => {
        const response = await fetch(stylesheetFetchUrl(sheet.href, origin), {
          headers: { Accept: "text/css" },
          next: { revalidate: 3600 },
        });
        if (!response.ok) return "";
        return keepInterFontFaces(
          rewriteInlineCssAssetUrls(await response.text(), origin),
        );
      }),
    )
  )
    .filter(Boolean)
    .join("\n\n");

  return {
    ...document,
    stylesheets: document.stylesheets.filter(
      (sheet) => !isWordPressFontStylesheet(sheet.href),
    ),
    inlineCss: neutralizeLegacyTextFonts(
      [document.inlineCss, fontCss].filter(Boolean).join("\n\n"),
    ),
  };
}

export const getWordPressDocument = cache(async (url: string): Promise<WordPressDocument> => {
  const origin = getWordPressUrl();
  const response = await fetch(url, {
    headers: { Accept: "text/html" },
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error(`Unable to fetch WordPress document ${url}: ${response.status}`);
  }

  return inlineWordPressFontCss(
    parseDocument(await response.text(), url, origin),
    origin,
  );
});
