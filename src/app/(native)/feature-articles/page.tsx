import type { Metadata } from "next";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getFeatureArticlesContent } from "@/lib/wordpress/feature-articles";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("feature-articles");
  if (!page) {
    return { title: "Feature Articles | Kosick Communications" };
  }

  return {
    title: decodeRenderedText(page.title.rendered),
    description: page.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : "The latest in marketing from Kosick Communications.",
  };
}

export default async function FeatureArticlesPage() {
  const content = await getFeatureArticlesContent();

  return (
    <main>
      <ResourceLibrary articles={content.articles} />
    </main>
  );
}
