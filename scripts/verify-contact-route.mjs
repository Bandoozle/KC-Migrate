import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

execSync(
  'curl.exe -sL -w "\\nHTTP:%{http_code}\\n" "http://localhost:3000/contact/" -o tmp-parity/rest/contact.native.html',
  { stdio: "inherit" },
);

const h = readFileSync("tmp-parity/rest/contact.native.html", "utf8");
const checks = {
  kosickNative: /class="[^"]*kosick-native/.test(h) || /kosick-native/.test(h),
  company: /Kosick Communications Ltd\./.test(h),
  offices: /VANCOUVER/.test(h) && /CALGARY/.test(h) && /PHOENIX/.test(h),
  form: /field652327-6b/.test(h) && /Send Message/.test(h),
  formKeyAbsent: !/_kb_adv_form_post_id/.test(h),
  thanksNotYet: true,
  kadenceFormMarkup: /kb-advanced-form|kb-row-layout-wrap/.test(h),
  wpInteractInBody: /data-wordpress-interact/.test(h),
  contactPageView: /ContactPageView|Let’s Work Together|Let's Work Together/.test(h),
  email: /info@kosick\.com/.test(h),
  map: /global-750x750\.png/.test(h),
};
console.log(checks);

// Validation: missing required fields
const missing = execSync(
  'curl.exe -s -X POST "http://localhost:3000/api/contact-form" -F "formKey=contact" -F "field652327-6b=" -F "field4d218f-d3=bad" -F "field7ef1b0-96="',
  { encoding: "utf8" },
);
console.log("validation response", missing);

// Unknown form key
const unknown = execSync(
  'curl.exe -s -X POST "http://localhost:3000/api/contact-form" -F "formKey=nope" -F "email=a@b.com"',
  { encoding: "utf8" },
);
console.log("unknown form", unknown);

writeFileSync(
  "tmp-parity/rest/contact.verify.json",
  JSON.stringify({ checks, missing: JSON.parse(missing), unknown: JSON.parse(unknown) }, null, 2),
);
