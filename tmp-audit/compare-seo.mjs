import fs from "node:fs";

const localOrigin = process.env.LOCAL_ORIGIN || "http://127.0.0.1:3010";
const liveOrigin = "https://www.kosick.com";

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function headOf(html) {
  return html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
}

function meta(head, name) {
  const tags = head.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const key = tag.match(/\b(?:name|property)\s*=\s*(["'])([\s\S]*?)\1/i)?.[2]?.toLowerCase() || "";
    if (key !== name) continue;
    return decode(tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] || "");
  }
  return "";
}

function canonical(head) {
  const tags = head.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const rel = tag.match(/\brel\s*=\s*(["'])([\s\S]*?)\1/i)?.[2]?.toLowerCase() || "";
    if (!rel.split(/\s+/).includes("canonical")) continue;
    return decode(tag.match(/\bhref\s*=\s*(["'])([\s\S]*?)\1/i)?.[2] || "");
  }
  return "";
}

function title(head) {
  return decode(head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) =>
    decode(match[1] || ""),
  );
}

async function text(url) {
  const response = await fetch(url, { redirect: "follow" });
  return { status: response.status, type: response.headers.get("content-type") || "", body: await response.text(), final: response.url };
}

const sitemap = await text(`${localOrigin}/sitemap.xml`);
const urls = locs(sitemap.body).filter((url) => url.startsWith(liveOrigin));
const mismatches = [];
let index = 0;

async function worker() {
  while (index < urls.length) {
    const url = urls[index++];
    const path = new URL(url).pathname;
    const [live, local] = await Promise.all([
      text(url),
      text(`${localOrigin}${path}`),
    ]);
    const liveHead = headOf(live.body);
    const localHead = headOf(local.body);
    const row = {
      path,
      localStatus: local.status,
      liveStatus: live.status,
      title: title(localHead) === title(liveHead),
      description: meta(localHead, "description") === meta(liveHead, "description"),
      canonical: canonical(localHead) === canonical(liveHead),
      localTitle: title(localHead),
      liveTitle: title(liveHead),
      localDescription: meta(localHead, "description"),
      liveDescription: meta(liveHead, "description"),
      localCanonical: canonical(localHead),
      liveCanonical: canonical(liveHead),
      gtm: /googletagmanager\.com\/gtm\.js/.test(local.body),
    };
    if (!row.title || !row.description || !row.canonical || row.localStatus !== 200) {
      mismatches.push(row);
    }
    process.stdout.write(`${path} ${local.status} title=${row.title} desc=${row.description} canon=${row.canonical}\n`);
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
fs.mkdirSync("tmp-audit", { recursive: true });
fs.writeFileSync(
  "tmp-audit/seo-compare.json",
  JSON.stringify({ count: urls.length, mismatches }, null, 2),
);
console.log(`done ${urls.length} mismatches ${mismatches.length}`);
