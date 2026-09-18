import { readFileSync } from "node:fs";

const html = readFileSync("tmp-parity/rest/contact.html", "utf8");
const meta = JSON.parse(
  readFileSync("tmp-parity/rest/contact.meta.json", "utf8").replace(/^\uFEFF/, ""),
);

const { normalizeContactHtml } = await import("../src/lib/wordpress/contact.ts").catch(() => ({
  normalizeContactHtml: null,
}));

// contact.ts only exports getContactPageContent — call via dynamic eval of normalize by importing module internals.
// Instead duplicate call through getContactPageContent is async WP — use a small inline re-export test.

const mod = await import("../src/lib/wordpress/contact.ts");
// Force using REST file by monkeypatching is hard; just print keys of form config and parse via private by re-reading.

const { getKadenceForm } = await import("../src/lib/wordpress/kadence-forms.ts");
console.log("form", getKadenceForm("contact"));

// Parse with cheerio mirroring by calling getContactPageContent against live WP if available
try {
  const content = await mod.getContactPageContent();
  console.log(
    JSON.stringify(
      {
        title: content.title,
        offices: content.info.offices,
        company: content.info.company,
        email: content.info.email,
        phone: content.info.phone,
        servicing: content.info.servicing,
        image: content.info.image?.src,
        formHeading: content.formSection.heading,
        lead: content.formSection.lead.slice(0, 80),
        formFields: Object.keys(content.form.fields),
      },
      null,
      2,
    ),
  );
} catch (err) {
  console.error("live fetch failed", err);
  console.log("meta title", meta.title, "html len", html.length);
}
