import fs from "node:fs";

const origin = "http://127.0.0.1:3010";
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>https:\/\/www\.kosick\.com([^<]+)<\/loc>/g)].map((match) =>
  match[1] || "/",
);

const pageProblems = [];
const assetProblems = [];
const assets = new Map();
const jsErrors = [];

function collect(html, page) {
  const urls = new Set();
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1];
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) {
      continue;
    }
    let url;
    try {
      url = new URL(raw, `${origin}${page}`);
    } catch {
      continue;
    }
    if (!["http:", "https:"].includes(url.protocol)) continue;
    const host = url.hostname;
    if (
      host === "127.0.0.1" ||
      host === "localhost" ||
      host === "staging.kosick.com" ||
      host === "www.kosick.com" ||
      host === "kosick.com"
    ) {
      urls.add(url.toString());
    }
  }
  return urls;
}

let cursor = 0;
async function pageWorker() {
  while (cursor < paths.length) {
    const page = paths[cursor++];
    try {
      const response = await fetch(`${origin}${page}`, { signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      if (response.status !== 200 || /<title>\s*<\/title>/.test(html) || !/<title/i.test(html)) {
        pageProblems.push({ page, status: response.status });
      }
      for (const url of collect(html, page)) {
        if (!assets.has(url)) assets.set(url, page);
      }
    } catch (error) {
      pageProblems.push({ page, status: 0, error: error instanceof Error ? error.message : "failed" });
    }
    process.stdout.write(`page ${cursor}/${paths.length}\n`);
  }
}

await Promise.all([pageWorker(), pageWorker()]);

const assetList = [...assets.entries()];
let assetCursor = 0;
async function assetWorker() {
  while (assetCursor < assetList.length) {
    const [url, page] = assetList[assetCursor++];
    try {
      const response = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (response.status >= 400) {
        const retry = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(20000) });
        if (retry.status >= 400) assetProblems.push({ url, status: retry.status, page });
      }
    } catch (error) {
      assetProblems.push({ url, status: 0, page, error: error instanceof Error ? error.message : "failed" });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, assetWorker));

const report = { pages: paths.length, assets: assetList.length, pageProblems, assetProblems };
fs.writeFileSync("tmp-audit/link-check.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: paths.length, assets: assetList.length, pageProblems: pageProblems.length, assetProblems: assetProblems.length }, null, 2));
for (const item of pageProblems) console.log("PAGE", item.status, item.page, item.error || "");
for (const item of assetProblems.slice(0, 40)) console.log("ASSET", item.status, item.url);
