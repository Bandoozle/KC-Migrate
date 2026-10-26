const origin = "http://127.0.0.1:3010";
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const redirects = [];
let cursor = 0;

async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    const response = await fetch(url, { redirect: "manual" });
    if (response.status >= 300 && response.status < 400) {
      redirects.push({
        from: new URL(url).pathname,
        status: response.status,
        to: response.headers.get("location"),
      });
    }
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
console.log(JSON.stringify(redirects, null, 2));
console.log("redirects", redirects.length, "of", urls.length);
