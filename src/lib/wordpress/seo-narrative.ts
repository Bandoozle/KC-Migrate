import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type { ServicePageContent } from "@/lib/wordpress/service-page-types";

function normalizeHeading(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function paragraphsIn($: cheerio.CheerioAPI, root: cheerio.Cheerio<AnyNode>): string[] {
  if (!root.length) return [];
  const seen = new Set<string>();
  const paragraphs: string[] = [];

  root.find("p").each((_, paragraph) => {
    if ($(paragraph).closest(".wp-block-kadence-infobox, .n2-ss-slider").length) return;
    const clone = $(paragraph).clone();
    clone.find("br").replaceWith(" ");
    clone.find("style, script").remove();
    const text = clone.text().replace(/\s+/g, " ").trim();
    if (text.length < 80 || seen.has(text)) return;
    seen.add(text);
    paragraphs.push(text);
  });

  return paragraphs;
}

/**
 * The service parser keeps the first long paragraph in a column.
 * SEO rows also carry a second paragraph, and the Vancouver block
 * sits outside the parsed features. Restore that copy without adding any.
 */
export function enrichSeoNarrative(
  html: string,
  content: ServicePageContent,
): ServicePageContent {
  const $ = cheerio.load(html);
  const blocks: Array<{ title: string; paragraphs: string[] }> = [];

  $("h1, h2, h3").each((_, heading) => {
    const title = $(heading).text().replace(/\s+/g, " ").trim();
    if (!title || title.length > 140) return;
    const column = $(heading).closest(".wp-block-kadence-column");
    const columnParagraphs = paragraphsIn($, column);
    const paragraphs =
      columnParagraphs.length > 0
        ? columnParagraphs
        : paragraphsIn($, $(heading).closest(".kb-row-layout-wrap"));
    if (paragraphs.length === 0) return;
    blocks.push({ title, paragraphs });
  });

  const features = content.features.map((feature) => {
    const key = normalizeHeading(feature.title);
    const block = blocks.find((item) => {
      const heading = normalizeHeading(item.title);
      return heading === key || heading.includes(key) || key.includes(heading);
    });
    if (!block) return feature;
    return { ...feature, body: block.paragraphs.join("\n\n") };
  });

  const leadSections = [...content.leadSections];
  const vancouver = blocks.find((item) => /vancouver seo/i.test(item.title));
  const alreadyThere = [...features, ...leadSections].some((item) =>
    /vancouver seo/i.test(item.title || ""),
  );
  if (vancouver && !alreadyThere) {
    leadSections.push({
      title: vancouver.title,
      paragraphs: vancouver.paragraphs,
    });
  }

  return {
    ...content,
    features,
    leadSections,
    leadSection: leadSections[0] || content.leadSection,
  };
}
