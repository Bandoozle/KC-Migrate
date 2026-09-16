export function extractBalanced(
  html: string,
  start: number,
  open: string,
  close: string,
): string {
  let depth = 0;
  let index = start;

  while (index < html.length) {
    if (html.startsWith(open, index)) {
      const next = html[index + open.length];
      if (
        next === " " ||
        next === ">" ||
        next === "\n" ||
        next === "\r" ||
        next === "\t" ||
        next === "/"
      ) {
        depth += 1;
        index += open.length;
        continue;
      }
    }

    if (html.startsWith(close, index)) {
      depth -= 1;
      index += close.length;
      if (depth === 0) {
        return html.slice(start, index);
      }
      continue;
    }

    index += 1;
  }

  return html.slice(start);
}

export function stripScriptTags(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "");
}

export function stripWordPressRuntimeNoise(html: string): string {
  return stripScriptTags(html)
    .replace(/<!-- Google Tag Manager[\s\S]*?End Google Tag Manager \(noscript\) -->/gi, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
}
