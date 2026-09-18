import { InstagramFeed } from "@/components/wordpress/InstagramFeed";
import { SmartSlider } from "@/components/wordpress/SmartSlider";
import { WordPressBodyClass } from "@/components/wordpress/WordPressBodyClass";
import { WordPressInteract } from "@/components/wordpress/WordPressInteract";
import { WordPressStyles } from "@/components/wordpress/WordPressStyles";
import { getWordPressUrl } from "@/lib/wordpress";
import {
  replaceSingleEntryContent,
  type WordPressDocument,
} from "@/lib/wordpress-document";
import { stripScriptTags } from "@/lib/wordpress-html";
import {
  INSTAGRAM_FEED_COMPAT_CSS,
  extractInstagramFeedHtml,
  hydrateInstagramFeedHtml,
  replaceInstagramFeedShortcodes,
} from "@/lib/wordpress-instagram";
import {
  SMART_SLIDER_COMPAT_CSS,
  hydrateSmartSliderHtml,
} from "@/lib/wordpress-smartslider";
import { hydrateKadenceCountupHtml } from "@/lib/wordpress-countup";
import { KADENCE_TABS_COMPAT_CSS, hydrateKadenceTabsHtml } from "@/lib/wordpress-tabs";
import { KOSICK_POST_WP_DESIGN_CSS } from "@/lib/kosick-post-wp-css";
import { prepareWordPressHtml } from "@/lib/wordpress-urls";
import type { WordPressPage } from "@/types/wordpress";

type WordPressShellProps = {
  document: WordPressDocument;
  page?: WordPressPage | null;
  contentHtml?: string;
};

function pageKeyFromDocument(document: WordPressDocument): string {
  try {
    const url = new URL(document.url);
    return `${url.pathname.replace(/\/+$/, "") || "/"}`;
  } catch {
    return document.url || "/";
  }
}

export function WordPressShell({ document, contentHtml }: WordPressShellProps) {
  const origin = getWordPressUrl();
  const pageKey = pageKeyFromDocument(document);
  const preparedContent = contentHtml
    ? prepareWordPressHtml(stripScriptTags(contentHtml), origin)
    : "";

  const mainHtml =
    preparedContent && document.hasSingleEntryContent
      ? replaceSingleEntryContent(document.innerWrapHtml, preparedContent)
      : document.innerWrapHtml;

  const assembled = `
${document.skipLinkHtml}
${document.headerHtml}
${mainHtml}
${document.hookHtml}
${document.footerHtml}
`.trim();

  const feedHtml =
    extractInstagramFeedHtml(assembled) ||
    extractInstagramFeedHtml(document.innerWrapHtml);
  const markup = hydrateKadenceCountupHtml(
    hydrateKadenceTabsHtml(
      hydrateSmartSliderHtml(
        hydrateInstagramFeedHtml(
          replaceInstagramFeedShortcodes(assembled, feedHtml),
        ),
      ),
    ),
  ).replace(
    /<(?:a|button)\b[^>]*\bid=["']kt-scroll-up(?:-reader)?["'][^>]*>[\s\S]*?<\/(?:a|button)>/gi,
    "",
  );
  const instagramHtml = extractInstagramFeedHtml(markup);

  return (
    <>
      <WordPressStyles
        pageKey={pageKey}
        stylesheets={document.stylesheets}
        preloads={document.preloads}
        inlineCss={[
          document.inlineCss,
          INSTAGRAM_FEED_COMPAT_CSS,
          SMART_SLIDER_COMPAT_CSS,
          KADENCE_TABS_COMPAT_CSS,
        ]
          .filter(Boolean)
          .join("\n\n")}
        designCss={KOSICK_POST_WP_DESIGN_CSS}
      />
      <WordPressBodyClass className={document.bodyClass} pageKey={pageKey} />
      {/*
        Route-keyed subtree forces client islands to remount when soft-navigating
        between pages that share [...slug]/page.tsx (or on HMR HTML swaps).
      */}
      <div key={pageKey} data-wp-page={pageKey}>
        <div
          id="wrapper"
          className="site wp-site-blocks"
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        {document.drawerHtml ? (
          <div
            style={{ display: "contents" }}
            dangerouslySetInnerHTML={{ __html: document.drawerHtml }}
          />
        ) : null}
        {document.extrasHtml ? (
          <div
            style={{ display: "contents" }}
            dangerouslySetInnerHTML={{ __html: document.extrasHtml }}
          />
        ) : null}
        <InstagramFeed pageKey={pageKey} html={instagramHtml} />
        <SmartSlider pageKey={pageKey} />
        <WordPressInteract pageKey={pageKey} />
      </div>
    </>
  );
}
