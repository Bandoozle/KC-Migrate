// Contact and newsletter API against local mocks of Supabase (PostgREST), Resend,
// Cloudflare Turnstile and the WordPress Kadence relay. Nothing leaves this machine:
// WORDPRESS_URL always points at the mock, so no real form, inbox or database is touched.
//
//   npx next build && node scripts/launch-qa/forms-mock.mjs
//
// Starts its own production server per configuration on port 3108 (mock on 3199).
import { spawn } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import http from "node:http";
import path from "node:path";

const MOCK_PORT = 3199;
const APP_PORT = 3108;
const MOCK = `http://127.0.0.1:${MOCK_PORT}`;
const APP = `http://127.0.0.1:${APP_PORT}`;
const ROOT = path.resolve(import.meta.dirname, "../..");

// ---------------------------------------------------------------- mock services
const TABLES = ["contact_submissions", "newsletter_signups"];
let state;
function reset() {
  state = {
    rows: Object.fromEntries(TABLES.map((t) => [t, []])),
    emails: [],
    emailKeys: new Map(),
    relays: [],
    turnstile: [],
    wp: "ok", // ok | rejected | unreachable
    resend: "ok", // ok | fail | fail-except-alerts
    db: "ok", // ok | down
  };
}
reset();

function body(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function send(res, status, data, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json", ...headers });
  res.end(data === undefined ? "" : JSON.stringify(data));
}

function matches(row, key, raw) {
  const [op, ...rest] = raw.split(".");
  const value = decodeURIComponent(rest.join("."));
  const actual = row[key];
  const cmp = (a, b) => (key === "created_at" ? Date.parse(a) - Date.parse(b) : Number(a) - Number(b));
  switch (op) {
    case "eq": return String(actual) === value;
    case "neq": return String(actual) !== value;
    case "gt": return cmp(actual, value) > 0;
    case "lt": return cmp(actual, value) < 0;
    case "in": return value.replace(/^\(|\)$/g, "").split(",").includes(String(actual));
    default: throw new Error(`unsupported filter ${op}`);
  }
}

function filterRows(table, params) {
  let rows = state.rows[table];
  for (const [key, raw] of params) {
    if (["select", "order", "limit"].includes(key)) continue;
    rows = rows.filter((row) => matches(row, key, raw));
  }
  if (params.get("order") === "created_at.asc") rows = [...rows].sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
  if (params.get("limit")) rows = rows.slice(0, Number(params.get("limit")));
  return rows;
}

const mock = http.createServer(async (req, res) => {
  const url = new URL(req.url, MOCK);
  const raw = await body(req);

  if (url.pathname === "/__state") return send(res, 200, state);

  const rest = url.pathname.match(/^\/rest\/v1\/(\w+)$/);
  if (rest) {
    const table = rest[1];
    if (req.headers.apikey !== "test-secret") return send(res, 401, { message: "bad key" });
    if (state.db === "down") return send(res, 503, { message: "down" });
    if (req.method === "POST") {
      const input = JSON.parse(raw.toString());
      if (state.rows[table].some((r) => r.idempotency_key === input.idempotency_key)) {
        return send(res, 409, { code: "23505", message: "duplicate key" });
      }
      const row = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        wordpress_relay_attempts: 0,
        notification_attempts: 0,
        notification_id: null,
        last_error: null,
        ...input,
        email_normalized: String(input.email).toLowerCase(),
      };
      state.rows[table].push(row);
      return send(res, 201, [row]);
    }
    if (req.method === "GET") {
      const all = filterRows(table, url.searchParams);
      if (/count=exact/.test(req.headers.prefer || "")) {
        return send(res, 200, all.slice(0, 1), { "Content-Range": `0-0/${all.length}` });
      }
      return send(res, 200, all);
    }
    if (req.method === "PATCH") {
      const patch = JSON.parse(raw.toString());
      for (const row of filterRows(table, url.searchParams)) Object.assign(row, patch);
      return send(res, 204);
    }
  }

  if (url.pathname === "/emails" && req.method === "POST") {
    if (req.headers.authorization !== "Bearer test-resend") return send(res, 401, { message: "bad key" });
    const email = JSON.parse(raw.toString());
    const alert = email.subject.includes("Website form delivery failed");
    if (state.resend === "fail" || (state.resend === "fail-except-alerts" && !alert)) {
      return send(res, 500, { message: "mock failure" });
    }
    const key = req.headers["idempotency-key"];
    if (state.emailKeys.has(key)) return send(res, 200, { id: state.emailKeys.get(key) });
    const id = `email_${state.emails.length + 1}`;
    state.emailKeys.set(key, id);
    state.emails.push({ ...email, id, key });
    return send(res, 200, { id });
  }

  if (url.pathname === "/siteverify" && req.method === "POST") {
    const form = new URLSearchParams(raw.toString());
    state.turnstile.push({ secret: form.get("secret"), response: form.get("response") });
    return send(res, 200, { success: form.get("secret") === "test-turnstile" && form.get("response") === "good-token" });
  }

  if (url.pathname === "/wp-admin/admin-ajax.php" && req.method === "POST") {
    if (state.wp === "unreachable") return send(res, 500, { message: "down" });
    const form = await new Response(raw, { headers: { "content-type": req.headers["content-type"] } }).formData();
    state.relays.push(Object.fromEntries(form));
    if (state.wp === "rejected") return send(res, 200, { success: false });
    return send(res, 200, { success: true, submissionResults: { success: true, entry_id: 900 + state.relays.length } });
  }

  send(res, 404, { message: "no mock route" });
});

// ---------------------------------------------------------------- app servers
const BASE_ENV = { WORDPRESS_URL: MOCK };
const DUAL = { ...BASE_ENV, SUPABASE_URL: MOCK, SUPABASE_SECRET_KEY: "test-secret", IP_HASH_SECRET: "test-ip", CRON_SECRET: "test-cron" };
const DIRECT = {
  ...DUAL,
  FORMS_EMAIL: "live",
  RESEND_API_KEY: "test-resend",
  FORMS_RESEND_API_URL: MOCK,
  TURNSTILE_SECRET_KEY: "test-turnstile",
  FORMS_TURNSTILE_VERIFY_URL: `${MOCK}/siteverify`,
};
const FORM_VARS = [
  "SUPABASE_URL", "SUPABASE_SECRET_KEY", "IP_HASH_SECRET", "CRON_SECRET", "FORMS_EMAIL", "RESEND_API_KEY",
  "FORMS_RESEND_API_URL", "FORMS_FROM", "FORMS_NOTIFY_TO", "FORMS_NOTIFY_BCC", "FORMS_TEST_TO", "FORMS_ALERT_TO",
  "FORMS_WORDPRESS_RELAY", "TURNSTILE_SECRET_KEY", "FORMS_TURNSTILE_VERIFY_URL",
];

let app = null;
async function startApp(env) {
  const childEnv = { ...process.env };
  for (const name of FORM_VARS) delete childEnv[name];
  app = spawn(process.execPath, [path.join(ROOT, "node_modules/next/dist/bin/next"), "start", "-p", String(APP_PORT)], {
    cwd: ROOT,
    env: { ...childEnv, ...env },
    stdio: ["ignore", "ignore", "pipe"],
  });
  for (let i = 0; i < 60; i += 1) {
    try {
      if ((await fetch(`${APP}/robots.txt`)).ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("app did not start");
}
async function stopApp() {
  if (!app) return;
  const exited = new Promise((r) => app.once("exit", r));
  app.kill();
  await exited;
  app = null;
}

// ---------------------------------------------------------------- helpers
const results = [];
function check(name, ok, detail = "") {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}

let ipCounter = 10;
function freshIp() {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

const CONTACT_FIELDS = {
  name: "field652327-6b",
  email: "field4d218f-d3",
  phone: "field7ef1b0-96",
  company: "field02e9e9-ef",
  message: "field34af12-76",
};

function contactForm(overrides = {}) {
  const fd = new FormData();
  fd.set("formKey", "contact");
  fd.set(CONTACT_FIELDS.name, overrides.name ?? "QA <b>Visitor</b>");
  fd.set(CONTACT_FIELDS.email, overrides.email ?? "visitor@example.test");
  fd.set(CONTACT_FIELDS.phone, "604-555-0100");
  fd.set(CONTACT_FIELDS.company, "QA Co");
  fd.set(CONTACT_FIELDS.message, "Line one\nLine two");
  fd.set("_kosick_hp", overrides.hp ?? "");
  if (overrides.elapsed !== null) fd.set("_kosick_elapsed", String(overrides.elapsed ?? 8000));
  fd.set("_kosick_submission", overrides.id ?? randomUUID());
  if (overrides.source !== null) fd.set("_kosick_source", overrides.source ?? "/contact/");
  if (overrides.token) fd.set("cf-turnstile-response", overrides.token);
  return fd;
}

function newsletterForm(overrides = {}) {
  const fd = new FormData();
  fd.set("formKey", "newsletter");
  fd.set("field3d8246-7e", overrides.email ?? "reader@example.test");
  fd.set("_kosick_hp", "");
  fd.set("_kosick_elapsed", "6000");
  fd.set("_kosick_submission", overrides.id ?? randomUUID());
  fd.set("_kosick_source", overrides.source ?? "/services/");
  if (overrides.token) fd.set("cf-turnstile-response", overrides.token);
  return fd;
}

async function post(fd, ip = freshIp(), headers = {}) {
  const response = await fetch(`${APP}/api/contact-form/`, {
    method: "POST",
    body: fd,
    headers: { "x-forwarded-for": ip, host: "www.kosick.com", ...headers },
  });
  return { status: response.status, body: await response.json().catch(() => null) };
}

async function mockState() {
  return (await fetch(`${MOCK}/__state`)).json();
}
function setMock(patch) {
  Object.assign(state, patch);
}
async function waitFor(predicate, ms = 4000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (predicate(await mockState())) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}
function ageAll(ms) {
  for (const table of TABLES) {
    for (const row of state.rows[table]) row.created_at = new Date(Date.parse(row.created_at) - ms).toISOString();
  }
}
async function retry(auth) {
  const response = await fetch(`${APP}/api/forms/retry/`, auth === undefined ? {} : { headers: { Authorization: auth } });
  return { status: response.status, body: await response.json().catch(() => null) };
}

// ---------------------------------------------------------------- scenarios
await new Promise((r) => mock.listen(MOCK_PORT, "127.0.0.1", r));
try {
  // 1. Default: no new env vars — WordPress relay exactly as before
  console.log("\n# Default configuration (WordPress relay only)");
  await startApp(BASE_ENV);
  let r = await post(contactForm());
  let s = await mockState();
  check("Default: contact relayed to WordPress, { ok, redirect: /thanks/ }", r.status === 200 && r.body?.ok && r.body.redirect === "/thanks/" && s.relays.length === 1, `${r.status}`);
  check("Default: relay carries the Kadence form id and field names", s.relays[0]?._kb_adv_form_post_id === "11283" && s.relays[0]?.[CONTACT_FIELDS.email] === "visitor@example.test" && s.relays[0]?.action === "kb_process_advanced_form_submit");
  check("Default: Kadence entry id passed through", r.body?.entryId === 901, String(r.body?.entryId));
  check("Default: nothing stored, no direct email", s.rows.contact_submissions.length === 0 && s.emails.length === 0);
  r = await post(newsletterForm());
  check("Default: newsletter relayed to form 11281, inline success (redirect null)", r.status === 200 && r.body?.redirect === null && (await mockState()).relays.at(-1)?._kb_adv_form_post_id === "11281");
  setMock({ wp: "rejected" });
  r = await post(contactForm());
  check("Default: WordPress rejection → 502 with the existing message", r.status === 502 && /did not accept/.test(r.body?.error || ""), r.body?.error);
  setMock({ wp: "unreachable" });
  r = await post(contactForm());
  check("Default: WordPress unreachable → 502", r.status === 502 && r.body?.error === "Unable to send your message right now.");
  setMock({ wp: "ok" });
  const relaysBefore = (await mockState()).relays.length;
  r = await post(contactForm({ email: "not-an-email" }));
  check("Invalid email rejected with a field error", r.status === 400 && Boolean(r.body?.fields?.email));
  r = await post(contactForm({ hp: "http://spam.example" }));
  check("Honeypot filled → rejected", r.status === 400);
  r = await post(contactForm({ elapsed: 600 }));
  check("Too-fast submission (0.6 s) → rejected", r.status === 400);
  r = await post(contactForm({ elapsed: null }));
  check("Missing fill-time field → rejected", r.status === 400);
  check("Rejected submissions never reach WordPress", (await mockState()).relays.length === relaysBefore);
  r = await retry("Bearer anything");
  check("Retry endpoint without CRON_SECRET configured → 503", r.status === 503);
  await stopApp();

  // 2. Phase 3a: Supabase dual-write + WordPress relay
  console.log("\n# Dual-write (Supabase + WordPress relay)");
  reset();
  await startApp(DUAL);
  const ip = "203.0.113.7";
  const id = randomUUID();
  r = await post(contactForm({ id }), ip);
  s = await mockState();
  let row = s.rows.contact_submissions[0];
  check("Dual-write: stored and relayed", r.status === 200 && r.body?.redirect === "/thanks/" && s.rows.contact_submissions.length === 1 && s.relays.length === 1);
  check("Dual-write: row statuses (relay sent, email skipped)", row?.wordpress_relay_status === "sent" && row?.notification_status === "skipped" && row?.autoresponse_status === "skipped", JSON.stringify({ relay: row?.wordpress_relay_status, n: row?.notification_status }));
  check("Dual-write: keyed IP hash stored, not the address", row?.ip_hash === createHmac("sha256", "test-ip").update(ip).digest("hex") && !JSON.stringify(row).includes(ip));
  check("Dual-write: no user agent stored, source path kept", !("user_agent" in row) && row?.source_path === "/contact/");
  r = await post(contactForm({ id }), ip);
  s = await mockState();
  check("Duplicate submission id → success, no second row or relay", r.status === 200 && r.body?.ok && s.rows.contact_submissions.length === 1 && s.relays.length === 1);

  const limitedIp = "203.0.113.99";
  const hash = createHmac("sha256", "test-ip").update(limitedIp).digest("hex");
  for (let i = 0; i < 5; i += 1) {
    state.rows.contact_submissions.push({ id: randomUUID(), created_at: new Date().toISOString(), idempotency_key: randomUUID(), ip_hash: hash, email: "x@example.test", notification_status: "skipped", wordpress_relay_status: "sent" });
  }
  r = await post(contactForm(), limitedIp);
  check("Persistent rate limit: 6th submission from one IP in 10 min → 429", r.status === 429, String(r.status));

  setMock({ wp: "unreachable" });
  const wpDownId = randomUUID();
  r = await post(contactForm({ id: wpDownId }));
  s = await mockState();
  row = s.rows.contact_submissions.find((x) => x.idempotency_key === wpDownId);
  check("WordPress down, Supabase up → success (lead stored), relay marked failed", r.status === 200 && row?.wordpress_relay_status === "failed", row?.wordpress_relay_status);
  r = await retry();
  check("Retry endpoint: no Authorization → 401", r.status === 401);
  r = await retry("Bearer wrong");
  check("Retry endpoint: wrong secret → 401", r.status === 401);
  setMock({ wp: "ok" });
  ageAll(3 * 60_000);
  r = await retry("Bearer test-cron");
  row = state.rows.contact_submissions.find((x) => x.idempotency_key === wpDownId);
  check("Retry endpoint re-relays the failed submission", r.status === 200 && r.body?.relaysSent === 1 && row?.wordpress_relay_status === "sent" && row?.wordpress_relay_attempts === 2, JSON.stringify(r.body));

  // source_path: the pathname only, and only from this site
  const storedSource = async (fd, headers) => {
    const key = fd.get("_kosick_submission");
    await post(fd, freshIp(), headers);
    const table = fd.get("formKey") === "newsletter" ? "newsletter_signups" : "contact_submissions";
    return (await mockState()).rows[table].find((x) => x.idempotency_key === key)?.source_path;
  };
  let source = await storedSource(contactForm({ source: "/contact/?utm_source=mail#form" }));
  check("source_path: query and hash dropped", source === "/contact/", String(source));
  source = await storedSource(contactForm({ source: "https://evil.example/contact/" }));
  check("source_path: another site's URL → null", source === null, String(source));
  source = await storedSource(contactForm({ source: "//evil.example/contact/" }));
  check("source_path: protocol-relative URL → null", source === null, String(source));
  source = await storedSource(contactForm({ source: "C:/Program Files/Git/contact/" }));
  check("source_path: not a path → null", source === null, String(source));
  source = await storedSource(contactForm({ source: null }), { referer: "https://evil.example/about/" });
  check("source_path: no field, another site's Referer → null", source === null, String(source));
  source = await storedSource(contactForm({ source: null }), { referer: `${APP}/about/?ref=x` });
  check("source_path: no field, same-site Referer → its pathname", source === "/about/", String(source));
  source = await storedSource(newsletterForm({ email: "source@example.test", source: "/" }));
  check("source_path: newsletter on the home page → /", source === "/", String(source));

  setMock({ db: "down", wp: "unreachable" });
  r = await post(contactForm());
  check("Supabase down + WordPress down (email off) → 502", r.status === 502);
  setMock({ db: "ok", wp: "ok" });
  await stopApp();

  // 3. Phase 3b: direct email (live) + Turnstile, relay still on
  console.log("\n# Direct email (Resend live) + Turnstile");
  reset();
  await startApp(DIRECT);
  r = await post(contactForm());
  check("Turnstile configured, no token → rejected", r.status === 400 && /security check/.test(r.body?.error || ""));
  r = await post(contactForm({ token: "bad-token" }));
  check("Turnstile configured, invalid token → rejected", r.status === 400);
  check("Turnstile verified server-side with the secret", (await mockState()).turnstile.at(-1)?.secret === "test-turnstile");

  r = await post(contactForm({ token: "good-token" }));
  await waitFor((st) => st.emails.length >= 2);
  s = await mockState();
  let [notification, autoresponse] = s.emails;
  row = s.rows.contact_submissions[0];
  check("Contact: success, redirect /thanks/", r.status === 200 && r.body?.redirect === "/thanks/");
  check("Contact notification: to info@, From, subject, Reply-To visitor, no BCC",
    notification?.to?.[0] === "info@kosick.com" && notification.from === "Kosick Communications Ltd. <info@kosick.com>" &&
    notification.subject === "Kosick Communications Ltd. contact" && notification.reply_to === "visitor@example.test" && !notification.bcc,
    JSON.stringify({ to: notification?.to, subject: notification?.subject, bcc: notification?.bcc }));
  check("Contact notification lists every field, HTML-escaped",
    notification?.text.includes("Phone Number: 604-555-0100") && notification.html.includes("QA &lt;b&gt;Visitor&lt;/b&gt;") && !notification.html.includes("<b>Visitor"));
  check("Contact auto-response: to visitor, subject, Kosick text, no Reply-To",
    autoresponse?.to?.[0] === "visitor@example.test" && autoresponse.subject === "Kosick Communications Ltd. Contact" &&
    autoresponse.text.startsWith("Thank you for visiting Kosick Communications. Your message has been received.") &&
    autoresponse.text.includes("Phone: 604.925.5800") && !autoresponse.reply_to && !autoresponse.text.includes("Line one"));
  check("Contact row: notification sent with provider id, auto-response sent", row?.notification_status === "sent" && row?.notification_id === notification?.id && row?.autoresponse_status === "sent");

  r = await post(newsletterForm({ token: "good-token" }));
  await waitFor((st) => st.emails.length >= 4);
  s = await mockState();
  [notification, autoresponse] = s.emails.slice(2);
  check("Newsletter: success, inline (redirect null)", r.status === 200 && r.body?.redirect === null);
  check("Newsletter notification: subject, Reply-To visitor", notification?.subject === "Kosick Communications Ltd. subscribe form" && notification.reply_to === "reader@example.test" && notification.to[0] === "info@kosick.com");
  check("Newsletter auto-response subject is \"Thanks for subscribing!\"", autoresponse?.subject === "Thanks for subscribing!" && autoresponse.to[0] === "reader@example.test");
  const emailsBefore = s.emails.length;
  const relays = s.relays.length;
  r = await post(newsletterForm({ token: "good-token" }));
  await new Promise((res) => setTimeout(res, 800));
  s = await mockState();
  const repeatRow = s.rows.newsletter_signups.at(-1);
  check("Newsletter repeat within 24 h: success, stored, no emails or relay",
    r.status === 200 && s.rows.newsletter_signups.length === 2 && s.emails.length === emailsBefore && s.relays.length === relays &&
    repeatRow.notification_status === "skipped" && repeatRow.wordpress_relay_status === "skipped");

  for (let i = 0; i < 2; i += 1) await post(contactForm({ token: "good-token", email: "limit@example.test" }));
  await waitFor((st) => st.emails.filter((e) => e.to[0] === "limit@example.test").length >= 2);
  r = await post(contactForm({ token: "good-token", email: "limit@example.test" }));
  await new Promise((res) => setTimeout(res, 800));
  s = await mockState();
  const third = s.rows.contact_submissions.at(-1);
  check("Auto-response limit: 3rd to one address in 24 h skipped, lead still notified",
    s.emails.filter((e) => e.to[0] === "limit@example.test").length === 2 && third.autoresponse_status === "skipped" && third.notification_status === "sent");

  setMock({ resend: "fail" });
  const failId = randomUUID();
  r = await post(contactForm({ token: "good-token", id: failId }));
  await new Promise((res) => setTimeout(res, 800));
  row = state.rows.contact_submissions.find((x) => x.idempotency_key === failId);
  check("Email failure after Supabase write → visitor still gets success", r.status === 200 && r.body?.ok);
  check("…notification marked failed for retry (attempt 1)", row?.notification_status === "failed" && row?.notification_attempts === 1, row?.notification_status);
  setMock({ resend: "ok" });
  ageAll(3 * 60_000);
  r = await retry("Bearer test-cron");
  row = state.rows.contact_submissions.find((x) => x.idempotency_key === failId);
  check("Retry endpoint sends the pending notification and records it", r.body?.notificationsSent === 1 && row?.notification_status === "sent" && row?.notification_attempts === 2 && Boolean(row?.notification_id), JSON.stringify(r.body));

  setMock({ resend: "fail-except-alerts" });
  const giveUpId = randomUUID();
  await post(contactForm({ token: "good-token", id: giveUpId }));
  row = state.rows.contact_submissions.find((x) => x.idempotency_key === giveUpId);
  row.notification_attempts = 4;
  ageAll(3 * 60_000);
  r = await retry("Bearer test-cron");
  s = await mockState();
  const alert = s.emails.find((e) => e.subject.startsWith("Website form delivery failed"));
  check("Retry gives up after 5 attempts and sends an alert", r.body?.alerts === 1 && alert?.to[0] === "info@kosick.com" && alert.text.includes(giveUpId ? row.id : ""), JSON.stringify(r.body));
  r = await retry("Bearer test-cron");
  check("Rows at 5 attempts are not retried again", r.body?.notificationsFailed === 0 && r.body?.alerts === 0, JSON.stringify(r.body));

  setMock({ resend: "ok", wp: "unreachable" });
  r = await post(contactForm({ token: "good-token" }));
  check("WordPress down while Supabase + Resend succeed → success", r.status === 200 && state.rows.contact_submissions.at(-1).notification_status === "sent");
  setMock({ db: "down", wp: "unreachable", resend: "fail" });
  r = await post(contactForm({ token: "good-token" }));
  check("Everything failing (Supabase, WordPress, Resend) → 502", r.status === 502, String(r.status));
  setMock({ db: "ok", wp: "ok", resend: "ok" });
  await stopApp();

  // 4. FORMS_EMAIL=test: every email to the test inbox only
  console.log("\n# Test mode (FORMS_EMAIL=test)");
  reset();
  // Matches the Preview setup: relay off, email in test mode
  const testEnv = { ...DIRECT, FORMS_EMAIL: "test", FORMS_TEST_TO: "qa-inbox@example.test", FORMS_NOTIFY_BCC: "bcc@example.test", FORMS_WORDPRESS_RELAY: "off" };
  delete testEnv.TURNSTILE_SECRET_KEY;
  await startApp(testEnv);
  r = await post(contactForm());
  await waitFor((st) => st.rows.contact_submissions[0]?.autoresponse_status === "sent");
  s = await mockState();
  check("Test mode: every email goes only to FORMS_TEST_TO, no BCC",
    s.emails.length === 2 && s.emails.every((e) => e.to.length === 1 && e.to[0] === "qa-inbox@example.test" && !e.bcc));
  check("Test mode: subjects name the intended recipient",
    s.emails[0]?.subject === "[TEST to info@kosick.com] Kosick Communications Ltd. contact" &&
    s.emails[1]?.subject === "[TEST to visitor@example.test] Kosick Communications Ltd. Contact", s.emails.map((e) => e.subject).join(" | "));
  check("Turnstile off: honeypot + fill time + rate limit still apply, form works", r.status === 200);
  row = s.rows.contact_submissions[0];
  check("Test mode contact row: relay off, both emails sent, both message ids stored",
    row?.wordpress_relay_status === "off" && row.notification_status === "sent" && row.autoresponse_status === "sent" &&
    row.notification_id === s.emails[0]?.id && row.autoresponse_id === s.emails[1]?.id && !row.last_error,
    JSON.stringify({ relay: row?.wordpress_relay_status, n: row?.notification_status, a: row?.autoresponse_status, nid: row?.notification_id, aid: row?.autoresponse_id }));

  r = await post(newsletterForm());
  await waitFor((st) => st.rows.newsletter_signups[0]?.autoresponse_status === "sent");
  s = await mockState();
  row = s.rows.newsletter_signups[0];
  const [nNotification, nAutoresponse] = s.emails.slice(2);
  check("Test mode newsletter: both emails to FORMS_TEST_TO only, subjects name the intended recipient",
    r.status === 200 && s.emails.length === 4 && s.emails.every((e) => e.to.length === 1 && e.to[0] === "qa-inbox@example.test" && !e.bcc) &&
    nNotification?.subject === "[TEST to info@kosick.com] Kosick Communications Ltd. subscribe form" &&
    nAutoresponse?.subject === "[TEST to reader@example.test] Thanks for subscribing!",
    s.emails.slice(2).map((e) => e.subject).join(" | "));
  check("Test mode newsletter row: relay off, both emails sent, both message ids stored",
    row?.wordpress_relay_status === "off" && row.notification_status === "sent" && row.autoresponse_status === "sent" &&
    row.notification_id === nNotification?.id && row.autoresponse_id === nAutoresponse?.id);
  check("Test mode with relay off: nothing sent to WordPress", s.relays.length === 0);
  await stopApp();
} finally {
  await stopApp();
  mock.close();
}

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(passed === results.length ? 0 : 1);
