import { decodeRenderedText, getPageBySlug, getWordPressUrl } from "@/lib/wordpress";
import {
  renderWordPressPage,
  renderWordPressPath,
} from "@/lib/render-wordpress-page";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

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
  const last = slug.at(-1);
  const page = last ? await getPageBySlug(last) : null;

  if (!page) {
    return { title: "Kosick Communications" };
  }

  return {
    title: decodeRenderedText(page.title.rendered),
    description: page.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : "Kosick Communications",
  };
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

  try {
    return await renderWordPressPath(pathnameFromSegments(slug));
  } catch {
    notFound();
  }
}
