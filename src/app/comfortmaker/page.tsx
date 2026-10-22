import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { ComfortmakerPageView } from "@/components/microsites/ComfortmakerPageView";
import { getComfortmakerContent } from "@/lib/wordpress/microsites";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/comfortmaker/");
}

export default async function ComfortmakerPage() {
  const content = await getComfortmakerContent();
  return (
    <NativePageShell transparentHeader>
      <ComfortmakerPageView content={content} />
    </NativePageShell>
  );
}
