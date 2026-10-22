import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";
import { getFeatureArticlesContent } from "@/lib/wordpress/feature-articles";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/feature-articles/");
}

export default async function FeatureArticlesPage() {
  const content = await getFeatureArticlesContent();

  return (
    <main>
      <ResourceLibrary articles={content.articles} />
    </main>
  );
}
