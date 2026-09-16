import { extractBalanced } from "@/lib/wordpress-html";

export type CountupOptions = {
  start: number;
  end: number;
  duration: number;
  prefix: string;
  suffix: string;
  separator: string;
  decimal: string;
  decimalPlaces: number;
};

function decodeAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attr(tag: string, name: string): string {
  const match = tag.match(new RegExp(`\\b${name}=(['"])([^'"]*)\\1`, "i"));
  return match ? decodeAttr(match[2]) : "";
}

export function readCountupOptions(tag: string): CountupOptions {
  const rawSeparator = attr(tag, "data-separator");
  const separator = rawSeparator === "true" ? "," : rawSeparator === "false" ? "" : rawSeparator;
  const end = Number(attr(tag, "data-end") || 0);
  const decimalSpaces = attr(tag, "data-decimal-spaces");
  const decimalPlaces = decimalSpaces
    ? Number(decimalSpaces) || 0
    : String(attr(tag, "data-end")).includes(".")
      ? String(attr(tag, "data-end")).split(".")[1]?.length || 0
      : 0;

  return {
    start: Number(attr(tag, "data-start") || 0),
    end,
    duration: Number(attr(tag, "data-duration") || 2),
    prefix: attr(tag, "data-prefix"),
    suffix: attr(tag, "data-suffix"),
    separator,
    decimal: attr(tag, "data-decimal") || ".",
    decimalPlaces,
  };
}

export function readCountupOptionsFromElement(element: HTMLElement): CountupOptions {
  const attrs = [...element.attributes]
    .map((item) => `${item.name}="${item.value.replace(/"/g, "&quot;")}"`)
    .join(" ");
  return readCountupOptions(`<div ${attrs}>`);
}

export function formatCountupValue(value: number, options: CountupOptions): string {
  const negative = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  const [integer, fraction] = absolute.toFixed(options.decimalPlaces).split(".");
  const grouped = options.separator
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, options.separator)
    : integer;
  const decimals =
    options.decimalPlaces > 0 ? `${options.decimal}${fraction}` : "";
  return `${options.prefix}${negative}${grouped}${decimals}${options.suffix}`;
}

export function hydrateKadenceCountupHtml(html: string): string {
  const pattern = /<div\b[^>]*\bwp-block-kadence-countup\b[^>]*>/gi;
  let output = "";
  let cursor = 0;

  for (const match of html.matchAll(pattern)) {
    if (match.index === undefined) continue;
    const block = extractBalanced(html, match.index, "<div", "</div>");
    output += html.slice(cursor, match.index) + hydrateOneCountup(block);
    cursor = match.index + block.length;
  }

  return output + html.slice(cursor);
}

function hydrateOneCountup(block: string): string {
  const openEnd = block.indexOf(">") + 1;
  const open = block.slice(0, openEnd);
  if (!/\bkb-count-up\b/.test(open) || /\bkb-count-up-(?:process|number|title)\b/.test(open)) {
    return block;
  }

  const options = readCountupOptions(open);
  const label = formatCountupValue(options.end, options);
  const inner = block.slice(openEnd, -"</div>".length);

  if (/\bscreen-reader-text\b/.test(inner) && /kb-count-up-number[^>]*>[^<]+</.test(inner)) {
    return block;
  }

  let next = inner.replace(
    /(<div\b[^>]*\bkb-count-up-(?:process|number)\b[^>]*>)([\s\S]*?)(<\/div>)/i,
    (_full, start: string, contents: string, end: string) => {
      const tagged = /\baria-hidden=/.test(start)
        ? start
        : start.replace(/(\s*\/?>)$/, ` aria-hidden="true"$1`);
      const sr = /\bscreen-reader-text\b/.test(inner)
        ? ""
        : `<div class="screen-reader-text">${label}</div>`;
      return `${sr}${tagged}${contents.trim() ? contents : label}${end}`;
    },
  );

  return `${open}${next}</div>`;
}
