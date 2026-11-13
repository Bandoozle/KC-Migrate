import { chromium } from "playwright";
import sharp from "sharp";
import { existsSync, writeFileSync } from "node:fs";

const base = process.env.BASE ?? "http://localhost:3000";
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
let urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const extra = ["/services/medical-aesthetics-marketing/", "/services/construction-marketing/", "/services/specialty-retail-marketing/"];
const SITE_PAGES = /^\/(services|marketing-programs|marketing-results|contact|feature-articles|corporate-events|site-map|online-payments)\//;
urls = [...new Set([...urls, ...extra])].filter((p) => p === "/" || SITE_PAGES.test(p));
if (process.env.ONLY) urls = urls.filter((u) => u.includes(process.env.ONLY));

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, dpr: 1 },
  { name: "retina", width: 1440, height: 900, dpr: 2 },
  { name: "phone", width: 390, height: 844, dpr: 3 },
];

const originals = new Map();
async function originalWidth(src) {
  if (originals.has(src)) return originals.get(src);
  let width = null;
  const file = `public${decodeURIComponent(src.split("?")[0])}`;
  if (existsSync(file)) {
    try {
      width = (await sharp(file).metadata()).width ?? null;
    } catch {}
  }
  originals.set(src, width);
  return width;
}

const browser = await chromium.launch({ channel: process.env.CHANNEL ?? "msedge" });
const issues = [];
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const path of urls) {
    try {
      await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
    } catch {
      issues.push({ vp: vp.name, path, kind: "load-timeout" });
      continue;
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(500);
    const found = await page.evaluate((dpr) => {
      const out = [];
      for (const img of document.querySelectorAll("img")) {
        const r = img.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) continue;
        const style = getComputedStyle(img);
        if (style.visibility === "hidden" || style.display === "none") continue;
        let el = img, hidden = false;
        while (el) {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden") { hidden = true; break; }
          el = el.parentElement;
        }
        if (hidden) continue;
        const src = img.currentSrc || img.src;
        let original = src;
        let requested = null;
        try {
          const u = new URL(src);
          if (u.pathname.startsWith("/_next/image")) {
            original = u.searchParams.get("url");
            requested = Number(u.searchParams.get("w"));
          } else original = u.pathname;
        } catch {}
        if (/\.svg($|\?)/i.test(original)) continue;
        if (!img.complete) { out.push({ original, broken: "incomplete" }); continue; }
        if (!img.naturalWidth) { out.push({ original, broken: "no-data" }); continue; }
        const fit = style.objectFit;
        const ar = img.naturalWidth / img.naturalHeight;
        const boxAr = r.width / r.height;
        const shownWidth = fit === "cover" ? Math.max(r.width, r.height * ar) : fit === "contain" ? Math.min(r.width, r.height * ar) : r.width;
        const need = Math.round(shownWidth * dpr);
        const visibleShare = fit === "cover" ? Math.min(boxAr / ar, ar / boxAr) : 1;
        const stretched = fit === "fill" || fit === "" ? Math.abs(boxAr - ar) / ar > 0.04 : false;
        let owner = img, cls = "";
        while (owner && !cls) {
          const m = String(owner.className).match(/([A-Za-z]+)-module__\w+__(\w+)/);
          if (m) cls = `${m[1]}.${m[2]}`;
          owner = owner.parentElement;
        }
        out.push({
          sizes: img.sizes || "",
          cls,
          original,
          requested,
          got: img.naturalWidth,
          need,
          box: `${Math.round(r.width)}x${Math.round(r.height)}`,
          fit,
          visibleShare: Number(visibleShare.toFixed(2)),
          stretched,
          label: img.alt?.slice(0, 60) ?? "",
        });
      }
      return out;
    }, vp.dpr);
    for (const f of found) {
      if (f.broken) { issues.push({ vp: vp.name, path, kind: `broken-${f.broken}`, ...f }); continue; }
      const sourceWidth = await originalWidth(f.original);
      const actual = f.requested ? Math.min(f.requested, sourceWidth ?? Infinity) : f.got;
      const density = (actual / f.need) * vp.dpr;
      const minDensity = { desktop: 0.95, retina: 1.5, phone: 2 }[vp.name];
      if (density < minDensity) {
        const fixable = f.requested ? sourceWidth == null || sourceWidth > f.requested * 1.1 : false;
        issues.push({ vp: vp.name, path, kind: fixable ? "undersized-request" : "source-too-small", density: Number(density.toFixed(2)), sourceWidth, actual, ...f });
      }
      if (f.stretched) issues.push({ vp: vp.name, path, kind: "stretched", ...f });
      if (f.visibleShare < 0.45) issues.push({ vp: vp.name, path, kind: "heavy-crop", ...f });
    }
  }
  await context.close();
}
await browser.close();

const lines = [];
const byKind = {};
for (const i of issues) (byKind[i.kind] ??= []).push(i);
for (const [kind, list] of Object.entries(byKind)) {
  lines.push(`## ${kind} (${list.length})`);
  for (const i of list) {
    lines.push(`- [${i.vp}] ${i.path} | ${i.original} | box ${i.box ?? ""} fit ${i.fit ?? ""} | got ${i.got ?? ""} need ${i.need ?? ""} req ${i.requested ?? ""} src ${i.sourceWidth ?? ""} | visible ${i.visibleShare ?? ""} | ${i.label ?? ""}`);
  }
  lines.push("");
}
writeFileSync("tmp-audit/image-sharpness.md", lines.join("\n"));
writeFileSync("tmp-audit/image-sharpness.json", JSON.stringify(issues, null, 1));
console.log(`${urls.length} pages x ${VIEWPORTS.length} viewports`);
for (const [kind, list] of Object.entries(byKind)) console.log(kind, list.length);
