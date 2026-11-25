/**
 * Tests for what the site's code does for analytics. No browser and no network: a simulated page (`window`,
 * `dataLayer`) stands in for the browser and nothing is sent to Google.
 *
 *   npm run test:tracking
 *
 * Google Ads conversions are Tag Manager tags (see docs/GOOGLE_ADS_TRACKING.md), so what these tests protect is
 * the contract with the container: the events the page pushes, in the shape the tags read, and nothing more.
 * Whether the container's tags fire and whether Google receives anything is checked with Tag Assistant and in
 * Google Ads, not here.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import { beforeEach, describe, it } from "node:test";
import { fileURLToPath } from "node:url";

// The app imports without file extensions; Node needs them. This hook adds ".ts" where a relative import has none.
register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function resolve(specifier, context, nextResolve) {
  try { return await nextResolve(specifier, context); }
  catch (error) {
    if (/^\\.{1,2}\\//.test(specifier) && !/\\.[a-z]+$/i.test(specifier)) return nextResolve(specifier + ".ts", context);
    throw error;
  }
}`),
  import.meta.url,
);

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const track = await import("../../src/lib/analytics/track.ts");

/** A page: window with a dataLayer on the given host, with or without the stub Analytics.tsx defines. */
function page({ host = "www.kosick.com", stub = false } = {}) {
  const win = { location: { hostname: host, href: `https://${host}/` }, dataLayer: [] };
  if (stub) win.gtag = function () { win.dataLayer.push(arguments); };
  globalThis.window = win;
  return win;
}
const isCommand = (entry) => entry && typeof entry === "object" && Object.prototype.toString.call(entry) === "[object Arguments]";

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_ANALYTICS_ENABLED;
});

/* ------------------------------------------------------------------------------------------------ gtag stub */

describe("window.gtag and dataLayer initialisation", () => {
  const source = read("src/components/analytics/Analytics.tsx");
  const snippet = source.match(/<Script id="gtm-init"[^>]*>\{`([\s\S]*?)`\}<\/Script>/)[1];

  it("the init snippet defines dataLayer and window.gtag before the GTM start event", () => {
    const win = {};
    new Function("window", snippet)(win);
    assert.equal(typeof win.gtag, "function");
    assert.ok(Array.isArray(win.dataLayer));
    assert.equal(win.dataLayer[0].event, "gtm.js", "the GTM start event is still pushed");
    assert.ok("gtm.start" in win.dataLayer[0]);
  });

  it("window.gtag queues the command's own arguments object, as Google's stub does", () => {
    const win = {};
    new Function("window", snippet)(win);
    win.gtag("event", "generate_lead", { form_name: "x" });
    assert.ok(isCommand(win.dataLayer[1]));
    assert.deepEqual([...win.dataLayer[1]], ["event", "generate_lead", { form_name: "x" }]);
  });

  it("does not replace a gtag that already exists, and keeps an existing dataLayer", () => {
    const existing = () => "kept";
    const win = { gtag: existing, dataLayer: ["earlier"] };
    new Function("window", snippet)(win);
    assert.equal(win.gtag, existing);
    assert.equal(win.dataLayer[0], "earlier");
  });

  it("loads no gtag.js, configures no destination and sends no conversion: Tag Manager stays the only loader", () => {
    assert.ok(!/gtag\/js/.test(source), "Analytics.tsx must not load gtag.js");
    const offenders = [];
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (/\.(ts|tsx)$/.test(entry.name)) {
          const text = fs.readFileSync(p, "utf8");
          if (/gtag\(\s*["']config["']/.test(text)) offenders.push(`config: ${p}`);
          if (/["']conversion["']/.test(text.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ""))) offenders.push(`conversion event: ${p}`);
        }
      }
    };
    walk(path.join(root, "src"));
    assert.deepEqual(offenders, [], "the container configures G-XPYR1CEF3E and AW-785313466 and owns every Ads conversion");
  });
});

/* ------------------------------------------------------------------------- the contract with the container */

describe("the contact lead event the container's conversion tags read", () => {
  it("pushes kosick_contact_lead once, with the fields the existing tags read, and nothing else", () => {
    const win = page();
    track.trackFormSuccess(track.FORM_NAMES.contact, { email: "  A@B.co ", phone: "(604) 555-0100", formId: "kb-adv-form-11283-cpt-id" });
    assert.equal(win.dataLayer.length, 1, "no extra push, no clearing push, no gtag command");
    const [lead] = win.dataLayer;
    assert.equal(lead.event, "kosick_contact_lead");
    assert.equal(lead.kb_form_id, "kb-adv-form-11283-cpt-id");
    assert.equal(lead.lead_email, "a@b.co");
    assert.equal(lead.lead_phone, "+16045550100");
    assert.equal(lead.form_name, track.FORM_NAMES.contact);
    assert.ok(!("transaction_id" in lead), "no transaction id unless the form supplies one");
  });

  it("adds the submission id as transaction_id when the form supplies it, for the container to use as a Transaction ID", () => {
    const win = page();
    track.trackFormSuccess(track.FORM_NAMES.contact, { email: "a@b.co", transactionId: "11111111-2222-4333-8444-555555555555" });
    assert.equal(win.dataLayer[0].transaction_id, "11111111-2222-4333-8444-555555555555");
    assert.equal(win.dataLayer.length, 1);
  });

  it("sends the visitor's details only in that one event: never as a gtag command", () => {
    const win = page({ stub: true });
    track.trackFormSuccess(track.FORM_NAMES.contact, { email: "a@b.co", phone: "6045550100", transactionId: "t-1" });
    assert.ok(!win.dataLayer.some(isCommand), "no gtag command carries personal data");
    assert.equal(JSON.stringify(win.dataLayer).includes("a@b.co"), true, "the existing event keeps carrying it, as the container's Enhanced Conversions variable expects");
    assert.equal(win.dataLayer.filter((e) => JSON.stringify(e).includes("a@b.co")).length, 1);
  });

  it("the newsletter keeps its own event and no lead event", () => {
    const win = page();
    track.trackFormSuccess(track.FORM_NAMES.newsletter, { email: "a@b.co" });
    assert.equal(win.dataLayer.length, 1);
    assert.equal(win.dataLayer[0].event, "kosick_newsletter_signup");
    assert.ok(!("transaction_id" in win.dataLayer[0]));
  });

  it("the chat lead keeps exactly the one GA4 generate_lead command it had, with no personal data", () => {
    const win = page({ stub: true });
    track.trackFormSuccess(track.FORM_NAMES.chatLead);
    assert.equal(win.dataLayer.length, 1);
    assert.ok(isCommand(win.dataLayer[0]));
    assert.deepEqual([win.dataLayer[0][0], win.dataLayer[0][1]], ["event", "generate_lead"]);
    assert.equal(win.dataLayer[0][2].form_name, track.FORM_NAMES.chatLead);
    assert.equal(win.dataLayer[0][2].send_to, "G-XPYR1CEF3E");
  });

  it("tel: and mailto: clicks still push only the informational events: the container's link triggers count them", () => {
    const win = page();
    track.trackPhoneClick("tel:+16049255800");
    track.trackEmailClick("mailto:info@kosick.com");
    assert.deepEqual(win.dataLayer.map((e) => e.event), ["phone_click", "email_click"]);
  });

  it("pushes nothing on a preview or local host", () => {
    for (const host of ["localhost", "kc-migrate.vercel.app", "staging.kosick.com"]) {
      const win = page({ host });
      track.trackFormSuccess(track.FORM_NAMES.contact, { email: "a@b.co", transactionId: "t" });
      track.trackPhoneClick("tel:+16049255800");
      assert.equal(win.dataLayer.length, 0, host);
    }
  });
});

/* ----------------------------------------------------------------------------------- forms and the chatbot */

describe("which forms are lead forms, and where tracking sits", () => {
  const contact = read("src/components/contact/ContactForm.tsx");
  const chat = read("src/components/chat/ChatWidget.tsx");
  const newsletter = read("src/components/layout/SiteFooterNewsletter.tsx");

  it("the contact form is marked data-kc-lead and passes its submission id", () => {
    assert.ok(contact.includes('data-kc-lead="1"'));
    assert.ok(contact.includes('transactionId: String(data.get("_kosick_submission")'));
  });

  it("the contact form's success tracking is reached only after a failed response has returned", () => {
    const call = contact.indexOf("trackFormSuccess(FORM_NAMES.contact");
    const fetchAt = contact.lastIndexOf("await fetch(", call);
    const between = contact.slice(fetchAt, call);
    assert.ok(/!response\.ok/.test(between), "failed responses are handled first");
    assert.ok(/return;/.test(between.slice(between.indexOf("!response.ok"))), "and they return before the tracking");
    assert.equal(contact.split("trackFormSuccess(").length - 1, 1, "called once");
  });

  it("the chatbot is untouched: not marked as a contact form, and no Ads conversion", () => {
    assert.ok(!chat.includes("data-kc-lead"));
    assert.ok(!/conversion|trackAds|analytics\/ads/i.test(chat));
    assert.ok(chat.includes("trackFormSuccess(FORM_NAMES.chatLead)"), "its existing GA4 tracking is still there");
  });

  it("the newsletter is not a lead form", () => {
    assert.ok(!newsletter.includes("data-kc-lead"));
    assert.ok(newsletter.includes("FORM_NAMES.newsletter"));
  });
});

/* ----------------------------------------------------------------------------------- phone standardisation */

describe("phone links", () => {
  it("every Kosick tel: link in the source and content is the E.164 form", () => {
    const found = new Map();
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (/\.(ts|tsx|json)$/.test(entry.name)) {
          for (const m of fs.readFileSync(p, "utf8").matchAll(/tel:\+?[0-9]{10,}/g)) found.set(m[0], (found.get(m[0]) ?? 0) + 1);
        }
      }
    };
    walk(path.join(root, "src"));
    assert.deepEqual([...found.keys()].sort(), ["tel:+14038099450", "tel:+16049255800"], "only the Kosick number and the Calgary office remain");
  });

  it("the content export keeps the standard form on the next refresh", () => {
    const script = read("scripts/export-wordpress-content.mjs");
    assert.ok(script.includes("KOSICK_TEL_LINK") && script.includes("tel:+16049255800"));
  });
});

/* ------------------------------------------------------------------------------------ the transaction id */

describe("the lead's transaction id", () => {
  const guard = read("src/components/forms/useFormGuard.tsx");
  const contact = read("src/components/contact/ContactForm.tsx");

  it("is a UUID, issued once per form instance", () => {
    assert.ok(/crypto\.randomUUID/.test(guard), "generated with crypto.randomUUID (or the RFC 4122 fallback)");
    assert.ok(/submissionId\.current = newSubmissionId\(\)/.test(guard));
  });

  it("is the same id the server received: stamped on the FormData before the request, then read back from it", () => {
    const stamp = contact.indexOf("guard.stamp(data)");
    const send = contact.indexOf('await fetch("/api/contact-form/"');
    const read_ = contact.indexOf('transactionId: String(data.get("_kosick_submission")');
    assert.ok(stamp > 0 && send > stamp && read_ > send, "stamp, then fetch, then the id is read from the same FormData");
    assert.ok(/data\.set\("_kosick_submission", submissionId\.current\)/.test(guard));
  });

  it("is stable across retries: a failed attempt does not issue a new id", () => {
    const failed = guard.match(/const failed = useCallback\(([\s\S]*?), \[/)[1];
    assert.ok(!/newSubmissionId/.test(failed), "failed() must not rotate the id");
    assert.ok(/guard\.failed\(\)/.test(contact), "the form calls failed() on every error path");
  });

  it("is unique per successful submission: success issues a new id for the next one", () => {
    const succeeded = guard.match(/const succeeded = useCallback\(([\s\S]*?)\}, \[/)[1];
    assert.ok(/submissionId\.current = newSubmissionId\(\)/.test(succeeded), "succeeded() rotates the id");
    const after = contact.indexOf("guard.succeeded()");
    const tracking = contact.indexOf("trackFormSuccess(FORM_NAMES.contact");
    assert.ok(after > 0 && tracking > after, "the tracking reads the id that was sent, not the new one: it comes from the FormData, not the guard");
    assert.ok(!/guard\.[a-zA-Z]*[iI]d\b/.test(contact), "the form never reads the guard's current id directly");
  });

  it("travels in the event as transaction_id, and only when there is one", () => {
    const win = page();
    track.trackFormSuccess(track.FORM_NAMES.contact, { email: "a@b.co", transactionId: "" });
    assert.ok(!("transaction_id" in win.dataLayer[0]));
    const again = page();
    track.trackFormSuccess(track.FORM_NAMES.contact, { email: "a@b.co", transactionId: "7b2f8f0e-0c53-4d6a-9a5e-2f6a6f0c9d11" });
    assert.equal(again.dataLayer[0].transaction_id, "7b2f8f0e-0c53-4d6a-9a5e-2f6a6f0c9d11");
  });
});

/* ------------------------------------------------------------------ failures and the newsletter fire no lead */

describe("failed submissions and the newsletter never produce a lead event", () => {
  const newsletter = read("src/components/layout/SiteFooterNewsletter.tsx");
  const contact = read("src/components/contact/ContactForm.tsx");

  it("the newsletter tracks only its own event, and only after the request has succeeded", () => {
    assert.ok(!newsletter.includes("FORM_NAMES.contact") && !newsletter.includes("kosick_contact_lead"));
    assert.equal(newsletter.split("trackFormSuccess(").length - 1, 1);
    const failure = newsletter.indexOf('throw new Error("Newsletter submit failed")');
    const call = newsletter.indexOf("trackFormSuccess(FORM_NAMES.newsletter");
    assert.ok(failure > 0 && call > failure, "a failed request throws before the tracking is reached");
  });

  it("the newsletter event is not the lead event", () => {
    const win = page();
    track.trackFormSuccess(track.FORM_NAMES.newsletter, { email: "a@b.co", transactionId: "ignored" });
    assert.equal(win.dataLayer.filter((e) => e.event === "kosick_contact_lead").length, 0);
    assert.ok(!("transaction_id" in win.dataLayer[0]), "the newsletter never carries a lead transaction id");
  });

  it("the contact form's tracking sits after every error branch has returned", () => {
    const call = contact.indexOf("trackFormSuccess(FORM_NAMES.contact");
    const beforeCall = contact.slice(contact.lastIndexOf("try {", call), call);
    for (const marker of ["!response.ok", "!result?.ok", 'setStatus("error")']) {
      assert.ok(beforeCall.includes(marker), `${marker} is handled before the tracking`);
    }
    assert.ok(/return;/.test(beforeCall), "and the error branch returns");
    const afterCall = contact.slice(call, contact.indexOf("} catch", call));
    assert.ok(!/setStatus\("error"\)|setErrorMessage/.test(afterCall), "no error handling falls through to it");
  });
});

/* ----------------------------------------------------------------------------- one initialisation only */

describe("no duplicate tracking initialisation", () => {
  const all = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(entry.name)) all.push([p, fs.readFileSync(p, "utf8")]);
    }
  };
  walk(path.join(root, "src"));
  const count = (re) => all.reduce((n, [, text]) => n + (text.match(re) || []).length, 0);

  it("exactly one GTM init snippet, one GTM loader and one noscript fallback", () => {
    assert.equal(count(/<Script id="gtm-init"/g), 1);
    assert.equal(count(/<Script\s+id="gtm-loader"/g), 1);
    assert.equal(count(/googletagmanager\.com\/ns\.html/g), 1);
    assert.equal(count(/googletagmanager\.com\/gtm\.js/g), 1);
  });

  it("Analytics is mounted once, in the page shell", () => {
    assert.equal(count(/<Analytics\s*\/>/g), 1);
    assert.equal(count(/<AnalyticsPageViews/g), 1);
  });

  it("window.gtag is defined in exactly one place", () => {
    assert.equal(count(/window\.gtag\s*=(?!=)/g), 1);
  });

  it("the container's ids are not hard-coded into any loader", () => {
    assert.equal(count(/googletagmanager\.com\/gtag\/js/g), 0);
    assert.equal(count(/["']AW-785313466\/[A-Za-z0-9_-]+["']/g), 0, "no conversion send_to anywhere in the app");
  });
});
