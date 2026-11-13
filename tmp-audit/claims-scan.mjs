import { writeFileSync } from "node:fs";

const base = process.env.BASE ?? "http://localhost:3000";
const skipArticles = !process.argv.includes("--articles");

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
let urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const extra = ["/services/medical-aesthetics-marketing/", "/services/construction-marketing/", "/services/specialty-retail-marketing/"];
urls = [...new Set([...urls, ...extra])];

const SITE_PAGES = /^\/(services|marketing-programs|marketing-results|contact|feature-articles|corporate-events|site-map|online-payments|privacy-policy|thanks|about|our-company)\//;
const isArticle = (path) => path !== "/" && !SITE_PAGES.test(path);
if (skipArticles) urls = urls.filter((path) => path === "/" || !isArticle(path));

const patterns = [
  /guarantee/i, /\bensur(e|es|ing)\b/i, /\bwe deliver\b/i, /\bdeliver(s|ing)? (more|real|measurable|proven|results|leads|growth|roi)/i,
  /turn(s|ing)? (every|viewers|clicks|visitors|browsers|followers|listeners|leads|audiences|traffic|attention|interest|subscribers)\b/i,
  /\bincrease (your|sales|revenue|bookings|leads)/i, /\b(get|drive|driving|drives) (more|guaranteed|real|qualified|consistent)\b/i,
  /results guaranteed|proven results|proven to/i, /\bwill (grow|increase|drive|deliver|generate|bring|boost|fill|attract|convert|get|see|rank|double|triple)/i,
  /\b(always|every time|never miss)\b/i, /\btop of google|#1|number one|first page/i, /\bmaximi[sz]e/i,
  /\bboost (your|sales|revenue|bookings|leads)/i, /\bfill (your|the) (schedule|calendar|tee sheet|chairs|rooms|pipeline)/i,
  /\bmore (leads|customers|sales|bookings|patients|calls|clients|revenue|traffic|tee times|jobs)\b/i,
  /\b(skyrocket|explode|dominate|instantly)\b/i, /\bresults that\b/i, /\bthat (deliver|convert|drive|perform)s?\b/i,
  /\bmake sure\b/i, /\bgrow(s)? your (business|brand|practice|revenue|sales|clinic|company)/i,
];

const results = [];
for (const path of urls) {
  const response = await fetch(base + path);
  if (!response.ok) { results.push({ path, status: response.status }); continue; }
  const html = await response.text();
  const meta = [...html.matchAll(/<(?:title)>([^<]*)<\/title>|<meta (?:name|property)="(?:description|og:description|og:title)" content="([^"]*)"/g)].map((m) => m[1] ?? m[2]);
  const body = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, " ")
    .replace(/<(br|\/p|\/li|\/h\d|\/div|\/span|\/a|\/button|\/figcaption|\/dd|\/dt)[^>]*>/gi, "$&\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#x27;|&rsquo;|&#8217;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
  const lines = [...meta.map((m) => `[meta] ${m}`), ...body.split(/\n|(?<=[.!?])\s+/)].map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 3);
  const hits = [...new Set(lines.filter((line) => patterns.some((p) => p.test(line))))];
  results.push({ path, hits });
}

const out = results.map((r) => r.status ? `## ${r.path} -> ${r.status}` : `## ${r.path} (${r.hits.length})\n${r.hits.map((h) => `- ${h}`).join("\n")}`).join("\n\n");
writeFileSync("tmp-audit/claims-scan.md", out);
const allHits = results.flatMap((r) => r.hits ?? []);
console.log(`${urls.length} urls, ${allHits.length} hits, ${new Set(allHits).size} unique`);
