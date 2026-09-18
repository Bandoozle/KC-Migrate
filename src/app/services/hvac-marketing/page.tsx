import type { Metadata } from "next";
import { NativePageShell } from "@/components/layout/NativePageShell";
import { MarketingProgramPageView } from "@/components/sections/MarketingProgramPageView";
import { decodeRenderedText, getPageBySlug } from "@/lib/wordpress";
import { getHvacMarketingContent } from "@/lib/wordpress/marketing-program";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("hvac-marketing");
  return {
    title: page
      ? decodeRenderedText(page.title.rendered)
      : "HVAC Marketing & Lead Generation | Kosick Communications",
    description: page?.excerpt?.rendered
      ? decodeRenderedText(page.excerpt.rendered)
      : undefined,
  };
}

export default async function HvacMarketingPage() {
  const content = await getHvacMarketingContent();
  return (
    <NativePageShell>
      <MarketingProgramPageView content={content} />
    </NativePageShell>
  );
}
