import fs from "node:fs";

const urls = JSON.parse(fs.readFileSync(new URL("./wp-urls.json", import.meta.url), "utf8"));
const preview = "https://kc-migrate.vercel.app";

function pathOf(loc) {
  const u = new URL(loc);
  return u.pathname || "/";
}

async function probe(path) {
  const target = new URL(path, preview);
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(target, {
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "KosickPrelaunchAudit/1.0" },
    });
    const location = response.headers.get("location");
    const type = response.headers.get("content-type") || "";
    let title = "";
    let robots = "";
    let canonical = "";
    let description = "";
    if (response.status === 200 && type.includes("text/html")) {
      const html = await response.text();
      title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || "";
      robots = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)?.[0] || "";
      canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
      description =
        html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] ||
        "";
      const gtm = html.includes("GTM-K4QK6SP");
      const staging = (html.match(/staging\.kosick\.com/g) || []).length;
      return {
        path,
        status: response.status,
        ms: Date.now() - started,
        location,
        title: title.slice(0, 140),
        description: description.slice(0, 180),
        robots,
        canonical,
        gtm,
        stagingRefs: staging,
        bytes: html.length,
      };
    }
    return {
      path,
      status: response.status,
      ms: Date.now() - started,
      location,
      type: type.slice(0, 80),
    };
  } catch (error) {
    return { path, status: "error", ms: Date.now() - started, error: String(error.message || error) };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
const queue = urls.map((item) => pathOf(item.loc));
const extra = ["/robots.txt", "/sitemap.xml", "/sitemap_index.xml", "/thanks/", "/comfortmaker/", "/uncorked/", "/analytics"];
for (const path of extra) queue.push(path);

let index = 0;
async function worker() {
  while (index < queue.length) {
    const current = queue[index];
    index += 1;
    const result = await probe(current);
    results.push(result);
    console.log(result.status, result.ms, result.path, result.location || result.error || result.title || "");
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
fs.writeFileSync(new URL("./preview-probe.json", import.meta.url), JSON.stringify(results, null, 2));
console.log("done", results.length);
