import { cache } from "react";
import * as cheerio from "cheerio";
import { getPageBySlug, WordPressApiError } from "@/lib/wordpress";
import { cleanText } from "@/lib/wordpress/shared";

export type OnlinePaymentsContent = {
  title: string;
  iframeSrc: string;
  iframeMinHeight: number;
};

export const getOnlinePaymentsContent = cache(
  async (): Promise<OnlinePaymentsContent> => {
    const page = await getPageBySlug("online-payments");
    if (!page?.content?.rendered) {
      throw new WordPressApiError(
        "Online payments page content was not returned by WordPress REST.",
      );
    }

    const $ = cheerio.load(page.content.rendered);
    const iframe = $("iframe").first();
    const src = iframe.attr("src") || "";
    const heightAttr = Number(iframe.attr("height") || "2000");

    if (!src) {
      throw new WordPressApiError(
        "Online payments page is missing the Square checkout iframe.",
      );
    }

    return {
      title: cleanText(page.title.rendered) || "Pay Your Invoice Online",
      iframeSrc: src,
      iframeMinHeight: Number.isFinite(heightAttr) ? heightAttr : 2000,
    };
  },
);
