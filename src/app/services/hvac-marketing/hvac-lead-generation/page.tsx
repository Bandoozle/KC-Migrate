import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getHvacLeadGenerationContent } from "@/lib/wordpress/marketing-program";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("hvac-lead-generation");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "HVAC Lead Generation | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function HvacLeadGenerationPage() {
  const content = await getHvacLeadGenerationContent();
  return (
    <NativePageShell>
      <MarketingProgramPageView content={content} />
    </NativePageShell>
  );
}
