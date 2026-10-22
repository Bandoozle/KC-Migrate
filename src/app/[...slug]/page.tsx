import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { ArticlePageView } from "@/components/article/ArticlePageView";
import { getPageBySlug } from "@/lib/wordpress";
import { getArticleBySlug } from "@/lib/wordpress/post";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import {
  renderWordPressPage,
  renderWordPressPath,
} from "@/lib/render-wordpress-page";


type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function pathnameFromSegments(segments: string[]): string {
  return `/${segments.join("/")}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug.length === 1 && slug[0] === "home") {
    return rankMathMetadata("/");
  }
  return rankMathMetadata(`/${slug.join("/")}/`);
}

export default async function WordPressSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 1 && slug[0] === "home") {
    redirect("/");
  }

  const last = slug.at(-1);
  let page = null;
  try {
    page = last ? await getPageBySlug(last) : null;
  } catch {
    page = null;
  }
  if (page) {
    return renderWordPressPage(page);
  }

  let article = null;
  if (slug.length === 1) {
    try {
      article = await getArticleBySlug(slug[0]);
    } catch {
      notFound();
    }
  }
  if (article) {
    return (
      <NativePageShell>
        <ArticlePageView content={article} />
      </NativePageShell>
    );
  }

  try {
    return await renderWordPressPath(pathnameFromSegments(slug));
  } catch {
    notFound();
  }
}
