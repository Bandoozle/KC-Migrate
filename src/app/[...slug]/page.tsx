import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { ArticlePageView } from "@/components/article/ArticlePageView";
import { isPublicArticleSlug } from "@/lib/public-routes";
import { getArticleBySlug } from "@/lib/wordpress/post";
import { rankMathMetadata } from "@/lib/seo/rank-math";


type PageProps = {
  params: Promise<{ slug: string[] }>;
};

/**
 * Feature articles at /{slug}/. Only slugs in the public inventory render.
 * Every other path (archives, attachment pages, feeds, wp-* files, nested
 * WordPress URLs) is a 404 without asking WordPress. Legacy redirects run in
 * next.config.ts before this route.
 */
function articleSlug(segments: string[]): string | null {
  return segments.length === 1 && isPublicArticleSlug(segments[0]) ? segments[0] : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = articleSlug((await params).slug);
  return slug ? rankMathMetadata(`/${slug}/`) : {};
}

export default async function ArticlePage({ params }: PageProps) {
  const slug = articleSlug((await params).slug);
  if (!slug) notFound();

  let article = null;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }
  if (!article) notFound();

  return (
    <NativePageShell>
      <ArticlePageView content={article} />
    </NativePageShell>
  );
}
