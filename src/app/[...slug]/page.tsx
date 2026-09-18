import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { ArticlePageView } from "@/components/article/ArticlePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getArticleBySlug } from "@/lib/wordpress/post";
import {
  renderWordPressPage,
  renderWordPressPath,
} from "@/lib/render-wordpress-page";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function pathnameFromSegments(segments: string[]): string {
  return `/${segments.join("/")}`;
}

function absoluteUrl(path: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";
  if (site) return `${site}${path.startsWith("/") ? path : `/${path}`}`;
  return path;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const last = slug.at(-1);

  // Prefer WordPress pages over posts when both could match a single segment.
  if (last) {
    const page = await getPageBySlug(last);
    if (page) {
      return {
        title: decodeRenderedText(page.title.rendered),
        description: page.excerpt?.rendered
          ? decodeRenderedText(page.excerpt.rendered)
          : "Kosick Communications",
      };
    }
  }

  if (slug.length === 1) {
    const article = await getArticleBySlug(slug[0]);
    if (article) {
      return {
        title: article.title,
        description: article.excerpt || undefined,
        alternates: { canonical: absoluteUrl(article.path) },
        openGraph: {
          type: "article",
          title: article.title,
          description: article.excerpt || undefined,
          url: absoluteUrl(article.path),
          publishedTime: article.date,
          modifiedTime: article.modified,
          images: article.featuredImage
            ? [{ url: article.featuredImage.src, alt: article.featuredImage.alt }]
            : undefined,
        },
      };
    }
  }

  return { title: "Kosick Communications" };
}

export default async function WordPressSlugPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 1 && slug[0] === "home") {
    redirect("/");
  }

  const last = slug.at(-1);
  const page = last ? await getPageBySlug(last) : null;
  if (page) {
    return renderWordPressPage(page);
  }

  // Top-level post URLs: /{post-slug}/
  if (slug.length === 1) {
    const article = await getArticleBySlug(slug[0]);
    if (article) {
      return (
        <NativePageShell>
          <ArticlePageView content={article} />
        </NativePageShell>
      );
    }
  }

  try {
    return await renderWordPressPath(pathnameFromSegments(slug));
  } catch {
    notFound();
  }
}
