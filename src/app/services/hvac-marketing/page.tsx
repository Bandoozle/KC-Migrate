import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { HvacMarketingPage as HvacMarketingView } from "@/components/sections/hvac/HvacMarketingPage";
import { getHvacMarketingContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/hvac-marketing/");
}

export default async function HvacMarketingPage() {
  const content = await getHvacMarketingContent();
  return (
    <NativePageShell>
      <HvacMarketingView content={content} />
    </NativePageShell>
  );
}
