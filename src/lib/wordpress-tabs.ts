import { extractBalanced } from "@/lib/wordpress-html";

const TAB_INDEXES = Array.from({ length: 24 }, (_, index) => index + 1);

export const KADENCE_TABS_COMPAT_CSS = `
.kt-tabs-wrap .kt-tabs-content-wrap > .kt-tab-inner-content,
.kt-tabs-wrap .kt-tabs-content-wrap > .wp-block-kadence-tab {
  display: none;
}
${TAB_INDEXES.map(
  (tab) =>
    `.kt-tabs-wrap.kt-active-tab-${tab} > .kt-tabs-content-wrap > .kt-inner-tab-${tab}`,
).join(",\n")} {
  display: block;
}
`.trim();

function setAttr(tag: string, name: string, value: string): string {
  const pattern = new RegExp(`\\b${name}=(['"])[^'"]*\\1`, "i");
  if (pattern.test(tag)) {
    return tag.replace(pattern, `${name}="${value}"`);
  }
  return tag.replace(/(\s*\/?>)$/, ` ${name}="${value}"$1`);
}

function setStyleDisplay(tag: string, display: "block" | "none"): string {
  if (/\bstyle=/i.test(tag)) {
    return tag.replace(/\bstyle=(['"])([\s\S]*?)\1/i, (_full, quote: string, value: string) => {
      const cleaned = value.replace(/display\s*:\s*[^;]*;?/gi, "").trim();
      const next = `${cleaned}${cleaned && !cleaned.endsWith(";") ? ";" : ""}display:${display}`;
      return `style=${quote}${next}${quote}`;
    });
  }
  return tag.replace(/^(<[a-zA-Z0-9-]+)/, `$1 style="display:${display}"`);
}

function replaceClass(tag: string, from: string, to: string): string {
  if (new RegExp(`\\b${to}\\b`).test(tag)) {
    return tag.replace(new RegExp(`\\s*\\b${from}\\b`, "g"), "");
  }
  if (new RegExp(`\\b${from}\\b`).test(tag)) {
    return tag.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  }
  if (/\bclass=/.test(tag)) {
    return tag.replace(/\bclass=(['"])/i, `class=$1${to} `);
  }
  return tag.replace(/^(<[a-zA-Z0-9-]+)/, `$1 class="${to}"`);
}

function readActiveTab(openTag: string, html: string): string {
  return (
    openTag.match(/\bkt-active-tab-(\d+)/)?.[1] ||
    html.match(/\bkt-title-item-(\d+)[^"']*\bkt-tab-title-active\b/)?.[1] ||
    html.match(/\bkt-tab-title-active\b[^"']*\bkt-title-item-(\d+)/)?.[1] ||
    html.match(/\bdata-tab=['"](\d+)['"]/)?.[1] ||
    "1"
  );
}

function mapTopLevelDivs(
  html: string,
  map: (tag: string, inner: string) => string,
): string {
  let output = "";
  let cursor = 0;

  while (cursor < html.length) {
    const start = html.indexOf("<div", cursor);
    if (start < 0) {
      output += html.slice(cursor);
      break;
    }

    output += html.slice(cursor, start);
    const block = extractBalanced(html, start, "<div", "</div>");
    const tagEnd = block.indexOf(">") + 1;
    output += map(block.slice(0, tagEnd), block.slice(tagEnd, -"</div>".length));
    cursor = start + block.length;
  }

  return output;
}

function hydrateTabList(html: string, activeTab: string): string {
  return html.replace(/<li\b[^>]*>[\s\S]*?<\/li>/gi, (item) => {
    const tab =
      item.match(/\bkt-title-item-(\d+)/)?.[1] ||
      item.match(/\bdata-tab=['"](\d+)['"]/)?.[1];
    if (!tab) return item;

    const isActive = tab === activeTab;
    let next = item.replace(/<li\b[^>]*>/i, (tag) => {
      let updated = replaceClass(
        tag,
        isActive ? "kt-tab-title-inactive" : "kt-tab-title-active",
        isActive ? "kt-tab-title-active" : "kt-tab-title-inactive",
      );
      return updated;
    });

    next = next.replace(/<a\b[^>]*>/i, (tag) => {
      let updated = setAttr(tag, "role", "tab");
      updated = setAttr(updated, "aria-selected", String(isActive));
      updated = setAttr(updated, "tabindex", isActive ? "0" : "-1");
      return updated;
    });

    return next;
  });
}

function hydrateContentWrap(html: string, activeTab: string): string {
  return mapTopLevelDivs(html, (tag, inner) => {
    const isPanel = /(?:^|["'\s])kt-tab-inner-content(?:["'\s]|$)/.test(tag) || /\bwp-block-kadence-tab\b/.test(tag);
    const isAccordion = /\bkt-tabs-accordion-title\b/.test(tag);
    const tab =
      tag.match(/\bkt-inner-tab-(\d+)/)?.[1] ||
      tag.match(/\bkt-title-item-(\d+)/)?.[1] ||
      inner.match(/\bdata-tab=['"](\d+)['"]/)?.[1];

    if (isPanel && tab) {
      const isActive = tab === activeTab;
      let nextTag = setAttr(tag, "role", "tabpanel");
      nextTag = setAttr(nextTag, "aria-hidden", String(!isActive));
      nextTag = setStyleDisplay(nextTag, isActive ? "block" : "none");
      return `${nextTag}${hydrateKadenceTabsHtml(inner)}</div>`;
    }

    if (isAccordion && tab) {
      const isActive = tab === activeTab;
      const nextTag = replaceClass(
        tag,
        isActive ? "kt-tab-title-inactive" : "kt-tab-title-active",
        isActive ? "kt-tab-title-active" : "kt-tab-title-inactive",
      );
      const nextInner = inner.replace(/<a\b[^>]*>/i, (anchor) => {
        let updated = setAttr(anchor, "aria-selected", String(isActive));
        updated = setAttr(updated, "tabindex", isActive ? "0" : "-1");
        return updated;
      });
      return `${nextTag}${nextInner}</div>`;
    }

    return `${tag}${inner}</div>`;
  });
}

function hydrateOneTabsWrap(block: string): string {
  const openEnd = block.indexOf(">") + 1;
  let open = block.slice(0, openEnd);
  const inner = block.slice(openEnd, -"</div>".length);
  const activeTab = readActiveTab(open, inner);

  if (/\bkt-active-tab-\d+/.test(open)) {
    open = open.replace(/\bkt-active-tab-\d+/g, `kt-active-tab-${activeTab}`);
  } else if (/\bclass=/.test(open)) {
    open = open.replace(/\bclass=(['"])/i, `class=$1kt-active-tab-${activeTab} `);
  } else {
    open = open.replace(/^(<div)/i, `$1 class="kt-active-tab-${activeTab}"`);
  }

  const nextInner = inner.replace(
    /<ul\b[^>]*\bkt-tabs-title-list\b[^>]*>[\s\S]*?<\/ul>/i,
    (list) => {
      const tagEnd = list.indexOf(">") + 1;
      const tag = setAttr(list.slice(0, tagEnd), "role", "tablist");
      return `${tag}${hydrateTabList(list.slice(tagEnd, -"</ul>".length), activeTab)}</ul>`;
    },
  );

  return `${open}${mapTopLevelDivs(nextInner, (tag, contents) => {
    if (/\bkt-tabs-content-wrap\b/.test(tag)) {
      return `${tag}${hydrateContentWrap(contents, activeTab)}</div>`;
    }
    return `${tag}${contents}</div>`;
  })}</div>`;
}

export function hydrateKadenceTabsHtml(html: string): string {
  const pattern = /<div\b[^>]*\bkt-tabs-wrap\b[^>]*>/gi;
  let output = "";
  let cursor = 0;

  for (const match of html.matchAll(pattern)) {
    if (match.index === undefined) continue;
    const block = extractBalanced(html, match.index, "<div", "</div>");
    output += html.slice(cursor, match.index) + hydrateOneTabsWrap(block);
    cursor = match.index + block.length;
  }

  return output + html.slice(cursor);
}
