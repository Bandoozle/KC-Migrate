import type { WordPressPreload, WordPressStylesheet } from "@/lib/wordpress-assets";

type WordPressStylesProps = {
  pageKey: string;
  stylesheets: WordPressStylesheet[];
  preloads?: WordPressPreload[];
  inlineCss: string;
  typographyCss?: string;
};

export function WordPressStyles({
  pageKey,
  stylesheets,
  preloads = [],
  inlineCss,
  typographyCss,
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
      {typographyCss ? (
        <style
          id="kosick-inter-typography"
          dangerouslySetInnerHTML={{ __html: typographyCss }}
        />
      ) : null}
    </>
  );
}
