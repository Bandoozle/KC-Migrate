/**
 * Dump chatbot + analytics artifacts from staging WP pages.
 */
import fs from "node:fs";
import path from "node:path";

const origin = "https://staging.kosick.com";
const outDir = path.join("tmp-parity", "functionality-audit");
fs.mkdirSync(outDir, { recursive: true });

async function fetchText(url) {
  const res = await fetch(url, { headers: { Accept: "text/html,*/*" } });
  return { status: res.status, text: await res.text(), headers: Object.fromEntries(res.headers) };
}

function extract(re, text, flags = "gi") {
  const flagSet = new Set(flags);
  flagSet.add("g");
  return [...text.matchAll(new RegExp(re, [...flagSet].join("")))].map((m) => m[0]);
}

const home = await fetchText(`${origin}/`);
fs.writeFileSync(path.join(outDir, "home.html"), home.text);

const contact = await fetchText(`${origin}/contact/`);
fs.writeFileSync(path.join(outDir, "contact.html"), contact.text);

const acaCss = await fetchText(`${origin}/wp-content/plugins/ai-chat-assistant/assets/css/chat-widget.css`);
const acaJs = await fetchText(`${origin}/wp-content/plugins/ai-chat-assistant/assets/js/chat-widget.js`);
fs.writeFileSync(path.join(outDir, "aca-widget.css"), acaCss.text);
fs.writeFileSync(path.join(outDir, "aca-widget.js"), acaJs.text);

// Probe ACA REST routes
const routes = [
  "/wp-json/aca/v1/",
  "/wp-json/aca/v1",
  "/wp-json/",
];
const routeResults = {};
for (const r of routes) {
  try {
    const res = await fetch(`${origin}${r}`);
    routeResults[r] = { status: res.status, body: (await res.text()).slice(0, 4000) };
  } catch (e) {
    routeResults[r] = { error: String(e) };
  }
}

// Try common chat endpoints from widget JS
const endpointHints = [...acaJs.text.matchAll(/aca\/v1\/[a-zA-Z0-9_-]+|restUrl[^;]+|fetch\([^)]+\)|\$\.ajax\([^)]+\)|admin-ajax/g)].map((m) => m[0]);
const fetchUrls = [...acaJs.text.matchAll(/[`'"](\/?(?:wp-json\/)?aca\/v1\/[^`'"]+)[`'"]/g)].map((m) => m[1]);

const report = {
  analytics: {
    gtm: [...new Set(extract("GTM-[A-Z0-9]+", home.text))],
    ga4: [...new Set(extract("G-[A-Z0-9]+", home.text))],
    ads: [...new Set(extract("AW-[0-9]+", home.text))],
    generateLeadSnippets: extract("generate_lead[\\s\\S]{0,400}", home.text).slice(0, 5),
    gtagEvents: [...new Set(extract("gtag\\(['\"]event['\"],\\s*['\"][^'\"]+['\"]", home.text))],
    dataLayerPushes: extract("dataLayer\\.push\\([\\s\\S]{0,200}\\)", home.text).slice(0, 10),
  },
  chat: {
    acaCssStatus: acaCss.status,
    acaJsStatus: acaJs.status,
    acaJsBytes: acaJs.text.length,
    acaConfigMatches: extract("var acaConfig = (\\{.*?\\});", home.text, "s").slice(0, 2),
    chatbase: extract("chatbase[\\s\\S]{0,300}", home.text).slice(0, 4),
    chatbotIds: [...new Set(extract("chatbotId[\"':= ]+[\\w_-]+", home.text))],
    endpointHints: [...new Set(endpointHints)].slice(0, 40),
    fetchUrls: [...new Set(fetchUrls)],
  },
  contactPage: {
    generateLead: extract("generate_lead[\\s\\S]{0,500}", contact.text).slice(0, 3),
    phoneTracking: extract("tel:[^\"'\\s]+|[\"']phone[\"']|click_to_call|phone_click", contact.text).slice(0, 20),
    formTracking: extract("kb_process|kadence|form.?submit|generate_lead|conversion", contact.text, "gi").slice(0, 30),
  },
  routeResults,
};

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));

// List REST namespaces mentioning aca
try {
  const index = JSON.parse(routeResults["/wp-json/"].body);
  report.acaRoutes = index.routes
    ? Object.keys(index.routes).filter((k) => k.includes("aca"))
    : [];
  const namespaces = index.namespaces || [];
  report.acaNamespace = namespaces.filter((n) => String(n).includes("aca"));
} catch {}

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
