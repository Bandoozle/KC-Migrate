import { readFileSync } from "node:fs";

const h = readFileSync(
  "tmp-parity/rest/article-is-television-advertising-worth-it.native.html",
  "utf8",
);

console.log("body", (h.match(/<body[^>]*>/) || [])[0]);
console.log("main", (h.match(/<main[^>]*>/) || [])[0]);

// Extract visible main content area roughly
const mainStart = h.indexOf("<main");
const mainEnd = h.indexOf("</main>");
const main = h.slice(mainStart, mainEnd);
console.log({
  mainHasKbRow: /kb-row-layout-wrap/.test(main),
  mainHasWpBlockKadence: /wp-block-kadence/.test(main),
  mainHasArticleCta: /article-cta/.test(main),
  mainHasEntryContent: /entry-content/.test(main),
  mainHasWordPressShell: /WordPressShell/.test(main),
  titleText: (main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, "").trim(),
});
