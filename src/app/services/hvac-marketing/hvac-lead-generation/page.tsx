import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { getHvacLeadGenerationContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/hvac-marketing/hvac-lead-generation/");
}

export default async function HvacLeadGenerationPage() {
  const content = await getHvacLeadGenerationContent();
  return (
    <NativePageShell>
      <MarketingProgramPageView content={content} />
    </NativePageShell>
  );
}
