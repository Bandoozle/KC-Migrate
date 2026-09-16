import { stripScriptTags } from "@/lib/wordpress-html";
import {
  hydrateInstagramFeedHtml,
  replaceInstagramFeedShortcodes,
} from "@/lib/wordpress-instagram";
import { hydrateSmartSliderHtml } from "@/lib/wordpress-smartslider";

type WordPressContentProps = {
  html: string;
  className?: string;
  instagramFeedHtml?: string;
};

export function WordPressContent({
  html,
  className,
  instagramFeedHtml = "",
}: WordPressContentProps) {
  const prepared = hydrateSmartSliderHtml(
    hydrateInstagramFeedHtml(
      replaceInstagramFeedShortcodes(stripScriptTags(html), instagramFeedHtml),
    ),
  );

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: prepared }}
    />
  );
}
