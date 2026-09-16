import { writeFileSync, mkdirSync } from "node:fs";

const pages = [
  { name: "home", url: "https://staging.kosick.com/" },
  { name: "services", url: "https://staging.kosick.com/services/" },
  { name: "digital-marketing", url: "https://staging.kosick.com/services/digital-marketing/" },
  { name: "corporate-branding", url: "https://staging.kosick.com/services/corporate-branding/" },
  { name: "contact", url: "https://staging.kosick.com/contact/" },
  { name: "feature-articles", url: "https://staging.kosick.com/feature-articles/" },
];

mkdirSync("tmp-parity", { recursive: true });

function extract(html, startToken, endToken) {
  const start = html.indexOf(startToken);
  if (start < 0) return "";
  const end = html.indexOf(endToken, start);
  if (end < 0) return html.slice(start);
  return html.slice(start, end + endToken.length);
}

for (const page of pages) {
  const html = await fetch(page.url).then((res) => res.text());
  writeFileSync(`tmp-parity/${page.name}.html`, html);

  const bodyClass = html.match(/<body[^>]*class="([^"]+)"/)?.[1] ?? "";
  const stylesheets = [...html.matchAll(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi)].map((m) => {
    const href = m[0].match(/href=['"]([^'"]+)/)?.[1];
    const id = m[0].match(/id=['"]([^'"]+)/)?.[1];
    return { id, href };
  });
  const styleIds = [...html.matchAll(/<style[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  const styleSizes = [...html.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map((m) => ({
    id: m[1].match(/id="([^"]+)"/)?.[1] ?? "(none)",
    length: m[2].length,
  }));
  const fonts = [...html.matchAll(/font-family:([^;}{]+)/gi)].slice(0, 20).map((m) => m[1].trim());
  const preloads = [...html.matchAll(/<link[^>]+rel=['"]preload['"][^>]*>/gi)].map((m) => m[0]);

  const wrapperIds = ["wrapper", "inner-wrap", "page", "masthead", "colophon", "content"];
  const ids = {};
  for (const id of wrapperIds) {
    ids[id] = html.includes(`id="${id}"`);
  }

  const contentMarker = html.indexOf('class="entry-content');
  const before = html.slice(Math.max(0, contentMarker - 800), contentMarker);
  const article = html.match(/<article[^>]*>/)?.[0];
  const primary = html.match(/<div id="primary"[^>]*>/)?.[0];
  const contentContainer = html.match(/<div class="content-container[^"]*"/)?.[0];

  console.log("\n==========", page.name, html.length);
  console.log("BODY", bodyClass);
  console.log("SHEETS");
  for (const sheet of stylesheets) console.log(" ", sheet.id, sheet.href);
  console.log("STYLE TAGS", styleSizes);
  console.log("PRELOADS", preloads.length);
  console.log("IDS", ids);
  console.log("ARTICLE", article);
  console.log("PRIMARY", primary);
  console.log("CONTAINER", contentContainer);
  console.log("BEFORE CONTENT:\n", before.replace(/\s+/g, " ").slice(-500));
}
