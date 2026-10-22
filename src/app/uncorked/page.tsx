import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { UncorkedPageView } from "@/components/microsites/UncorkedPageView";
import { getUncorkedContent } from "@/lib/wordpress/microsites";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/uncorked/");
}

export default async function UncorkedPage() {
  const content = await getUncorkedContent();
  return (
    <NativePageShell transparentHeader>
      <UncorkedPageView content={content} />
    </NativePageShell>
  );
}
