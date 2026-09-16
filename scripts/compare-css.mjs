import { readFileSync } from "node:fs";

function sheets(html) {
  return [...html.matchAll(/<link\b[^>]*rel=['"]stylesheet['"][^>]*>/gi)].map((m) => {
    const href = (m[0].match(/href=['"]([^'"]+)/i)?.[1] || "")
      .replace(/^https:\/\/staging\.kosick\.com/, "")
      .replace(/\?.*$/, "");
    const id = m[0].match(/id=['"]([^'"]+)/i)?.[1] || "";
    return `${id} ${href}`;
  });
}

function styleIds(html) {
  return [...html.matchAll(/<style\b[^>]*id=['"]([^'"]+)/gi)].map((m) => m[1]);
}

async function compare(label, stagingPath, localPath) {
  const staging = readFileSync(stagingPath, "utf8");
  const local = await fetch(`http://localhost:3000${localPath}`).then((r) => r.text());
  const stagingSheets = sheets(staging);
  const localSheets = sheets(local);
  const missingSheets = stagingSheets.filter((s) => !localSheets.includes(s));
  const extraSheets = localSheets.filter((s) => !stagingSheets.includes(s));
  const stagingStyles = styleIds(staging);
  const localHasKadenceBlocks = local.includes("kadence_blocks_css") || /kb-row-layout-id\d+/.test(local);
  const stagingInlineLen = [...staging.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].reduce((n, m) => n + m[1].length, 0);
  const localInlineLen = [...local.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].reduce((n, m) => n + m[1].length, 0);

  console.log("\n====", label);
  console.log("body local ", local.match(/<body[^>]*class="([^"]*)"/)?.[1]);
  console.log("missing sheets", missingSheets);
  console.log("extra sheets", extraSheets);
  console.log("staging style ids", stagingStyles);
  console.log("local has kadence blocks css/classes", localHasKadenceBlocks);
  console.log("inline css chars staging/local", stagingInlineLen, localInlineLen);
  console.log("smartslider css", local.includes("smartslider.min.css"));
  console.log("n2-ss", local.includes("n2-ss-"));
  console.log("footer hook", local.includes("kb-row-layout-id11279_962a22-df"));
  console.log("header button", /header-button button-size-custom/.test(local));
}

await compare("home", "tmp-parity/home.html", "/");
await compare("services", "tmp-parity/services.html", "/services");
await compare("digital-marketing", "tmp-parity/digital-marketing.html", "/services/digital-marketing");
await compare("corporate-branding", "tmp-parity/corporate-branding.html", "/services/corporate-branding");
await compare("contact", "tmp-parity/contact.html", "/contact");
await compare("feature-articles", "tmp-parity/feature-articles.html", "/feature-articles");
