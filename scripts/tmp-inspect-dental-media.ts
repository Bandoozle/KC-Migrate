import * as cheerio from "cheerio";
import { getPageBySlug } from "../src/lib/wordpress";

async function main() {
  const page = await getPageBySlug("dental-marketing");
  const html = page?.content?.rendered || "";
  const $ = cheerio.load(html);

  const needles = [
    "PATIENT ACQUISITION",
    "CONVERSION & REPUTATION",
    "PAID ADVERTISING",
    "RETENTION & ENGAGEMENT",
  ];

  for (const needle of needles) {
    const heading = $("h1,h2,h3,h4,.wp-block-kadence-advancedheading")
      .toArray()
      .find((el) => $(el).text().replace(/\s+/g, " ").toUpperCase().includes(needle));
    if (!heading) {
      console.log("missing", needle);
      continue;
    }
    const row = $(heading).closest(
      ".wp-block-kadence-rowlayout, .kb-row-layout-wrap, .wp-block-media-text",
    );
    const cols = row.find("> .kt-row-column-wrap > .wp-block-kadence-column").toArray();
    console.log("\n==", needle, "cols", cols.length);
    cols.forEach((col, i) => {
      const imgs = $(col)
        .find("img")
        .toArray()
        .map((img) => ({
          src: ($(img).attr("src") || $(img).attr("data-src") || "").slice(-90),
          class: (($(img).attr("class") || "") + "").slice(0, 60),
        }));
      const figures = $(col).find("figure, .wp-block-image, .kb-figure").length;
      const headings = $(col)
        .find(".wp-block-kadence-advancedheading, h1, h2, h3")
        .toArray()
        .map((h) => $(h).text().replace(/\s+/g, " ").trim().slice(0, 60));
      const style = ($(col).attr("style") || "").slice(0, 120);
      console.log(" col", i, { headings, figures, imgs, style });
    });

    // Also check nested leaf columns
    const leaves = row
      .find(".wp-block-kadence-column")
      .toArray()
      .filter((col) => $(col).find(".wp-block-kadence-column").length === 0);
    console.log(
      " leaves",
      leaves.map((col) => ({
        headings: $(col)
          .find(".wp-block-kadence-advancedheading, h1, h2, h3")
          .toArray()
          .map((h) => $(h).text().replace(/\s+/g, " ").trim().slice(0, 40)),
        imgs: $(col)
          .find("img")
          .toArray()
          .map((img) => ($(img).attr("src") || "").slice(-70)),
      })),
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
