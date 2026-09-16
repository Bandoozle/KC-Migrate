import {
  decodeRenderedText,
  getPageBySlug,
  loadWordPressData,
} from "@/lib/wordpress";
import { renderWordPressPage } from "@/lib/render-wordpress-page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");

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

export default async function Home() {
  const pageResult = await loadWordPressData(() => getPageBySlug("home"));

  if (!pageResult.ok) {
    return (
      <main>
        <h1>Kosick Communications</h1>
        <p>The WordPress homepage could not be loaded.</p>
        <p>{pageResult.error}</p>
      </main>
    );
  }

  if (!pageResult.data) {
    return (
      <main>
        <h1>Kosick Communications</h1>
        <p>The WordPress homepage was not found.</p>
      </main>
    );
  }

  return renderWordPressPage(pageResult.data);
}
