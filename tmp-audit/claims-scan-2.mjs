import { readFileSync, writeFileSync } from "node:fs";

const base = process.env.BASE ?? "http://localhost:3000";
const first = new Set(readFileSync("tmp-audit/claims-scan.md", "utf8").split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2)));
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const SITE_PAGES = /^\/(services|marketing-programs|marketing-results|contact|corporate-events|online-payments)\//;
const urls = [...new Set(["/", ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => SITE_PAGES.test(p)), "/services/medical-aesthetics-marketing/", "/services/construction-marketing/", "/services/specialty-retail-marketing/"])];

const patterns = [
  /\b(fill|fills|filled|fuller)\b/i, /\battract(s|ing)? (more|new)\b/i, /\b(generat|produc)(e|es|ing) (more|leads|sales|revenue|bookings|calls|results|roi)/i,
  /\bconvert(s)?\b(?! to)/i, /\b(win|wins|winning) (more|new|the)\b/i, /\b(double|triple|10x|2x)\b/i, /\b\d+%/,
  /\bresults\b/i, /\bROI\b/, /\bproven\b/i, /\bwill\b/i, /\bevery (lead|call|click|visitor|campaign|dollar|enquiry|inquiry)/i,
  /\b(more|new) (homeowners|patients|golfers|members|travellers|travelers|shoppers|buyers|clients|customers)\b/i,
  /\b(books|booked) (out|solid)\b/i, /\bnever\b/i, /\bpredictable\b/i, /\b(highest|best possible|maximum)\b/i,
];

let out = "";
for (const path of urls) {
  const html = await (await fetch(base + path)).text();
  const meta = [...html.matchAll(/<meta (?:name|property)="(?:description|og:description)" content="([^"]*)"/g)].map((m) => `[meta] ${m[1]}`);
  const body = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, " ")
    .replace(/<(br|\/p|\/li|\/h\d|\/div|\/span|\/a|\/button|\/figcaption|\/dd|\/dt)[^>]*>/gi, "$&\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#x27;|&rsquo;|&#8217;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
  const lines = [...meta, ...body.split(/\n|(?<=[.!?])\s+/)].map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 3 && !first.has(l));
  const hits = [...new Set(lines.filter((line) => patterns.some((p) => p.test(line))))];
  if (hits.length) out += `## ${path}\n${hits.map((h) => `- ${h}`).join("\n")}\n\n`;
}
writeFileSync("tmp-audit/claims-scan-2.md", out);
console.log(`${urls.length} urls scanned`);
