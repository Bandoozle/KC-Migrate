const fs = require("fs");
const html = fs.readFileSync(process.env.TEMP + "/hvac.html", "utf8");
const start = html.indexOf('class="entry-content');
const end = html.indexOf("</article>", start);
const content = html.slice(start, end);

const rowRe =
  /<div class="kb-row-layout-wrap kb-row-layout-id11571_[^"]+[^>]*>[\s\S]*?<\/div>\s*<\/div>/g;
const rows = [...content.matchAll(rowRe)];
console.log("row blocks found:", rows.length);

for (const r of rows) {
  const id = r[0].match(/kb-row-layout-id11571_[a-f0-9-]+/)?.[0];
  const cols = [...new Set([...r[0].matchAll(/kadence-column11571_[a-f0-9-]+/g)].map((x) => x[0]))];
  const headings = [
    ...r[0].matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi),
  ].map((x) => x[1].replace(/<[^>]+>/g, "").trim());
  const adv = [
    ...r[0].matchAll(
      /class="[^"]*kt-adv-heading11571_[a-f0-9-]+[^"]*"[^>]*>([\s\S]*?)<\/(?:div|h[1-6])>/gi,
    ),
  ]
    .map((x) => x[1].replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
  const layout = [
    ...r[0].matchAll(/kt-has-\d+-columns|kt-row-layout-[a-z-]+/g),
  ].map((x) => x[0]);
  console.log("\n---", id, "---");
  console.log("layout:", layout.join(", "));
  console.log("cols:", cols.join(", "));
  console.log("h1/h2:", headings.join(" | ") || "(none)");
  console.log("adv headings:", adv.slice(0, 4).join(" | ") || "(none)");
  console.log("has image:", /wp-block-kadence-image|wp-block-cover/.test(r[0]));
}
