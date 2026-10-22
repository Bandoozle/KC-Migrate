import { NativePageShell } from "@/components/layout/NativePageShell";
import { HomePageView } from "@/components/home/HomePageView";
import { getHomePageContent } from "@/lib/wordpress/home";
import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/");
}

export default async function Home() {
  const content = await getHomePageContent();
  return (
    <NativePageShell transparentHeader>
      <HomePageView content={content} />
    </NativePageShell>
  );
}
