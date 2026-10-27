import type { Metadata } from "next";
import { rankMathMetadata } from "@/lib/seo/rank-math";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { HvacLeadGenerationPage as HvacLeadView } from "@/components/sections/hvac-lead/HvacLeadGenerationPage";
import { getHvacLeadGenerationContent } from "@/lib/wordpress/marketing-program";


export async function generateMetadata(): Promise<Metadata> {
  return rankMathMetadata("/services/hvac-marketing/hvac-lead-generation/");
}

export default async function HvacLeadGenerationPage() {
  const content = await getHvacLeadGenerationContent();
  return (
    <NativePageShell>
      <HvacLeadView content={content} />
    </NativePageShell>
  );
}
