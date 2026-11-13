/**
 * Evidence sweep for Bretton's Nov 11 Kosick site audit.
 * Scans source for known problem strings and route presence.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|json|css|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = walk(SRC);
const read = (f) => fs.readFileSync(f, "utf8");

function find(pattern, { flags = "i", limit = 8 } = {}) {
  const re = typeof pattern === "string" ? new RegExp(pattern, flags) : pattern;
  const hits = [];
  for (const file of files) {
    const text = read(file);
    if (!re.test(text)) continue;
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    const lines = text.split(/\n/);
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(`${rel}:${i + 1}: ${lines[i].trim().slice(0, 160)}`);
        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}

function countIn(dirGlob, needle) {
  const hits = [];
  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    if (!rel.includes(dirGlob)) continue;
    const text = read(file);
    let idx = 0;
    let n = 0;
    while ((idx = text.indexOf(needle, idx)) !== -1) {
      n++;
      idx += needle.length;
    }
    if (n) hits.push({ rel, n });
  }
  return hits;
}

const checks = [
  ["P1 Espresso video null", () => {
    const t = read(path.join(SRC, "content/espresso-dolce.ts"));
    return { present: /video:\s*null/.test(t) && /photos:\s*\[\s*\]/.test(t), detail: "video:null photos:[]" };
  }],
  ["P1 Google Ads route", () => ({ present: fs.existsSync(path.join(SRC, "app/services/google-ads-management/page.tsx")) })],
  ["P1 ChatGPT Ads route", () => ({ present: fs.existsSync(path.join(SRC, "app/services/chatgpt-ads-management/page.tsx")) })],
  ["P1 CTV nav label", () => {
    const t = read(path.join(SRC, "components/layout/site-header-data.ts"));
    return { present: t.includes('label: "Connected TV Advertising"'), detail: find("Digital Video") };
  }],
  ["P3 contact H1 spacing comment", () => ({ hits: find("make something happen") })],
  ["P3 growth.today broken content", () => ({ hits: find("growth\\.today") })],
  ["P3 packaging image note", () => ({ hits: find("photograph shows packaging") })],
  ["P3 screenshot collection note", () => ({ hits: find("screenshot from this collection") })],
  ["P4 adverting typo", () => ({ hits: find("adverting") })],
  ["P4 Our process includes.", () => ({ hits: find("Our process includes\\.") })],
  ["P4 broadcast channel comma splice", () => ({ hits: find("broadcast channel, it's a conversation") })],
  ["P4 look good they perform", () => ({ hits: find("look good they perform") })],
  ["P4 marketshare", () => ({ hits: find("marketshare") })],
  ["P4 re branded", () => ({ hits: find("re[- ]?branded") })],
  ["P4 Areas of Services Expertise", () => ({ hits: find("Areas of Services Expertise") })],
  ["P5 Marketing Strategist creative", () => ({ hits: find("Marketing Strategist creative") })],
  ["P5 Results driven", () => ({ hits: find("Results driven") })],
  ["P5 Design to tangible", () => ({ hits: find("Design to tangible") })],
  ["P5 General notes", () => ({ hits: find("General notes") })],
  ["P5 One coordinated program", () => ({ hits: find("One coordinated program") })],
  ["P5 Web Store CTA", () => ({ hits: find("Web Store") })],
  ["P5 undivided attention", () => ({ hits: find("undivided attention during the drive") })],
  ["P6 Great creative grabs attention", () => ({ hits: find("Great creative grabs attention") })],
  ["P6 pressure-test each opportunity", () => ({ hits: find("pressure-test each opportunity") })],
  ["P6 Proudly Servicing", () => ({ hits: find("Proudly Servicing") })],
  ["P7 enquiry", () => ({ hits: find("\\benquir(?:y|ies)\\b") })],
  ["P7 behavioral", () => ({ hits: find("behavioral") })],
  ["P8 em dash sample", () => ({ hits: find("—", { flags: "g", limit: 15 }) })],
  ["P8 ad dollars", () => ({ hits: find("ad dollars|the next dollar") })],
  ["P8 real-time noun", () => ({ hits: find("in real-time") })],
  ["P8 Street-Level \\(TSA\\)", () => ({ hits: find("Street-Level \\(TSA\\)|\\(TSA\\)") })],
  ["P8 Skinfolio Medesthetics count", () => ({ hits: find("Skinfolio Medesthetics", { limit: 20 }) })],
  ["P8 outdoor rates $550", () => ({ hits: find("\\\\$550|Starting from \\\\$550|550") })],
  ["P9 nav Web label", () => ({ hits: find('label: "Web"') })],
  ["P9 2025 Expert Guide", () => ({ hits: find("2025 Expert Guide|Still Wins in 2025") })],
  ["P11 MSZR", () => ({ hits: find("MSZR") })],
  ["P11 Co-Op Compliance", () => ({ hits: find("Co-Op Compliance|co-op compliance", { limit: 10 }) })],
  ["P11 Mailchimp partners", () => ({ hits: find("Mailchimp partners|Shopify Partner", { limit: 10 }) })],
];

const report = [];
for (const [name, fn] of checks) {
  try {
    report.push({ name, ...(await Promise.resolve(fn())) });
  } catch (e) {
    report.push({ name, error: String(e) });
  }
}

const bd = {
  "vancouver-agency.jpg": countIn("business-development", "vancouver-agency.jpg"),
  "corporate-events.webp": countIn("business-development", "corporate-events.webp"),
  "legal-heritage-building-flag.jpg": countIn("business-development", "legal-heritage-building-flag.jpg"),
  "exit-harbour-sunset.jpg": countIn("business-development", "exit-harbour-sunset.jpg"),
};

const espressoAssets = [];
for (const dir of ["public/images/social", "public/videos/social", "public/images"]) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) continue;
  for (const f of fs.readdirSync(full, { recursive: true })) {
    if (/espresso|dolce|coffee/i.test(String(f))) espressoAssets.push(path.join(dir, String(f)));
  }
}

const out = { report, bd, espressoAssets, fileCount: files.length };
fs.writeFileSync("tmp-audit/verify-site-audit.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
