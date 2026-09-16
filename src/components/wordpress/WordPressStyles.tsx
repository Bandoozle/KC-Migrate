import type { WordPressPreload, WordPressStylesheet } from "@/lib/wordpress-assets";

type WordPressStylesProps = {
  pageKey: string;
  stylesheets: WordPressStylesheet[];
  preloads?: WordPressPreload[];
  inlineCss: string;
  /** Next.js design system — must load after WP CSS to remain authoritative. */
  designCss?: string;
};

export function WordPressStyles({
  pageKey,
  stylesheets,
  preloads = [],
  inlineCss,
  designCss,
}: WordPressStylesProps) {
  return (
    <>
      {preloads.map((preload) => (
        <link
          key={`${pageKey}::preload::${preload.href}`}
          rel="preload"
          href={preload.href}
          as={preload.as as "font" | "style" | "image" | undefined}
          type={preload.type}
          crossOrigin={preload.crossOrigin}
        />
      ))}
      {stylesheets.map((stylesheet) => (
        <link
          key={`${pageKey}::${stylesheet.id}::${stylesheet.href}`}
          id={stylesheet.id}
          rel="stylesheet"
          href={stylesheet.href}
          precedence="default"
        />
      ))}
      {inlineCss ? (
        <style
          key={`${pageKey}::inline`}
          id="kosick-wp-page-inline-css"
          data-wp-page={pageKey}
          dangerouslySetInnerHTML={{ __html: inlineCss }}
        />
      ) : null}
      {designCss ? (
        <style
          key={`${pageKey}::design`}
          id="kosick-design-system"
          data-wp-page={pageKey}
          dangerouslySetInnerHTML={{ __html: designCss }}
        />
      ) : null}
    </>
  );
}
