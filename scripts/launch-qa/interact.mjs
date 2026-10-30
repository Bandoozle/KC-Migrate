// Interaction, form and analytics tests against the local production build.
// www.kosick.com is mapped to localhost so the host-gated analytics code runs;
// every Google request is aborted and every form POST is mocked, so nothing
// reaches GA4, GTM, Ads or WordPress.
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const OUT = process.env.QA_OUT || path.join(os.tmpdir(), "kosick-launch-qa");
fs.mkdirSync(OUT, { recursive: true });

const ORIGIN = "http://www.kosick.com";
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass: Boolean(pass), detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--host-resolver-rules=MAP www.kosick.com 127.0.0.1:3107", "--disable-features=HttpsUpgrades"],
});

async function newPage(width, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width < 800, isMobile: width < 500, ...opts });
  const blocked = [];
  await context.route(/googletagmanager|google-analytics|doubleclick|googleadservices|google\.com\/ccm|googlesyndication/, (route) => {
    blocked.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return { context, page, blocked, errors };
}

const dl = (page) => page.evaluate(() => (window.dataLayer || []).map((e) => {
  if (Object.prototype.toString.call(e) === "[object Arguments]") return { gtag: [...e] };
  return e;
}));

// 1. Desktop navigation dropdowns
{
  const { context, page, blocked } = await newPage(1440);
  await page.goto(ORIGIN + "/", { waitUntil: "load" });
  check("Analytics: GTM requested on production host (then aborted)", blocked.some((u) => u.includes("gtm.js?id=GTM-K4QK6SP")), blocked[0]?.slice(0, 80));
  const trigger = page.locator("nav[aria-label='Primary'] button[aria-expanded]").first();
  const label = (await trigger.textContent())?.trim();
  await trigger.hover();
  await page.waitForTimeout(400);
  check(`Desktop nav: hover opens "${label}" dropdown`, (await trigger.getAttribute("aria-expanded")) === "true");
  await page.keyboard.press("Escape");
  await page.mouse.move(700, 600);
  await page.waitForTimeout(400);
  check("Desktop nav: Escape / mouse-out closes dropdown", (await trigger.getAttribute("aria-expanded")) === "false");
  await trigger.focus();
  await page.waitForTimeout(300);
  check("Desktop nav: keyboard focus opens dropdown", (await trigger.getAttribute("aria-expanded")) === "true");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(200);
  const inPanel = await page.evaluate((id) => document.getElementById(id)?.contains(document.activeElement), await trigger.getAttribute("aria-controls"));
  check("Desktop nav: Tab moves into the open dropdown", inPanel && (await trigger.getAttribute("aria-expanded")) === "true");
  const panelLink = page.locator(`#${await trigger.getAttribute("aria-controls")} a`).first();
  check("Desktop nav: dropdown links visible", await panelLink.isVisible());

  // SPA navigation page_view
  const before = (await dl(page)).filter((e) => e.event === "page_view").length;
  await panelLink.click();
  await page.waitForLoadState("load");
  await page.waitForTimeout(1200);
  const views = (await dl(page)).filter((e) => e.event === "page_view");
  check("Analytics: one page_view per client-side navigation", views.length - before === 1, `${views.length - before} new, path=${views.at(-1)?.page_path}`);
  check("Analytics: no gtag_event pseudo-events", !(await dl(page)).some((e) => e.event === "gtag_event"));
  await context.close();
}

// 2. Mobile drawer
{
  const { context, page, errors } = await newPage(390);
  await page.goto(ORIGIN + "/services/", { waitUntil: "load" });
  const open = page.getByRole("button", { name: "Open menu" });
  await open.click();
  await page.waitForTimeout(400);
  const drawer = page.locator("[aria-label='Mobile navigation']");
  check("Mobile nav: menu button opens drawer", await drawer.isVisible());
  const toggles = drawer.locator("button[aria-expanded]");
  const n = await toggles.count();
  if (n > 0) {
    await toggles.first().click();
    await page.waitForTimeout(300);
    check("Mobile nav: section toggle expands", (await toggles.first().getAttribute("aria-expanded")) === "true", `${n} sections`);
    if (n > 1) {
      await toggles.nth(1).click();
      await page.waitForTimeout(300);
      check("Mobile nav: one section open at a time", (await toggles.first().getAttribute("aria-expanded")) === "false");
    }
  }
  const contactBtn = drawer.getByRole("link", { name: /contact/i }).first();
  const cb = await contactBtn.boundingBox();
  const sb = await drawer.locator("a[aria-label*='acebook'], a[aria-label*='nstagram']").first().boundingBox();
  check("Mobile nav: Contact and social icons share one row", cb && sb && Math.abs((cb.y + cb.height / 2) - (sb.y + sb.height / 2)) < 12);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Mobile nav: Escape closes drawer", !(await drawer.isVisible()) || (await open.getAttribute("aria-expanded")) === "false");
  await open.click();
  await page.waitForTimeout(300);
  await toggles.first().click().catch(() => {});
  await page.waitForTimeout(200);
  const link = drawer.locator("a[href^='/services/']:visible").first();
  const href = await link.getAttribute("href");
  if (await link.isVisible()) {
    await link.click();
    await page.waitForURL((u) => u.pathname === href, { timeout: 30_000 }).catch(() => {});
    await page.waitForTimeout(500);
    check("Mobile nav: link navigates and drawer closes", new URL(page.url()).pathname === href && !(await drawer.isVisible()), `${href} → ${new URL(page.url()).pathname}, drawer visible=${await drawer.isVisible()}, expanded=${await open.getAttribute("aria-expanded")}`);
  }
  check("Mobile nav: no page errors", errors.length === 0, errors.join("; ").slice(0, 120));
  await context.close();
}

// Form guard fields in a multipart body (see src/components/forms/useFormGuard.tsx)
function guardFields(request) {
  const body = request.postData() || "";
  const field = (name) => body.match(new RegExp(`name="${name}"\r\n\r\n([^\r]*)`))?.[1] ?? null;
  return { id: field("_kosick_submission"), elapsed: Number(field("_kosick_elapsed")), source: field("_kosick_source") };
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// 3. Contact form validation, failure and success (mocked)
{
  const { context, page } = await newPage(1440);
  let posts = 0;
  let mode = "real";
  const sent = [];
  await context.route("**/api/contact-form/", (route) => {
    posts += 1;
    sent.push({ mode, ...guardFields(route.request()) });
    if (mode === "real") return route.continue({ headers: { ...route.request().headers(), "x-forwarded-for": "198.51.100.200" } });
    if (mode === "fail") return route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, error: "Unable to send your message right now." }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, redirect: "/thanks/" }) });
  });
  await page.goto(ORIGIN + "/contact/", { waitUntil: "load" });
  const form = page.locator("form").filter({ has: page.locator("input[name='_kosick_hp']") }).first();
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(400);
  const fieldErrors = await form.locator("[role='alert']").count();
  check("Contact: empty submit shows server field errors (rejected before WordPress)", fieldErrors >= 3, `${fieldErrors} alerts`);
  await form.locator("input[autocomplete='name']").fill("QA Test");
  await form.locator("input[type='email']").fill("not-an-email");
  await form.locator("input[type='tel']").fill("6045550100");
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(400);
  check("Contact: invalid email rejected with a field error", (await form.getByText("Enter a valid email address.").count()) > 0 && page.url().endsWith("/contact/"));
  mode = "fail";
  await form.locator("input[type='email']").fill("qa@example.com");
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(1200);
  const leadsAfterFail = (await dl(page)).filter((e) => e.event === "kosick_contact_lead").length;
  check("Contact: server failure shows error, no redirect, no lead event", posts === 3 && page.url().endsWith("/contact/") && leadsAfterFail === 0 && (await page.getByText("Unable to send").count()) > 0);
  mode = "ok";
  await form.locator("button[type='submit']").click();
  await page.waitForURL("**/thanks/", { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(800);
  const leads = (await dl(page)).filter((e) => e.event === "kosick_contact_lead");
  check("Contact: success redirects to /thanks/", page.url().endsWith("/thanks/"));
  check("Contact: exactly one kosick_contact_lead on success", leads.length === 1, JSON.stringify(leads[0] || {}).slice(0, 140));
  const failed = sent.find((x) => x.mode === "fail");
  const succeeded = sent.find((x) => x.mode === "ok");
  check("Contact: submission id, fill time and source page sent", UUID_RE.test(succeeded?.id || "") && succeeded.elapsed > 0 && succeeded.source === "/contact/", JSON.stringify(succeeded));
  check("Contact: retry after a failure reuses the submission id (no duplicate lead)", Boolean(failed?.id) && failed.id === succeeded?.id);
  check("Contact: no duplicate generate_lead from the browser", !(await dl(page)).some((e) => e.event === "generate_lead" || e.gtag?.[1] === "generate_lead"));
  await context.close();
}

// 4. Newsletter (mocked)
{
  const { context, page } = await newPage(1440);
  let mode = "fail";
  const ids = [];
  await context.route("**/api/contact-form/", (route) => {
    const ok = mode === "ok";
    ids.push({ mode, ...guardFields(route.request()) });
    return route.fulfill({ status: ok ? 200 : 502, contentType: "application/json", body: JSON.stringify({ ok }) });
  });
  await page.goto(ORIGIN + "/services/", { waitUntil: "load" });
  const form = page.locator("footer form").first();
  await form.locator("input[type='email']").fill("qa@example.com");
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(800);
  const gl = (e) => e.event === "kosick_newsletter_signup" || (e.gtag?.[0] === "event" && e.gtag?.[1] === "generate_lead");
  check("Newsletter: failure shows error and no lead", (await form.getByText("Something went wrong").count()) > 0 && !(await dl(page)).some(gl));
  mode = "ok";
  await form.locator("input[type='email']").fill("qa@example.com");
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(800);
  const all = await dl(page);
  const signups = all.filter((e) => e.event === "kosick_newsletter_signup");
  check("Newsletter: success shows confirmation", (await form.getByText("on the list").count()) > 0);
  check("Newsletter: one kosick_newsletter_signup (live WordPress event name and payload)", signups.length === 1 && signups[0].kb_form_id === "kb-adv-form-11281-cpt-id" && signups[0].lead_email === "qa@example.com", JSON.stringify(signups[0] || {}));
  check("Newsletter: not counted as a generate_lead", !all.some((e) => e.event === "generate_lead" || e.gtag?.[1] === "generate_lead"));
  await form.locator("input[type='email']").fill("qa2@example.com");
  await form.locator("button[type='submit']").click();
  await page.waitForTimeout(800);
  const okIds = ids.filter((x) => x.mode === "ok").map((x) => x.id);
  check("Newsletter: guard fields sent; a second signup gets a new submission id", okIds.length === 2 && okIds.every((x) => UUID_RE.test(x || "")) && okIds[0] !== okIds[1] && ids[0].id === okIds[0] && ids[0].source === "/services/", JSON.stringify(ids.map((x) => x.id?.slice(0, 8))));
  const hp = await form.locator("input[name='_kosick_hp']").count();
  check("Newsletter: honeypot field present", hp === 1);
  await context.close();
}

// 5. Phone and email click tracking
{
  const { context, page } = await newPage(1440);
  await page.goto(ORIGIN + "/contact/", { waitUntil: "load" });
  await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault()));
  const tel = page.locator("main a[href^='tel:']").first();
  const mail = page.locator("main a[href^='mailto:']").first();
  await tel.click();
  await mail.click();
  await page.waitForTimeout(300);
  const d = await dl(page);
  const phone = d.filter((e) => e.event === "phone_click").length;
  const email = d.filter((e) => e.event === "email_click").length;
  check("Click tracking: one phone_click per tel: click", phone === 1, `${phone}`);
  check("Click tracking: one email_click per mailto: click", email === 1, `${email}`);
  check("Click tracking: no gtag phone/email duplicates", !d.some((e) => e.gtag && /phone_click|email_click/.test(String(e.gtag[1]))));
  await context.close();
}

// 6. Analytics off on non-production hosts
{
  const { context, page, blocked } = await newPage(1440);
  await page.goto("http://localhost:3107/", { waitUntil: "load" });
  await page.waitForTimeout(500);
  check("Analytics: GTM not loaded on preview/localhost host", !blocked.some((u) => u.includes("gtm.js")));
  const robots = await (await page.request.get("http://localhost:3107/robots.txt")).text();
  check("Robots: non-production host disallows all", /Disallow: \/\s*$/m.test(robots));
  const prodRobots = await (await fetch("http://localhost:3107/robots.txt", { headers: { host: "www.kosick.com", "x-forwarded-host": "www.kosick.com" } })).text();
  check("Robots: production host allows crawl and lists sitemap_index", /Allow: \//.test(prodRobots) && /sitemap_index\.xml/.test(prodRobots));
  await context.close();
}

// 7. Pay Your Invoice
{
  const { context, page } = await newPage(390);
  await page.goto(ORIGIN + "/online-payments/", { waitUntil: "load" });
  const src = await page.locator("main iframe").first().getAttribute("src");
  check("Payments: Square checkout iframe present", /^https:\/\/checkout\.square\.site\/merchant\/MLVSXG1DF9CPJ\/checkout\//.test(src || ""), src);
  const footerLink = await page.locator("footer a[href='/online-payments/']").count();
  check("Payments: footer Pay Your Invoice link points to /online-payments/", footerLink >= 1);
  const frame = page.frameLocator("main iframe");
  const loaded = await frame.locator("body").count().catch(() => 0);
  check("Payments: checkout frame loads (no payment attempted)", loaded === 1);
  await context.close();
}

// 8. Retired event microsites land on Corporate Events, with no registration form
{
  const { context, page } = await newPage(390);
  for (const path of ["/comfortmaker/", "/mexico-2026-welcome-itinerary/", "/uncorked/"]) {
    const res = await page.goto(ORIGIN + path, { waitUntil: "load" });
    const url = new URL(page.url()).pathname;
    check(`Retired microsite ${path} → /corporate-events/`, res?.status() === 200 && url === "/corporate-events/" && (await page.locator("input[type='file']").count()) === 0, url);
  }
  await context.close();
}

// 9. Reduced motion
{
  const { context, page } = await newPage(1440, { reducedMotion: "reduce" });
  for (const route of ["/", "/services/hvac-marketing/", "/services/digital-connected-tv/"]) {
    await page.goto(ORIGIN + route, { waitUntil: "load" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    await page.waitForTimeout(600);
    const s = await page.evaluate(() => {
      const running = document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getComputedTiming().iterations === Infinity);
      const hidden = [...document.querySelectorAll("main h2, main p")].filter((el) => Number(getComputedStyle(el).opacity) < 0.1 && el.getBoundingClientRect().height > 0).length;
      return { infinite: running.map((a) => a.animationName || a.constructor.name).slice(0, 4), hidden };
    });
    check(`Reduced motion ${route}: no infinite animations, content visible`, s.infinite.length === 0 && s.hidden === 0, JSON.stringify(s));
  }
  await context.close();
}

// 10. Keyboard: skip link / first focus
{
  const { context, page } = await newPage(1440);
  await page.goto(ORIGIN + "/services/", { waitUntil: "load" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return { tag: el.tagName, text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40), outline: s.outlineStyle !== "none" || s.boxShadow !== "none" };
  });
  check("Keyboard: first Tab lands on a visible focusable element", focused.tag === "A" || focused.tag === "BUTTON", JSON.stringify(focused));
  await context.close();
}

await browser.close();

// 11. API validation and abuse controls (direct requests; none reach WordPress)
let ipSeq = 10;
const api = async (p, body, json = false, ip = `198.51.100.${ipSeq++}`) => {
  const r = await fetch("http://localhost:3107" + p, json
    ? { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": ip }, body }
    : { method: "POST", headers: { "x-forwarded-for": ip }, body });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const fd = (o) => { const f = new FormData(); for (const [k, v] of Object.entries(o)) f.set(k, v); return f; };
let r = await api("/api/contact-form/", fd({ formKey: "nope" }));
check("API contact-form: unknown formKey → 400", r.status === 400);
r = await api("/api/contact-form/", fd({ formKey: "contact" }));
check("API contact-form: missing required fields → 400 with field errors", r.status === 400 && r.body?.fields?.name && r.body?.fields?.email);
r = await api("/api/contact-form/", fd({ formKey: "contact", name: "x", email: "bad", phone: "1" }));
check("API contact-form: invalid email → 400", r.status === 400 && r.body?.fields?.email);
r = await api("/api/contact-form/", fd({ formKey: "newsletter", email: "qa@example.com", _kosick_hp: "bot" }));
check("API contact-form: honeypot filled → 400 (not forwarded)", r.status === 400 && r.body?.ok === false);
r = await api("/api/gravity-form/", fd({ formKey: "comfortmaker" }));
// The route is gone; Next.js answers a form POST to a page path with 409, a GET with 404
check("API gravity-form: removed with the Comfortmaker form (rejected, nothing accepted)", r.status >= 400 && r.body?.ok !== true, String(r.status));
r = await api("/api/chat/", "{bad", true);
check("API chat: invalid JSON → 400", r.status === 400);
r = await api("/api/chat/", JSON.stringify({ messages: [] }), true);
check("API chat: empty messages → 400", r.status === 400);
r = await api("/api/chat/lead/", JSON.stringify({}), true);
check("API chat lead: missing name → 400", r.status === 400);
const statuses = [];
for (let n = 0; n < 6; n += 1) statuses.push((await api("/api/contact-form/", fd({ formKey: "nope" }), false, "203.0.113.9")).status);
r = { status: statuses.at(-1) };
check("API rate limit: lead routes return 429 after 5 requests / 10 min per IP", r.status === 429 && statuses.slice(0, 5).every((x) => x === 400), statuses.join(","));
const other = await fetch("http://localhost:3107/api/contact-form/", { method: "POST", headers: { "x-forwarded-for": "203.0.113.77" }, body: fd({ formKey: "nope" }) });
check("API rate limit: other clients unaffected", other.status === 400);

fs.writeFileSync(path.join(OUT, "interact.json"), JSON.stringify(results, null, 1));
console.log(`\n${results.filter((x) => x.pass).length}/${results.length} passed`);
