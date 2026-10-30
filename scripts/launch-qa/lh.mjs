// Lighthouse against the local production build (no network throttling beyond Lighthouse defaults).
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const OUT = process.env.QA_OUT || path.join(os.tmpdir(), "kosick-launch-qa");
fs.mkdirSync(OUT, { recursive: true });

const pages = ["/", "/services/", "/services/hvac-marketing/", "/contact/"];
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
const out = [];
for (const formFactor of ["mobile", "desktop"]) {
  for (const p of pages) {
    const config = formFactor === "desktop"
      ? { extends: "lighthouse:default", settings: { formFactor: "desktop", screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttlingMethod: "simulate" } }
      : { extends: "lighthouse:default" };
    const r = await lighthouse("http://localhost:3107" + p, { port: chrome.port, output: "json", logLevel: "error" }, config);
    const c = r.lhr.categories;
    const a = r.lhr.audits;
    const row = {
      page: p, formFactor,
      perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100),
      lcp: a["largest-contentful-paint"].displayValue, cls: a["cumulative-layout-shift"].displayValue, tbt: a["total-blocking-time"].displayValue,
      a11yFails: Object.values(a).filter((x) => r.lhr.categories.accessibility.auditRefs.some((ref) => ref.id === x.id) && x.score === 0).map((x) => x.id),
    };
    out.push(row);
    console.log(JSON.stringify(row));
  }
}
await chrome.kill();
fs.writeFileSync(path.join(OUT, "lh.json"), JSON.stringify(out, null, 1));
