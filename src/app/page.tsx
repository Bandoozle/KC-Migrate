import { NativePageShell } from "@/components/layout/NativePageShell";
import { HomePageView } from "@/components/home/HomePageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getHomePageContent } from "@/lib/wordpress/home";
import type { Metadata } from "next";


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
  const content = await getHomePageContent();
  return (
    <NativePageShell transparentHeader>
      <HomePageView content={content} />
    </NativePageShell>
  );
}
