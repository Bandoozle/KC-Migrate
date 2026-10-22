import { jsonLdForPath } from "@/lib/seo/rank-math";

type JsonLdProps = {
  pathname: string;
};

function jsonLdMarkup(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** One Rank Math graph per page, from the stored snapshot. */
export function JsonLd({ pathname }: JsonLdProps) {
  const blocks = jsonLdForPath(pathname);
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(block) }}
        />
      ))}
    </>
  );
}
