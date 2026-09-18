import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const samples = [
  "is-television-advertising-worth-it",
  "digital-marketing-vs-traditional-advertising",
  "blog-kosick-com-corporate-branding-guide",
  "connected-tv-advertising-canada",
  "hvac-marketing-strategies",
];

const sampleResults = [];
for (const slug of samples) {
  const out = `tmp-parity/rest/article-${slug}.native.html`;
  const code = execSync(
    `curl.exe -sL -o ${out} -w "%{http_code}" "http://localhost:3000/${slug}/"`,
    { encoding: "utf8" },
  ).trim();
  const h = readFileSync(out, "utf8");
  sampleResults.push({
    slug,
    code,
    kosickNative: /kosick-native/.test(h),
    articleView: /ArticlePageView/.test(h),
    hasTitle: /<h1[\s>]/.test(h),
    hasBody: /article|class="[^"]*body/.test(h),
    kadenceRow: /kb-row-layout-wrap/.test(h) && !/wordpress-compat/.test(h),
    wpShell: /WordPressShell|WordPressInteract/.test(h) && /entry-content/.test(h),
    iframe: /player\.vimeo\.com|youtube\.com/.test(h),
    gallery: /article-gallery/.test(h),
    table: /<table[\s>]/.test(h),
    quote: /<blockquote[\s>]/.test(h),
  });
  console.log(sampleResults[sampleResults.length - 1]);
}

const slugs = JSON.parse(readFileSync("tmp-parity/rest/posts-audit.json", "utf8")).slugs;
const all = [];
for (const slug of slugs) {
  const code = execSync(
    `curl.exe -sL -o NUL -w "%{http_code}" "http://localhost:3000/${slug}/"`,
    { encoding: "utf8" },
  ).trim();
  all.push({ slug, code });
  if (code !== "200") console.log("FAIL", slug, code);
}
const ok = all.filter((r) => r.code === "200").length;
console.log(`\nAll posts: ${ok}/${all.length} returned 200`);

writeFileSync(
  "tmp-parity/rest/articles-verify.json",
  JSON.stringify({ sampleResults, all, ok, total: all.length }, null, 2),
);
