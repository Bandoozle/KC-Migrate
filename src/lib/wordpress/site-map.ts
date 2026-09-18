import { cache } from "react";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import { getPageBySlug, WordPressApiError, getWordPressUrl } from "@/lib/wordpress";
import { cleanText, toLocalPath } from "@/lib/wordpress/shared";
import type { DirectorySection } from "@/components/sections/LinkDirectory";

export type SiteMapContent = {
  title: string;
  sections: DirectorySection[];
};

function collectLinks(
  $: CheerioAPI,
  scope: AnyNode,
  origin: string,
): DirectorySection["links"] {
  const links: DirectorySection["links"] = [];
  const seen = new Set<string>();

  $(scope)
    .find("a[href]")
    .each((_, el) => {
      const href = toLocalPath($(el).attr("href") || null, origin);
      const label = cleanText($(el).text());
      if (!href || !label) return;
      const key = `${href}::${label}`;
      if (seen.has(key)) return;
      seen.add(key);
      links.push({ href, label });
    });

  return links;
}

export const getSiteMapContent = cache(async (): Promise<SiteMapContent> => {
  const page = await getPageBySlug("site-map");
  if (!page?.content?.rendered) {
    throw new WordPressApiError(
      "Site map page content was not returned by WordPress REST.",
    );
  }

  const origin = getWordPressUrl();
  const $ = cheerio.load(`<div id="root">${page.content.rendered}</div>`);
  const root = $("#root");
  const sections: DirectorySection[] = [];

  const headings = root
    .find("h2, h3, h4, h5, h6, .wp-block-heading")
    .toArray();

  for (const heading of headings) {
    const title = cleanText($(heading).text());
    if (!title) continue;

    let list = $(heading).nextAll("ul, ol, .wp-block-page-list, .wp-block-latest-posts").first();
    if (!list.length) {
      list = $(heading).parent().find("ul, ol, .wp-block-page-list, .wp-block-latest-posts").first();
    }

    const links = list.length
      ? collectLinks($, list.get(0)!, origin)
      : [];

    if (links.length) sections.push({ title, links });
  }

  if (sections.length === 0) {
    sections.push({
      title: "Pages",
      links: collectLinks($, root.get(0)!, origin),
    });
  }

  return {
    title: cleanText(page.title.rendered) || "Full Site Menu",
    sections,
  };
});
